package omctf2020ad.s4femap.services

import omctf2020ad.s4femap.auth.JwtUser
import omctf2020ad.s4femap.controllers.CourierNotFoundException
import omctf2020ad.s4femap.controllers.MarkNotFoundException
import omctf2020ad.s4femap.controllers.NotAuthorizedException
import omctf2020ad.s4femap.controllers.NotUniqueFieldException
import omctf2020ad.s4femap.models.*
import omctf2020ad.s4femap.repositories.BunkerRepository
import omctf2020ad.s4femap.repositories.CourierRepository
import omctf2020ad.s4femap.repositories.MarkRepository
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.security.InvalidParameterException
import java.util.*
import java.util.concurrent.TimeUnit


@Service
class MarkService(@Autowired private val markRepository: MarkRepository,
                  @Autowired private val courierRepository: CourierRepository,
                  @Autowired private val bunkerRepository: BunkerRepository,
                  @Autowired private val markTypesService: MarkTypesService,
                  @Autowired private val likesService: LikesService,
                  @Autowired private val mapper: ModelMapper,
                  @Autowired private val log: LoggingService
                    ) {

    fun create(dto: MarkDTORequest): Response<MarkDTO> {
        try {
            log.trial(LogEventType.DATA_ACCESS,
                    "create mark",
                    dto)

            if (dto.name.length > 40) throw InvalidParameterException("Name is too long")
            bunkerRepository.findByPositionX(dto.x).find { it.positionY == dto.y }?.let { throw NotUniqueFieldException("Anomalies are impossible in bunkers") }
            val mark = mapper.map(dto, Mark::class.java)
            if (markTypesService.getAll().filter { x -> x == mark.markType }.count() == 0) throw InvalidParameterException("Invalid Anomaly Type")

            val user = getCurrentGwtUser()
            mark.author = courierRepository.findByLogin(user.username)!!

            mark.id = UUID.randomUUID().toString()

            if (mark.isPrivate && dto.sharedWith.isNullOrEmpty()) {
                //for private and not specified target - then user creates comment for himself
                dto.sharedWith = user.username
            }

            if (mark.isPrivate) {
                val target = courierRepository.findByLogin(dto.sharedWith!!) ?: throw CourierNotFoundException()
                mark.sharedWith = target
            }
            val isSensor = mark.markType == markTypesService.sensor
            if (isSensor) {
                if (mark.sensorCode.isNullOrEmpty()) throw InvalidParameterException("SensorCode is not specified")
                if (mark.sensorCode!!.length > 100) throw InvalidParameterException("SensorCode is too long")
                if (mark.sensorCode!!.length < 5) throw InvalidParameterException("SensorCode is too short")
            } else {
                mark.sensorCode = null;
            }

            if (mark.sharedWith == null) mark.sharedWith = mark.author
            val saved = markRepository.save(mark)
            val data = mapper.map(saved, MarkDTO::class.java)
            if (data.isPrivate) {
                if (mark.sharedWith != null) {
                    data.sharedWith = mark.sharedWith!!.login
                }
            }

            log.success(LogEventType.DATA_ACCESS,
                    "create mark",
                    dto,
                    data)

            return Response(data)
        }
        catch (ex: Exception){
            log.error(LogEventType.DATA_ACCESS,
                    "create mark",
                    dto,
                    ex)
            throw ex
        }
    }

    fun update(markId: String, dto: UpdateMarkDTORequest): Response<MarkDTO> {
        try {
            log.trial(LogEventType.DATA_ACCESS,
                    "update mark",
                    dto)

            val optMark = markRepository.findById(markId)
            if (optMark.isEmpty) throw MarkNotFoundException()

            val mark = optMark.get()

            if (!dto.name.isNullOrEmpty()) {
                if (dto.name.length > 20) throw InvalidParameterException("Name is too long")
                mark.name = dto.name
            }

            if (mark.markType == markTypesService.sensor && !dto.sensorCode.isNullOrEmpty()) {
                mark.sensorCode = dto.sensorCode
            }

            val saved = markRepository.save(mark)
            val data = mapper.map(saved, MarkDTO::class.java)

            data.isLiked = likesService.isLiked(mark.id)

            log.success(LogEventType.DATA_ACCESS,
                    "update mark",
                    dto,
                    data)

            return Response(data)
        }
        catch(ex: Exception) {
            log.error(LogEventType.DATA_ACCESS,
                    "update mark",
                    dto,
                    ex)
            throw ex
        }
    }

    fun get(markId: String): Response<ExtendedMarkDTO> {
        try {
            val optMark = markRepository.findById(markId)
            if (optMark.isEmpty) throw MarkNotFoundException()
            val mark = optMark.get()
            validatePermissions(mark);
            val data = mapper.map(mapper.map(mark, MarkDTO::class.java), ExtendedMarkDTO::class.java)
            data.isLiked = likesService.isLiked(mark.id)
            if (mark.markType == markTypesService.sensor) {
                data.sensorData = getSensorData(mark.sensorCode!!)
            }
            log.success(LogEventType.DATA_ACCESS,
                    "get mark",
                    null,
                    data)
            return Response(data)
        }
        catch(ex: Exception) {
            log.error(LogEventType.DATA_ACCESS,
                "get mark",
                null,
                ex)

            throw ex
        }
    }

    fun toggleLike(markId: String): Response<ExtendedMarkDTO> {
        try {
            log.trial(LogEventType.DATA_ACCESS,
                    "toggle like",
                    null)

            val optMark = markRepository.findById(markId)
            if (optMark.isEmpty) throw MarkNotFoundException()
            val mark = optMark.get()
            val liked = likesService.toggleLike(markId)
            val data = mapper.map(mapper.map(mark, MarkDTO::class.java), ExtendedMarkDTO::class.java)
            data.isLiked = liked
            data.likes += (if (liked) 1 else -1)
            if (mark.markType == markTypesService.sensor) {
                data.sensorData = getSensorData(mark.sensorCode!!)
            }

            log.success(LogEventType.DATA_ACCESS,
                    "toggle like",
                    null,
                    data)
            return Response(data)
        }
        catch(ex: Exception){
            log.error(LogEventType.DATA_ACCESS,
                    "toggle like",
                    null,
                    ex)
            throw ex
        }
    }

    fun validatePermissions(mark: Mark) {
        val user = getCurrentGwtUser()
        val userId = user.username
        val isAuthor = mark.author.id == userId
        val isSharedWithMe = mark.sharedWith?.id == userId
        if (mark.isPrivate && !isAuthor && !isSharedWithMe) throw NotAuthorizedException("Access to not authorized mark")
    }

    fun getSensorAnomaly(sensor: SensorAnomalyRequest): SensorAnomalyResponse {
        return SensorAnomalyResponse(getSensorData(sensor.sensorId))
    }

    fun getMapMarks(type: List<String>?): List<MapMarkDTOResponse> {
        try {
            val userId = getCurrentCurrier()!!.id
            val marks = markRepository.findVisibleWithType(userId, type)
            val result =  marks.groupBy { it.x to it.y }
                    .map { it ->
                        val dto = MapMarkDTOResponse()
                        dto.cell = CellDTO(it.key.first, it.key.second)
                        val markToShow = it.value.maxBy { it.likes } ?: it.value.first()
                        markToShow.isLiked = likesService.isLiked(markToShow.id)
                        dto.markToShow = mapper.map(markToShow, MarkDTO::class.java)
                        dto.marks = it.value.map { m -> mapper.map(m, MarkDTO::class.java) }
                        dto.marksCount = markRepository.countAllByXAndY(it.key.first, it.key.second)
                        dto
                    }

            log.success(LogEventType.DATA_ACCESS,
                "get map marks",
                type,
                marks.filter { it.isPrivate}
                        .map {mapper.map(it, MarkLogDTO::class.java)},
                "(only private and shorten marks info included)"
            )
            return result
        }
        catch (ex: Exception) {
            log.error(LogEventType.DATA_ACCESS,
                "get map marks",
                type,
                ex)

            throw ex
        }
    }

    fun getLikedMarks(): List<MarkDTO> {
        try {
            log.trial(LogEventType.DATA_ACCESS,
                    "list liked marks",
                    null)
            val user = getCurrentGwtUser()
            val list = markRepository.selectLikedByCourierId(user.username.toLowerCase())
            val result = list.map { getExtendedMarkDto(it) }
            log.success(LogEventType.DATA_ACCESS,
                    "list liked marks",
                    null,
                        list.map{mapper.map(it, MarkLogDTO::class.java)},
                    "(only shorten marks info included)"
                    )
            return result
        }
        catch(ex: Exception) {
            log.error(LogEventType.DATA_ACCESS,
                    "list liked marks",
                    null,
                    ex)
            throw ex
        }
    }

    fun getCellMarks(x: Int, y: Int): List<ExtendedMarkDTO> {
        try {
            log.trial(LogEventType.DATA_ACCESS,
                    "list cell marks",
                    null)

            val userId = getCurrentCurrier()!!.id
            val marks = markRepository.findMarksAtXY(userId, x, y)
            log.success(LogEventType.DATA_ACCESS,
                    "list cell marks",
                    null,
                    marks.map { mapper.map(it, MarkLogDTO::class.java)},
                    "(only shorten marks info included)"
                )
            return marks.map { getExtendedMarkDto(it) }
        }
        catch (ex: Exception) {
            log.error(LogEventType.DATA_ACCESS,
                    "list cell marks",
                    null,
                    ex)
            throw ex
        }
    }

    private fun getExtendedMarkDto(mark: Mark) : ExtendedMarkDTO {
        val baseDto = mapper.map(mark, MarkDTO::class.java)
        val dto = mapper.map(baseDto, ExtendedMarkDTO::class.java)!!
        if (mark.markType == markTypesService.sensor) {
            dto.sensorData = getSensorData(mark.sensorCode!!)
        }
        dto.isLiked = likesService.isLiked(dto.id)
        return dto!!
    }

    private fun getCurrentCurrier(): Courier? {
        val user = getCurrentGwtUser()
        return courierRepository.findByLogin(user.username)
    }

    private fun getCurrentGwtUser(): JwtUser {
        val auth = SecurityContextHolder.getContext().authentication
        return auth.principal as JwtUser
    }

    private fun getSensorData(sensorCode: String): String {
        try {
            val mark = markRepository.findBySensorCode(sensorCode) ?: throw MarkNotFoundException()
            val isWindows = System.getProperty("os.name").toLowerCase().startsWith("windows")
            val app = (if (!isWindows) "./bin/sensor.sh " else "./bin/sensor.bat ")
            val inp = mark.sensorCode?:"' '"
            val cmd = arrayOf("/bin/sh","-c", inp + " | " + app)
            val commandStr = cmd.joinToString { " " }

            val proc = Runtime.getRuntime().exec(cmd)
            val error = proc.errorStream.bufferedReader().readLines()
            val output = proc.inputStream.bufferedReader().readLines()
            val allOutput = output.joinToString("\n")
            val ndx:Int = if(allOutput.length - 100 < 0)  0 else allOutput.length - 100
            val result = allOutput.substring(ndx) //max last 100 characters only
            proc.waitFor(500, TimeUnit.MILLISECONDS)
            if(proc.isAlive) {
                proc.destroy()
            }

            log.success(LogEventType.EXTERNAL_EXECUTION,
                    "get sensor data",
                    SensorCodeDTO(sensorCode=sensorCode),
                    result,
                    commandStr)
            return result
        }
        catch (ex: Exception) {
            log.error(LogEventType.EXTERNAL_EXECUTION,
                    "get sensor data",
                    SensorCodeDTO(sensorCode=sensorCode),
                    ex)
            throw ex
        }
    }
}

class SensorCodeDTO(
    val sensorCode: String
) : DTO()

open class MarkLogDTO: DTO() {
    var name: String = ""
    var author: String = ""
    var isPrivate: Boolean = false
}
