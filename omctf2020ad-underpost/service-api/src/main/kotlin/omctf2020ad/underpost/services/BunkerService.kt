package omctf2020ad.underpost.services

import omctf2020ad.underpost.controllers.NotUniqueFieldException
import omctf2020ad.underpost.models.Bunker
import omctf2020ad.underpost.models.BunkerDTORequest
import omctf2020ad.underpost.models.GoodsExtendedBunkerDTOResponse
import omctf2020ad.underpost.repositories.BunkerRepository
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.lang.Exception
import java.security.InvalidParameterException
import java.util.*

/*
Provides all methods connected with bunkers
contains bunkers' info functions, creating new etc
 */
@Service
class BunkerService(@Autowired private val bunkerRepository: BunkerRepository,
                    @Autowired private val mapper: ModelMapper,
                    @Autowired private val log: LoggingService
) {

    fun getBunkers(): List<GoodsExtendedBunkerDTOResponse> {
        try {
            val result = bunkerRepository.findAll().toList().map { mapper.map(it, GoodsExtendedBunkerDTOResponse::class.java) }
            //log.success(LogEventType.DATA_ACCESS, "list bunkers", null, result)
            return result
        } catch (ex: Exception) {
            log.error(LogEventType.DATA_ACCESS, "list bunkers", null, ex)
            throw ex;
        }
    }

    fun createBunker(bunker: BunkerDTORequest): GoodsExtendedBunkerDTOResponse {
        bunkerRepository.findByPositionX(bunker.positionX)
                .find { it.positionY == bunker.positionY }?.let { throw NotUniqueFieldException("coordinates") }
        bunkerRepository.findByName(bunker.name)?.let { throw NotUniqueFieldException("name") }
        if (bunker.positionX < 0 || bunker.positionX > 99 || bunker.positionY < 0 || bunker.positionY > 99)
            throw InvalidParameterException("Coordinates should be between 0 and 99")
        val b = mapper.map(bunker, Bunker::class.java)
        b.id = bunker.name; //UUID.randomUUID().toString()
        val saved = bunkerRepository.save(b)
        return mapper.map(saved, GoodsExtendedBunkerDTOResponse::class.java)
    }

}