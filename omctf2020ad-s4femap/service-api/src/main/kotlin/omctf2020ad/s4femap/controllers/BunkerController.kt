package omctf2020ad.s4femap.controllers

import io.swagger.annotations.ApiOperation
import omctf2020ad.s4femap.models.BunkerDTORequest
import omctf2020ad.s4femap.services.BunkerService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/bunkers")
class BunkerController(@Autowired private val bunkerService: BunkerService) {
    @GetMapping("")
    @ApiOperation("returns list of all existing bunkers")
    fun getBunkers() = bunkerService.getBunkers()

    @PostMapping("")
    @ApiOperation("creates new bunker in the system")
    fun createBunker(@RequestBody bunker: BunkerDTORequest) = bunkerService.createBunker(bunker)
}