package omctf2020ad.s4femap.services

import omctf2020ad.s4femap.auth.JwtUser
import omctf2020ad.s4femap.controllers.CourierNotFoundException
import omctf2020ad.s4femap.controllers.MarkNotFoundException
import omctf2020ad.s4femap.models.*
import omctf2020ad.s4femap.repositories.CommentsRepository
import omctf2020ad.s4femap.repositories.CourierRepository
import omctf2020ad.s4femap.repositories.MarkRepository
import org.apache.tomcat.util.codec.binary.Base64
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.security.InvalidParameterException
import java.util.*
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec


@Service
class CommentsService(@Autowired private val markRepository: MarkRepository,
                      @Autowired private val markService: MarkService,
                      @Autowired private val courierRepository: CourierRepository,
                      @Autowired private val commentsRepository: CommentsRepository,
                      @Autowired private val mapper: ModelMapper,
                      @Autowired private val log: LoggingService
                    ){

    fun create(markId: String,  dto: CreateCommentDTORequest): Response<CommentDTO> {
        try {
            log.trial(LogEventType.DATA_ACCESS,
                    "create comment",
                    dto)

            val mark = markRepository.findById(markId)
            if (mark.isEmpty()) throw MarkNotFoundException()

            if (dto.description.length > 100) throw InvalidParameterException("Description is too long")
            if (dto.description.isEmpty()) throw InvalidParameterException("Description is empty")
            val comment = mapper.map(dto, Comment::class.java)
            val auth = SecurityContextHolder.getContext().authentication
            val authUser = auth.principal as JwtUser
            val user = courierRepository.findByLogin(authUser.username)!!

            comment.mark = mark.get()
            comment.id = UUID.randomUUID().toString()
            /*
            if (comment.isPrivate && dto.sharedWith.isNullOrEmpty()) {
                //for private and not specified sharedWith - then user creates comment for himself
                dto.sharedWith = user.login
            }*/

            if (comment.isPrivate) {

                val target: Courier? = if(!dto.sharedWith.isNullOrEmpty()) {
                    courierRepository.findByLogin(dto.sharedWith!!) ?: throw CourierNotFoundException()
                } else {
                    null
                }

                if (mark.get().isPrivate
                    && mark.get().author.id != user.id
                    && mark.get().sharedWith?.id != user.id
                    || (mark.get().isPrivate && target != null
                        && mark.get().author.id != target?.id
                        && mark.get().sharedWith?.id != target?.id
                        )
                )  throw InvalidParameterException("Cannot add private comment for the specified user")

                val key = createKey(user.id, target?.id)
                comment.description = encodePrivateComment(key, comment.description)
                comment.sharedWith = target
            }
            comment.author = user

            val saved = commentsRepository.save(comment)
            val data = mapper.map(saved, CommentDTO::class.java)
            data.description = decodeCommentDescription(user.id, saved)
            log.success(LogEventType.DATA_ACCESS,
                    "create comment",
                    dto,
                    data)
            return Response(data)
        }
        catch(ex: Exception) {
            log.error(LogEventType.DATA_ACCESS,
                    "create comment",
                    dto,
                    ex)
            throw ex
        }
    }

    fun listAll(markId: String): Response<List<CommentDTO>> {
        try {
            val auth = SecurityContextHolder.getContext().authentication
            val authUser = auth.principal as JwtUser
            val markOpt = markRepository.findById(markId)
            if (markOpt.isEmpty) throw MarkNotFoundException()
            val mark = markOpt.get()
            markService.validatePermissions(mark)
            val userId = authUser.username
            val list = commentsRepository.selectAvailableByMarkIdAndCourierId(markId, userId)
            val data = list
                    .map({ x: Comment -> convertToCommentDTOWithDecode(userId, x) })

            log.success(LogEventType.DATA_ACCESS,
                    "list comments",
                    null,
                    null)

            return Response(data)
        }
        catch(ex: Exception) {
            log.error(LogEventType.DATA_ACCESS,
                    "list comments",
                     null,
                     ex)
            throw ex
        }
    }

    fun convertToCommentDTOWithDecode(currentUserId: String, comment: Comment) : CommentDTO {
        var dto = mapper.map(comment, CommentDTO::class.java)!!
        dto.description = decodeCommentDescription(currentUserId, comment)
        return dto
    }

    /**
     * only if currentUserId is authorized to read message then it decoded correctly
     */
    private fun decodeCommentDescription(currentUserId:String, comment:Comment) : String {
        if(comment.isPrivate) {
            val key = if(comment.sharedWith == null)
                createKey(currentUserId, null) //current user assumed to be author
            else {
                //current user assumed be author or sharedWith
                if (comment.sharedWith?.id != currentUserId) createKey(currentUserId, comment.sharedWith?.id) else createKey(comment.author.id, currentUserId)
            }
            return decodePrivateComment(key, comment.description)
        }
        else {
            return comment.description
        }
    }

    private fun createKey(authorId: String, sharedWithId: String?): String {
        return if(sharedWithId != null) "$authorId$sharedWithId" else authorId
    }

    private fun encodePrivateComment(key: String, comment: String) : String {
        val keyBytes = getKey128bit(key).toByteArray()
        val keySpec = SecretKeySpec(keyBytes, "AES")
        val cipher: Cipher = Cipher.getInstance("AES")
        cipher.init(Cipher.ENCRYPT_MODE, keySpec)
        val encrypted: kotlin.ByteArray = cipher.doFinal(comment.toByteArray())!!
        return Base64.encodeBase64String(encrypted)
    }

    private fun decodePrivateComment(key: String, encryptedComment: String) : String {
        try {
            val encrypted: kotlin.ByteArray = Base64.decodeBase64(encryptedComment)
            val keyBytes = getKey128bit(key).toByteArray()
            val keySpec = SecretKeySpec(keyBytes, "AES")
            val cipher: Cipher = Cipher.getInstance("AES")
            cipher.init(Cipher.DECRYPT_MODE, keySpec)
            val decrypted: kotlin.ByteArray = cipher.doFinal(encrypted)!!
            val result = String(decrypted)
            log.success(LogEventType.FLAG_FIELD,
                    "private comment message decryption",
                    null,
                    result)
            return result
        }
        catch(ex: Exception) {
            log.error(LogEventType.FLAG_FIELD,
                    "private comment message decryption",
                    null,
                    ex)
            return encryptedComment
        }
    }

    private fun getKey128bit(key: String) : String {
        var normKey = key
        while(normKey.length < 16) {
            normKey += normKey
        }
        return normKey.substring(0, 16)
    }

}