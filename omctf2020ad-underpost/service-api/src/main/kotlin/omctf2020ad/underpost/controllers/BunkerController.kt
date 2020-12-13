package omctf2020ad.underpost.controllers

import io.swagger.annotations.ApiOperation
import omctf2020ad.underpost.models.BunkerDTORequest
import omctf2020ad.underpost.services.BunkerService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/bunkers")
class BunkerController(@Autowired private val bunkerService: BunkerService) {
    @GetMapping("")
    @ApiOperation("returns list of all existing bunkers with public data")
    fun getBunkers() = bunkerService.getBunkers()

    @PostMapping("")
    @ApiOperation("creates new bunkers in the system")
    fun createBunker(@RequestBody bunker: BunkerDTORequest) = bunkerService.createBunker(bunker)
}