package omctf2020ad.underpost.controllers

import io.swagger.annotations.ApiOperation
import omctf2020ad.underpost.models.ComplaintDTORequest
import omctf2020ad.underpost.models.ComplaintDTOResponse
import omctf2020ad.underpost.services.AppealService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/appeals")
class AppealController(@Autowired private val appealService: AppealService) {
    @GetMapping("/goods")
    @ApiOperation("returns list of user's complaints about goods")
    fun getGoodsComplaints() = appealService.getGoodsComplaints()


    @PostMapping("/goods/{goodId}")
    @ApiOperation("creates new complain about good")
    fun createGoodComplaint(@PathVariable("goodId") goodId: String,
                            @RequestPart("file", required = false) file: MultipartFile?,
                            @RequestPart("complaint", required=true) complaint: String): ComplaintDTOResponse {
        return appealService.createGoodComplaint(goodId, file, complaint)
    }

    @GetMapping("/couriers")
    @ApiOperation("returns list of user's complaints about couriers")
    fun getCourierComplaints() = appealService.getCourierComplaints()

    @PostMapping("/couriers/{courierId}")
    @ApiOperation("creates new complain about couriers")
    fun createCourierComplaint(@PathVariable("courierId") courierId: String,
                               @RequestBody complaint: ComplaintDTORequest) = appealService.createCourierComplaint(courierId, complaint)
}