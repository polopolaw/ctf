package omctf2020ad.s4femap.controllers

import io.swagger.annotations.ApiOperation
import omctf2020ad.s4femap.models.CourierDTORequest
import omctf2020ad.s4femap.models.LoginDTORequest
import omctf2020ad.s4femap.services.CourierService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/user")
class CourierController(@Autowired val courierService: CourierService) {

    @PostMapping("")
    @ApiOperation("creates new courier in the system with base fields")
    fun register(@RequestBody @Validated courier: CourierDTORequest) = courierService.register(courier)

    @PostMapping(value = ["/session"])
    @ApiOperation("returns existing user's data based on provided login if password is correct")
    fun login(@RequestBody request: LoginDTORequest) = courierService.login(request)

    @GetMapping("")
    @ApiOperation("returns list of all existing login users ")
    fun getUsers() = courierService.getCouriers()

}