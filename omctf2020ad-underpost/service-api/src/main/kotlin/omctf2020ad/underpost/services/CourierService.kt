package omctf2020ad.underpost.services

import omctf2020ad.underpost.auth.JwtTokenProvider
import omctf2020ad.underpost.controllers.NotUniqueFieldException
import omctf2020ad.underpost.models.*
import omctf2020ad.underpost.repositories.BunkerRepository
import omctf2020ad.underpost.repositories.CourierRepository
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.security.InvalidParameterException
import java.util.*

/*
Provides all methods connected with bunkers
contains bunkers' info functions, creating new etc
 */
@Service
class CourierService(@Autowired private val courierRepository: CourierRepository,
                     @Autowired private val bunkerRepository: BunkerRepository,
                     @Autowired private val tokenProvider: JwtTokenProvider,
                     @Autowired private val mapper: ModelMapper,
                     @Autowired private val log: LoggingService
) {

    fun getCouriers(): List<CourierDTOResponse> {
        try {
            val couriers = courierRepository.findAll().toList()
            val auth = SecurityContextHolder.getContext().authentication.principal as User
            return if (auth.role != "admin") {
                //cut data to basic
                val result = couriers.map { mapper.map(it, CourierDTOResponse::class.java) }
                //log.success(LogEventType.DATA_ACCESS, "list couriers", null, result, "as user")
                return result
            } else {
                val resultAdm = couriers.map { mapper.map(it, ExtendedCourierDTOResponse::class.java) }
                log.success(LogEventType.DATA_ACCESS, "list couriers", null, resultAdm, "as admin")
                return resultAdm
            }
        } catch (ex: Exception) {
            log.error(LogEventType.DATA_ACCESS, "list couriers", null, ex)
            throw ex
        }
    }

    fun createCourier(courier: CourierDTORequest): ExtendedCourierDTOResponse {
        courierRepository.findByNickname(courier.nickname)?.let { throw NotUniqueFieldException("nickname") }
        bunkerRepository.findByPositionX(courier.positionX)
                .find { it.positionY == courier.positionY }
                ?: throw InvalidParameterException("should be coordinates of existing bunker")

        val c = mapper.map(courier, Courier::class.java)
        c.id = courier.nickname;
        val saved = courierRepository.save(c)
        val result = mapper.map(saved, ExtendedCourierDTOResponse::class.java)
        return result
    }

}