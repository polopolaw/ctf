package omctf2020ad.underpost.services

import omctf2020ad.underpost.auth.JwtTokenProvider
import omctf2020ad.underpost.auth.JwtUser
import omctf2020ad.underpost.controllers.NotUniqueFieldException
import omctf2020ad.underpost.controllers.UserNotFoundException
import omctf2020ad.underpost.controllers.WrongPasswordException
import omctf2020ad.underpost.models.*
import omctf2020ad.underpost.repositories.UserRepository
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import java.security.InvalidParameterException
import java.util.UUID


/*
Provides all methods connected with users - parcel customers
contains users' info functions, register, users' data changing etc
 */
@Service
class UserService(@Autowired private val userRepository: UserRepository,
                  @Autowired private val mapper: ModelMapper,
                  @Autowired private val tokenProvider: JwtTokenProvider,
                  @Autowired private val log: LoggingService
) : UserDetailsService {

    private val adminrole: String = "admin"
    private val userrole: String = "user"

    @Value("\${app.adminpwd}")
    private lateinit var adminpwd: String

    @Value("\${app.adminlogin}")
    private lateinit var adminlogin: String

    @Throws(UsernameNotFoundException::class)
    override fun loadUserByUsername(login: String): JwtUser {
        val user = getAccountByLogin(login)
        return mapper.map(user, JwtUser::class.java)
    }

    /**
     * returns list of all existing users with public data
     */
    fun getUsers(): List<UserDTOResponse> {
        try {
            val data = userRepository.findAll()

            val auth = SecurityContextHolder.getContext().authentication
            val user = auth.principal as User

            if (user.role != adminrole) {
                //cut data to basic
                val result = data.map { mapper.map(it, UserDTOResponse::class.java) }
                log.success(LogEventType.ACCOUNT, "list users", null, result, "as user")
                return result
            } else {
                val resultAdm = data.map { mapper.map(it, ExtendedUserDTOResponse::class.java) }
                log.success(LogEventType.ACCOUNT, "list users", null, resultAdm, "as admin")
                return resultAdm
            }
        } catch (ex: Exception) {
            log.error(LogEventType.ACCOUNT, "list users", null, ex)
            throw ex
        }
    }

    //returns current user info
    fun getMe(): ExtendedUserDTOResponse {
        try {
            val user = loadUser()
            val result = mapper.map(user, ExtendedUserDTOResponse::class.java)
            log.success(LogEventType.ACCOUNT, "get my profile", null, result)
            return result
        } catch (ex: Exception) {
            log.error(LogEventType.ACCOUNT, "get my profile", null, ex)
            throw ex
        }
    }

    /**
     * creates new user in the system with base fields
     */
    fun register(dto: UserDTORequest): ResponseWithToken<ExtendedUserDTOResponse> {
        try {
            userRepository.findByLogin(dto.login)?.let { throw NotUniqueFieldException("login") }
            if (dto.login == adminlogin) throw NotUniqueFieldException("login")

            if (dto.login.length < 3) throw InvalidParameterException("login is too short")
            if (dto.login.length > 50) throw InvalidParameterException("login is too long")
            val regex = "^[a-zA-Z0-9]+$".toRegex()
            if (!regex.containsMatchIn(dto.login)) throw InvalidParameterException("login has incorrect symbols")
            if (dto.answer.length < 3) throw InvalidParameterException("answer is too short")
            if (dto.question.length == 0) throw InvalidParameterException("question cannot be empty")
            if (dto.password.length > 50) throw InvalidParameterException("password is too long")
            if (dto.password.length < 3) throw InvalidParameterException("password is too short")
            if (dto.contactNumber.length < 6) throw InvalidParameterException("contact number is too short")
            if (dto.contactNumber.length > 13) throw InvalidParameterException("contact number is too long")
            if (dto.personalID.length == 0) throw InvalidParameterException("personal ID cannot be empty")

            val user = mapper.map(dto, User::class.java)
            user.passwordHash = tokenProvider.encodePassword(dto.password)
            user.id = UUID.randomUUID().toString()
            user.role = userrole
            user.answer = tokenProvider.encodePassword(dto.answer)

            userRepository.findByLogin(dto.login)

            val saved = userRepository.save(user)
            log.success(LogEventType.FLAG_FIELD, "register user", dto, user.personalID, "save personalID")
            val data = mapper.map(saved, ExtendedUserDTOResponse::class.java)

            val jwtUser = mapper.map(user, JwtUser::class.java)
            val token: String = tokenProvider.createToken(jwtUser)

            val result = ResponseWithToken(token, data)
            log.success(LogEventType.ACCOUNT, "register user", dto, result)
            return result
        } catch (ex: Exception) {
            log.error(LogEventType.ACCOUNT, "register user", dto, ex)
            throw ex
        }
    }

    /**
     * returns existing user's data based on provided login if password is correct
     */
    fun login(credentials: LoginDTORequest): ResponseWithToken<ExtendedUserDTOResponse> {
        try {
            val user = getAccountByLogin(credentials.login)
            val hashed: String = tokenProvider.encodePassword(credentials.password)
            if (hashed != user.passwordHash) throw WrongPasswordException()
            val jwtUser = mapper.map(user, JwtUser::class.java)
            val token = tokenProvider.createToken(jwtUser)
            val userDTOResponse = mapper.map(user, ExtendedUserDTOResponse::class.java)
            val result = ResponseWithToken(token, userDTOResponse)
            log.success(LogEventType.ACCOUNT, "login", credentials, result)
            return result
        } catch (ex: Exception) {
            log.error(LogEventType.ACCOUNT, "login", credentials, ex)
            throw ex
        }
    }

    /**
     * returns question which should be answered to restore password
     */
    fun getRestoringQuestion(login: String): String {
        try {
            val user = getAccountByLogin(login)
            if (user.role != userrole) throw UserNotFoundException()
            val result =  user.question
            log.success(LogEventType.ACCOUNT, "get access restore question", LoginLogDTO(login = login), result )
            return result
        } catch (ex: Exception) {
            log.error(LogEventType.ACCOUNT, "get access restore question", LoginLogDTO(login = login), ex )
            throw ex
        }

    }

    /**
     * logs in user with provided login if answer is correct
     */
    fun restorePass(request: RecoveryDTORequest): ResponseWithToken<ExtendedUserDTOResponse> {
        try {
            val user = getAccountByLogin(request.login)
            if (user.role != userrole) throw UserNotFoundException() //only for user role allowed
            val answerHashed = tokenProvider.encodePassword(request.answer)
            if (answerHashed != user.answer) throw WrongPasswordException()
            val jwtUser = mapper.map(user, JwtUser::class.java)
            val token = tokenProvider.createToken(jwtUser)
            val userDTOResponse = mapper.map(user, ExtendedUserDTOResponse::class.java)
            val result = ResponseWithToken(token, userDTOResponse)
            log.success(LogEventType.ACCOUNT, "get access via secret answer", request, result)
            return result
        } catch (ex: Exception) {
            log.error(LogEventType.ACCOUNT, "get access via secret answer", request, ex)
            throw ex
        }
    }

    /**
     * allows already logged in user to change his password
     */
    fun changePass(requestDto: PasswordUpdateDTORequest) {
        try {
            if (requestDto.password.length > 50) throw InvalidParameterException("password is too long")
            if (requestDto.password.length < 3) throw InvalidParameterException("password is too short")
            val user = SecurityContextHolder.getContext().authentication.principal as User
            if (user.role != userrole) throw UserNotFoundException() //only for user role allowed
            val updatedUser = userRepository.findById(user.id).orElseThrow()
            updatedUser.passwordHash = tokenProvider.encodePassword(requestDto.password)
            userRepository.save(updatedUser)
            log.success(LogEventType.ACCOUNT, "change password", requestDto, null)
        } catch (ex: Exception) {
            log.error(LogEventType.ACCOUNT, "change password", requestDto, ex)
            throw ex
        }
    }

    //update any of provided fields if they're correct
    fun updateProfile(requestDto: UserUpdateDTORequest): ExtendedUserDTOResponse {
        try {
            val user = loadUser()

            requestDto.contactNumber?.let {
                if (it.length < 6) throw InvalidParameterException("contact number is too short")
                user.contactNumber = it
            }
            /*
            requestDto.secretQuestion?.let {
                if (it.length == 0) throw InvalidParameterException("question cannot be empty")
                user.question = it
            }

            requestDto.secretAnswer?.let {
                if (it.length < 3) throw InvalidParameterException("answer is too short")
                user.answer = tokenProvider.encodePassword(it)
            }

            requestDto.personalID?.let {
                if (it.length == 0) throw InvalidParameterException("personalID cannot be empty")
                user.personalID = it
            } */
            userRepository.save(user)
            val result = mapper.map(user, ExtendedUserDTOResponse::class.java)
            log.success(LogEventType.ACCOUNT, "update profile", requestDto, result)
            return result
        } catch (ex: Exception) {
            log.error(LogEventType.ACCOUNT, "update profile", requestDto, ex)
            throw ex
        }
    }

    fun getProviders(): List<String> = listOf("BRG", "EKC")

    fun getAdminUser(): User {
        val admin = User()
        admin.id = UUID(0L, 0L).toString()
        admin.login = adminlogin
        admin.role = adminrole
        admin.passwordHash = tokenProvider.encodePassword(adminpwd)
        return admin
    }

    internal fun getAccountByLogin(login: String): User {
        return if (login == adminlogin)
            getAdminUser()
        else
            userRepository.findByLogin(login) ?: throw UserNotFoundException()
    }

    internal fun loadUser(): User {
        val login = getCurrentUser().login
        return getAccountByLogin(login)
    }

    internal fun getCurrentUser() : User {
        val auth = SecurityContextHolder.getContext().authentication
        return  auth.principal as User
    }

}

class LoginLogDTO(
    val login: String? = null
)