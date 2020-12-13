package omctf2020ad.s4femap.controllers

import io.swagger.annotations.ApiOperation
import omctf2020ad.s4femap.models.MarkDTORequest
import omctf2020ad.s4femap.models.SensorAnomalyRequest
import omctf2020ad.s4femap.models.UpdateMarkDTORequest
import omctf2020ad.s4femap.services.MarkService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/mark")
class MarkController(@Autowired val markService: MarkService) {

    @GetMapping("")
    @ApiOperation("returns the most poular marks for map")
    fun getMapMarks(@RequestParam("type", required = false) type: List<String>?) = markService.getMapMarks(type)

    @PostMapping("")
    @ApiOperation("creates new mark in the system with base fields")
    fun createMark(@RequestBody mark: MarkDTORequest) = markService.create(mark)

    @PatchMapping("/{markId}")
    @ApiOperation("updates mark fields")
    fun updateMark(@PathVariable(name = "markId") markId: String, @RequestBody markUpdate: UpdateMarkDTORequest) = markService.update(markId, markUpdate)

    @PostMapping("/{markId}/like")
    @ApiOperation("toggle like for mark")
    fun updateMark(@PathVariable(name = "markId") markId: String) = markService.toggleLike(markId)

    @GetMapping("/{markId}")
    @ApiOperation("request mark details")
    fun createMark(@PathVariable(name = "markId") markId: String) = markService.get(markId)

    @GetMapping("/liked")
    @ApiOperation("returns all marks that user liked")
    fun getLikedMarks() = markService.getLikedMarks()

    /*
    @PostMapping("/sensor")
    @ApiOperation("returns state in the cell sensor is placed")
    fun getSensorAnomaly(@RequestBody sensor: SensorAnomalyRequest) = markService.getSensorAnomaly(sensor)
    */

    @GetMapping("/cell")
    @ApiOperation("returns all available for user marks in the cell")
    fun getCellMarks(@RequestParam x: Int, @RequestParam y: Int) = markService.getCellMarks(x, y)
}