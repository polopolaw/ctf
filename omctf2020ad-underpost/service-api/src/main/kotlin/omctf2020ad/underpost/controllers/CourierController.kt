package omctf2020ad.underpost.controllers

import io.swagger.annotations.ApiOperation
import omctf2020ad.underpost.models.CourierDTORequest
import omctf2020ad.underpost.services.CourierService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/couriers")
class CourierController(@Autowired private val courierService: CourierService) {
    @GetMapping("")
    @ApiOperation("returns list of all existing couriers with public data")
    fun getCouriers() = courierService.getCouriers()

    @PostMapping("")
    @ApiOperation("creates new courier in the system with base fields")
    fun createCourier(@RequestBody courier: CourierDTORequest) = courierService.createCourier(courier)
}