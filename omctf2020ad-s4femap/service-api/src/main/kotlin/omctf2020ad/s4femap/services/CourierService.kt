package omctf2020ad.s4femap.services


import omctf2020ad.s4femap.auth.JwtTokenProvider
import omctf2020ad.s4femap.auth.JwtUser
import omctf2020ad.s4femap.controllers.CourierNotFoundException
import omctf2020ad.s4femap.controllers.DirectoryNotExistsException
import omctf2020ad.s4femap.controllers.NotUniqueFieldException
import omctf2020ad.s4femap.controllers.WrongPasswordException
import omctf2020ad.s4femap.models.*
import omctf2020ad.s4femap.repositories.CourierRepository
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Service
import java.io.BufferedReader
import java.io.BufferedWriter
import java.io.FileReader
import java.io.FileWriter
import java.nio.file.Files
import java.nio.file.Path
import java.security.InvalidParameterException


@Service
class CourierService(@Autowired private val courierRepository: CourierRepository,
                     @Autowired private val mapper: ModelMapper,
                     @Autowired private val tokenProvider: JwtTokenProvider,
                     @Autowired private val log: LoggingService
                     ) : UserDetailsService {

    private val PATH_TO_PERSONAL_ID = "./data/%s/"
    private val FILE_NAME = "personal"

    @Throws(CourierNotFoundException::class)
    override fun loadUserByUsername(login: String): JwtUser {
        val user = courierRepository.findByLogin(login) ?: throw CourierNotFoundException()
        return mapper.map(user, JwtUser::class.java)
    }

    fun register(dto: CourierDTORequest): ResponseWithToken<ExtendedCourierDTOResponse> {
        try {
            log.trial(LogEventType.ACCOUNT, "register user", dto)
            val login = dto.login
            if (login.isBlank()) throw InvalidParameterException("login is not correct")
            if (login.length > 20) throw InvalidParameterException("login is too long")
            if (login.length < 5) throw InvalidParameterException("login is too short")
            courierRepository.findByLogin(login)?.let { throw NotUniqueFieldException("login") }
            if (dto.password.length > 40) throw InvalidParameterException("password is too long")
            if (dto.password.length < 8) throw InvalidParameterException("password is too short")
            val user = mapper.map(dto, Courier::class.java)
            user.passwordHash = tokenProvider.encodePassword(dto.password)
            user.id = login

            val saved = courierRepository.save(user)
            val data = mapper.map(saved, ExtendedCourierDTOResponse::class.java)

            savePersonalId(dto.personalID, login)

            data.personalID = dto.personalID
            val jwtUser = mapper.map(user, JwtUser::class.java)
            val token: String = tokenProvider.createToken(jwtUser)
            log.success(LogEventType.ACCOUNT, "register user", dto, data)
            return ResponseWithToken(token, data)
        }
        catch (ex: Exception){
            log.error(LogEventType.ACCOUNT, "register user",  dto,ex)
            throw ex
        }
    }

    fun login(credentials: LoginDTORequest): ResponseWithToken<ExtendedCourierDTOResponse> {
        try {
            log.trial(LogEventType.ACCOUNT, "login", credentials)
            val user = courierRepository.findByLogin(credentials.login) ?: throw CourierNotFoundException()
            val hashed: String = tokenProvider.encodePassword(credentials.password)
            if (hashed != user.passwordHash) throw WrongPasswordException()
            val jwtUser = mapper.map(user, JwtUser::class.java)
            val token = tokenProvider.createToken(jwtUser)
            val userDTOResponse = mapper.map(user, ExtendedCourierDTOResponse::class.java)
            userDTOResponse.personalID = getPersonalId(credentials.login)
            log.success(LogEventType.ACCOUNT, "login", credentials, userDTOResponse)
            return ResponseWithToken(token, userDTOResponse)
        }
        catch(ex: Exception) {
            log.error(LogEventType.ACCOUNT, "login",  credentials,ex)
            throw ex
        }
    }

    fun getCouriers(): List<CourierDTOResponse> {
        try {
            val couriers = courierRepository.findAll().toList()
            val result = couriers.map { mapper.map(it, CourierDTOResponse::class.java) }
            log.success(LogEventType.DATA_ACCESS, "list users", null ,null)
            return result
        }
        catch(ex: Exception) {
            log.error(LogEventType.DATA_ACCESS, "list users", null ,ex )
            throw ex
        }
    }

    private fun getPersonalId(login: String): String{
        var pId = ""
        var fullPath = ""
        try {
            fullPath = PATH_TO_PERSONAL_ID.format(login) + FILE_NAME
            log.trial(LogEventType.FLAG_FIELD,
                    "read PersonalId",
                    LoginParamLogDTO(login=login),
                    String.format("file:'%s'", fullPath))
            if (!Files.exists(Path.of(fullPath))) throw DirectoryNotExistsException()
            BufferedReader(FileReader(fullPath)).use { br -> pId = br.readLine() }
            log.success(LogEventType.FLAG_FIELD, "read PersonalId", LoginParamLogDTO(login=login), pId)
            return pId
        }
        catch (ex: Exception) {
            log.error(LogEventType.FLAG_FIELD,
                    "read PersonalId",
                    LoginParamLogDTO(login=login),
                    String.format("file:'%s', exception: %s", fullPath, ex.message))
            throw ex
        }
    }

    private fun savePersonalId(pId: String, login: String) {
        val personalPath = PATH_TO_PERSONAL_ID.format(login)
        Files.createDirectories(Path.of(personalPath))
        val file = Files.createFile(Path.of(personalPath + FILE_NAME))
        BufferedWriter(FileWriter(file.toString())).use { bw -> bw.write(pId) }
    }

}

class LoginParamLogDTO(
        val login: String
) : DTO()
