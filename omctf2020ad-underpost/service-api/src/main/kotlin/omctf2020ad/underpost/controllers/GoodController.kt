package omctf2020ad.underpost.controllers

import io.swagger.annotations.ApiOperation
import omctf2020ad.underpost.models.GoodDTORequest
import omctf2020ad.underpost.services.GoodService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/goods")
class GoodController(@Autowired private val goodService: GoodService) {
    @GetMapping("")
    @ApiOperation("returns list of all existing goods with public data")
    fun getGoods() = goodService.getGoods()

    @PostMapping("")
    @ApiOperation("creates new good in the system with base fields")
    fun createGood(@RequestBody good: GoodDTORequest) = goodService.createGood(good)

    @GetMapping("/different-bunkers")
    @ApiOperation("returns list of all existing in another bunkers goods with public data")
    fun getDifferentGoods(@RequestParam("current-bunker-id") currentBunkerId: String) = goodService.getDifferentGoods(currentBunkerId)
}