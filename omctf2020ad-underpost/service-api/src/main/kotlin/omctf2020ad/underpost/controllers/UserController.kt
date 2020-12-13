package omctf2020ad.underpost.controllers

import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import omctf2020ad.underpost.models.PasswordUpdateDTORequest
import omctf2020ad.underpost.models.UserDTORequest
import omctf2020ad.underpost.models.UserUpdateDTORequest
import omctf2020ad.underpost.services.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*


@RestController
@Api("User profile data and user's sessions")
@RequestMapping("/api/users")
class UserController(@Autowired private val userService: UserService) {

    @GetMapping("")
    @ApiOperation("returns list of all existing users with public data")
    fun getUsers() = userService.getUsers()

    @GetMapping("/me")
    @ApiOperation("returns profile of user")
    fun getMe() = userService.getMe()

    @PostMapping("")
    @ApiOperation("creates new user in the system with base fields")
    fun register(@RequestBody user: UserDTORequest) = userService.register(user)

    @PostMapping("/password")
    @ApiOperation("allows already logged in user to change his password")
    fun changePass(@RequestBody password: PasswordUpdateDTORequest) = userService.changePass(password)

    @PatchMapping("")
    @ApiOperation("changes user's additional data")
    fun updateProfile(@RequestBody user: UserUpdateDTORequest) =
            userService.updateProfile(user)

    @GetMapping(value = ["/providers"])
    @ApiOperation(value = "get correct providers for contact numbers")
    fun getProviders() = userService.getProviders()
}