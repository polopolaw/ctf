package omctf2020ad.underpost.services

import omctf2020ad.underpost.controllers.ObjectNotFoundException
import omctf2020ad.underpost.helpers.ImageHelper
import omctf2020ad.underpost.models.*
import omctf2020ad.underpost.repositories.ComplaintRepository
import omctf2020ad.underpost.repositories.CourierRepository
import omctf2020ad.underpost.repositories.GoodRepository
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.util.*

/*
Provides all methods connected with bunkers
contains bunkers' info functions, creating new etc
 */
@Service
class AppealService(@Autowired private val complaintRepository: ComplaintRepository,
                    @Autowired private val courierRepository: CourierRepository,
                    @Autowired private val goodRepository: GoodRepository,
                    @Autowired private val userService: UserService,
                    @Autowired private val mapper: ModelMapper,
                    @Autowired private val log: LoggingService
) {

    fun getGoodsComplaints(): List<ComplaintDTOResponse> {
        try {
            val user = userService.getCurrentUser()
            val result = complaintRepository.findAll()
                    .filter { it.user.id == user.id }
                    .map { mapper.map(it, ComplaintDTOResponse::class.java) }
            log.success(LogEventType.DATA_ACCESS, "list goods complaints", null, result)
            return result
        }
        catch(ex: Exception) {
            log.error(LogEventType.DATA_ACCESS, "list goods complaints", null, ex)
            throw ex
        }
    }

    fun createGoodComplaint(goodId: String, file: MultipartFile?, complaintStr: String): ComplaintDTOResponse {
        val prms: GoodComplaintLogDTO = GoodComplaintLogDTO( filename = file?.originalFilename, comment = complaintStr, mimetype = file?.contentType)
        try {
            log.trial(LogEventType.DATA_ACCESS, "create good complaint", prms)
            val complaint = Complaint()
            complaint.id = UUID.randomUUID().toString()
            complaint.complaint = complaintStr
            complaint.good = goodRepository.findById(goodId).orElseThrow { ObjectNotFoundException("good", goodId) }
            val user = userService.loadUser() //load full user data
            complaint.user = user
            if (file != null) {
                val filename = ImageHelper.saveImage(file, user.login, log)
                complaint.image = filename
            }
            val saved = complaintRepository.save(complaint)
            complaint.good.complaints.add(complaint)
            goodRepository.save(complaint.good)
            val result = mapper.map(saved, ComplaintDTOResponse::class.java)
            return result
        }
        catch(ex: Exception){
            log.error(LogEventType.DATA_ACCESS, "create good complaint", prms, ex)
            throw ex
        }
    }

    fun getCourierComplaints(): List<ComplaintDTOResponse> {
        try {
            val user = userService.getCurrentUser()
            val files = File("complaints")
            val data = mutableListOf<ComplaintDTOResponse>()
            files.walkTopDown().filter { it.name == "${user.login}.txt" }.forEach {
                val item = ComplaintDTOResponse()
                item.complaint = it.readText()
                val courier = courierRepository.findByNickname(it.parentFile.name)
                if (courier != null) {
                    val shortCourierDTO = mapper.map(courier, ShortCourierDTO::class.java)
                    shortCourierDTO.courierId = courier.id
                    item.courier = shortCourierDTO
                }
                data.add(item)
            }
            log.success(LogEventType.DATA_ACCESS, "get courier complaints", null, data)
            return data
        } catch(ex:Exception){
            log.error(LogEventType.DATA_ACCESS, "get courier complaints", null, ex)
            throw ex
        }
    }

    fun createCourierComplaint(courierId: String, complaint: ComplaintDTORequest): ComplaintDTOResponse {
        try {
            val courier = courierRepository.findById(courierId).orElseThrow { ObjectNotFoundException("courier", courierId) }
            val user = userService.loadUser() //load full user data
            val directory = "complaints/${courier.nickname}/"
            File(directory).mkdirs()
            val filePath = "$directory${user.login}.txt"
            val file = File(filePath)
            file.delete()
            file.writeText(complaint.complaint)
            log.success(LogEventType.FLAG_FIELD, "create courier complaint", complaint, complaint.complaint?:"", "saved to: '$filePath'" )
            val response = ComplaintDTOResponse()
            response.complaint = file.readText()
            val shortCourierDTO = mapper.map(courier, ShortCourierDTO::class.java)
            shortCourierDTO.courierId = courier.id
            response.courier = shortCourierDTO
            response.user = mapper.map(user, UserDTOResponse::class.java)
            log.success(LogEventType.DATA_ACCESS, "create courier complaint", complaint, response)
            return response
        } catch(ex: Exception) {
            log.error(LogEventType.DATA_ACCESS, "create courier complaint", complaint, ex)
            throw ex
        }
    }

}

class GoodComplaintLogDTO(
    val filename: String? = null,
    val mimetype: String? = null,
    val comment: String? = null
)
