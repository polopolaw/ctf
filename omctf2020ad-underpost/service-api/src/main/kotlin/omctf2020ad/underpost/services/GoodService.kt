package omctf2020ad.underpost.services

import omctf2020ad.underpost.controllers.NotUniqueFieldException
import omctf2020ad.underpost.controllers.ObjectNotFoundException
import omctf2020ad.underpost.helpers.MapUtils
import omctf2020ad.underpost.models.*
import omctf2020ad.underpost.repositories.BunkerRepository
import omctf2020ad.underpost.repositories.GoodRepository
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

/*
Provides all methods connected with bunkers
contains bunkers' info functions, creating new etc
 */
@Service
class GoodService(@Autowired private val goodRepository: GoodRepository,
                  @Autowired private val bunkerRepository: BunkerRepository,
                  @Autowired private val courierService: CourierService,
                  @Autowired private val mapper: ModelMapper,
                  @Autowired private val log: LoggingService
) {

    fun getGoods(): List<GoodDTOResponse> {
        try {
            val auth = SecurityContextHolder.getContext().authentication
            val user = auth.principal as User
            val data = goodRepository.findAll()
            val result = if (user.role == "admin") data.map { mapper.map(it, GoodDTOResponseWithComplains::class.java) }
            else data.map { mapper.map(it, GoodDTOResponse::class.java) }
            //log.success(LogEventType.DATA_ACCESS, "list goods", null, result)
            return result
        } catch(ex: Exception) {
            log.error(LogEventType.DATA_ACCESS, "list goods", null, ex)
            throw ex
        }
    }

    fun createGood(good: GoodDTORequest): GoodDTOResponse {
        goodRepository.findByName(good.name)?.let { throw NotUniqueFieldException("name") }
        val g = mapper.map(good, Good::class.java)
        g.id = good.name //UUID.randomUUID().toString()
        val producingPlace = bunkerRepository.findById(good.producingPlaceId).orElseThrow { ObjectNotFoundException("bunker", good.producingPlaceId) }
        producingPlace.goods.add(g)
        g.producingPlace = producingPlace
        val saved = goodRepository.save(g)
        bunkerRepository.save(producingPlace)
        return mapper.map(saved, GoodDTOResponse::class.java)
    }

    fun getDifferentGoods(currentBunkerId: String): List<ExtendedGoodDTOResponse> {
        try {
            val currentBunker = bunkerRepository.findById(currentBunkerId).orElseThrow { ObjectNotFoundException("bunker", currentBunkerId) }
            val goods = goodRepository.findAll().toList()
                    .filter { it.producingPlace.id != currentBunkerId }
                    .map { mapper.map(it, ExtendedGoodDTOResponse::class.java) }
            goods.forEach { it.producingPlace.distance = calculateDistance(currentBunker, it.producingPlace) }

            val couriers = courierService.getCouriers()
            goods.forEach { dto ->
                dto.producingPlace.couriersHere = couriers.filter { it.positionX == dto.producingPlace.positionX && it.positionY == dto.producingPlace.positionY }
            }
            log.success(LogEventType.DATA_ACCESS, "list available goods", GoodsLogDto( bunkerId = currentBunkerId), goods)
            return goods
        } catch (ex: Exception){
            log.error(LogEventType.DATA_ACCESS, "list available goods", GoodsLogDto( bunkerId = currentBunkerId), ex)
            throw ex
        }
    }

    private fun calculateDistance(target: Bunker, destination: BunkerDTOResponse) = MapUtils.calculateDistance(target.positionX to target.positionY, destination.positionX to destination.positionY)

}

class GoodsLogDto(
    val bunkerId: String? = null
)