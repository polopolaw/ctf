package omctf2020ad.underpost.controllers

import io.swagger.annotations.ApiOperation
import omctf2020ad.underpost.models.LoginDTORequest
import omctf2020ad.underpost.models.RecoveryDTORequest
import omctf2020ad.underpost.services.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api")
class AuthController(@Autowired private val userService: UserService) {

    @PostMapping(value = ["/session"])
    @ApiOperation("returns existing user's data based on provided login if password is correct")
    fun login(@RequestBody request: LoginDTORequest) = userService.login(request)

    @GetMapping(value = ["/restore"])
    @ApiOperation("returns question which should be answered to restore password")
    fun getRestoringQuestion(@RequestParam("login") login: String) = userService.getRestoringQuestion(login)

    @PostMapping(value = ["/restore"])
    @ApiOperation("logs in user with provided login if answer is correct")
    fun loginByAnswer(@RequestBody request: RecoveryDTORequest) = userService.restorePass(request)


}