package omctf2020ad.underpost.controllers

import io.swagger.annotations.ApiOperation
import omctf2020ad.underpost.models.FinishOrderDTORequest
import omctf2020ad.underpost.models.OrderDTORequest
import omctf2020ad.underpost.services.OrderService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/orders")
class OrderController(@Autowired private val orderService: OrderService) {
    @GetMapping("")
    @ApiOperation("returns list of all user's orders with public data")
    fun getOrders(@RequestParam("status", required = false) status: String?) = orderService.getOrders(status)

    @PostMapping("")
    @ApiOperation("creates new order in the system with base fields")
    fun makeOrder(@RequestBody order: OrderDTORequest) = orderService.makeOrder(order)

    @PostMapping("/{orderId}/finish")
    @ApiOperation("finishes user's order in delivered status")
    fun finishOrder(@PathVariable("orderId") orderId: String, @RequestBody dto: FinishOrderDTORequest) = orderService.finishOrder(orderId, dto.likes)
}