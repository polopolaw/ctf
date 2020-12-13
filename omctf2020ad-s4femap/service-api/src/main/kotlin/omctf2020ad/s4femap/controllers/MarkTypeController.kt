package omctf2020ad.s4femap.controllers

import io.swagger.annotations.ApiOperation
import omctf2020ad.s4femap.services.MarkTypesService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/mark-type")
class MarkTypeController(@Autowired val markTypesService: MarkTypesService) {

    @GetMapping("")
    @ApiOperation("Get all mark types")
    fun getAllMarkTypes() = markTypesService.getAll()

}