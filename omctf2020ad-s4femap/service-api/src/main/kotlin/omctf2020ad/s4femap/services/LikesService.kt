package omctf2020ad.s4femap.services

import omctf2020ad.s4femap.auth.JwtUser
import omctf2020ad.s4femap.controllers.CourierNotFoundException
import omctf2020ad.s4femap.controllers.MarkNotFoundException
import omctf2020ad.s4femap.models.*
import omctf2020ad.s4femap.repositories.CourierRepository
import omctf2020ad.s4femap.repositories.LikeRepository
import omctf2020ad.s4femap.repositories.MarkRepository
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.security.InvalidParameterException
import java.util.*

@Service
class LikesService(@Autowired private val markRepository: MarkRepository,
                   @Autowired private val courierRepository: CourierRepository,
                   @Autowired private val likesRepository: LikeRepository,
                   @Autowired private val mapper: ModelMapper,
                   @Autowired private val log: LoggingService
                    ) {

    fun toggleLike(markId: String): Boolean {
        val mark = markRepository.findById(markId)
        if (mark.isEmpty) throw MarkNotFoundException()

        val auth = SecurityContextHolder.getContext().authentication
        val user = auth.principal as JwtUser
        val courier = courierRepository.findById(user.username)
        if (courier.isEmpty) throw CourierNotFoundException()
        var like = likesRepository.getLikeByMarkIdAndAuthorId(markId, user.username)
        val result =  if (like == null) {
            like = Like()
            like.id = UUID.randomUUID().toString()
            like.mark = mark.get()
            like.author = courier.get()
            likesRepository.save(like)
            true;
        } else {
            likesRepository.delete(like)
            false;
        }
        return result

    }

    fun isLiked(markId: String): Boolean {
        return (getLike(markId) != null)
    }

    private fun getLike(markId: String): Like? {
        val auth = SecurityContextHolder.getContext().authentication
        val user = auth.principal as JwtUser
        return likesRepository.getLikeByMarkIdAndAuthorId(markId, user.username)
    }
}


