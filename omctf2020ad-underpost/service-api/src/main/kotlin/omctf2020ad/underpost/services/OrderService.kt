package omctf2020ad.underpost.services

import omctf2020ad.underpost.controllers.ObjectNotFoundException
import omctf2020ad.underpost.helpers.PaymentHelper
import omctf2020ad.underpost.models.Order
import omctf2020ad.underpost.models.OrderDTORequest
import omctf2020ad.underpost.models.OrderDTOResponse
import omctf2020ad.underpost.models.ShortCourierDTO
import omctf2020ad.underpost.repositories.BunkerRepository
import omctf2020ad.underpost.repositories.CourierRepository
import omctf2020ad.underpost.repositories.GoodRepository
import omctf2020ad.underpost.repositories.OrderRepository
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.lang.Exception
import java.security.InvalidParameterException
import java.util.*

/*
Provides all methods connected with orders
contains bunkers' info functions, making new etc
 */
@Service
class OrderService(@Autowired private val orderRepository: OrderRepository,
                   @Autowired private val goodRepository: GoodRepository,
                   @Autowired private val bunkerRepository: BunkerRepository,
                   @Autowired private val courierRepository: CourierRepository,
                   @Autowired private val userService: UserService,
                   @Autowired private val mapper: ModelMapper,
                   @Autowired private val log: LoggingService
) {

    fun getOrders(status: String?): List<OrderDTOResponse> {
        try {
            val user = userService.getCurrentUser()
            val orders = if (status == null)
                orderRepository.findMy(user.id)
            else
                orderRepository.findMyWithStatus(user.id, status)
            val result = orders.map { makeOrderDTO(it) }
            if(status != null) { //to reduce log only when is not by autorefresh request
                log.success(LogEventType.DATA_ACCESS, "list my orders", ListOrdersLogDto(status = status), result)
            }
            return result
        } catch(ex: Exception){
            log.error(LogEventType.DATA_ACCESS, "list my orders", ListOrdersLogDto(status = status), ex )
            throw ex
        }

    }

    fun makeOrder(orderDTO: OrderDTORequest): OrderDTOResponse {
        try {
            val g = goodRepository.findById(orderDTO.goodId).orElseThrow { ObjectNotFoundException("good", orderDTO.goodId) }
            val t = bunkerRepository.findById(orderDTO.targetId).orElseThrow { ObjectNotFoundException("bunker", orderDTO.targetId) }
            if (g.producingPlace.id == t.id) throw InvalidParameterException("this good is producing in this bunker")
            val order = Order().apply {
                good = g
                target = t
                user = userService.loadUser() //load full user data
                comment = orderDTO.comment
                status = "waiting for delivery"
                damage = 0
                id = UUID.randomUUID().toString()
            }
            val saved = orderRepository.save(order)
            val result = makeOrderDTO(saved)
            log.success(LogEventType.DATA_ACCESS, "create order", orderDTO, result)
            return result
        } catch (ex: Exception) {
            log.error(LogEventType.DATA_ACCESS, "create order", orderDTO, ex)
            throw ex
        }
    }

    fun finishOrder(orderId: String, likes: Int) {
        try {
            val order = orderRepository.findById(orderId).orElseThrow { ObjectNotFoundException("order", orderId) }
            if (order.status != "delivered") throw InvalidParameterException("You can finish only already delivered orders")
            order.status = "finished"
            order.courier!!.likes += if (likes > 10) 10 else likes
            courierRepository.save(order.courier!!)
            orderRepository.save(order)
            val result = PaymentHelper.requestPayment(order, likes, log)
            log.success(LogEventType.DATA_ACCESS, "confirm delivery", confirmDeliveryLogDto( likes = likes), result )
            return result
        } catch (ex: Exception) {
            log.error(LogEventType.DATA_ACCESS, "confirm delivery", confirmDeliveryLogDto( likes = likes), ex )
            throw ex
        }
    }

    private fun makeOrderDTO(order: Order): OrderDTOResponse {
        val response = mapper.map(order, OrderDTOResponse::class.java)
        response.apply {
            when (status) {
                "waiting for delivery" -> {
                    positionX = good.producingPlace.positionX
                    positionY = good.producingPlace.positionY
                }
                "in delivery" -> {
                    positionX = order.courier!!.positionX
                    positionY = order.courier!!.positionY
                }
                else -> {
                    positionX = target.positionX
                    positionY = target.positionY
                }
            }
            val courierOrder = order.courier
            if(courierOrder != null){
                val shortCourierDTO = mapper.map(courierOrder, ShortCourierDTO::class.java)
                shortCourierDTO.courierId = courierOrder.id
                courier = shortCourierDTO
            }else{
                courier = null
            }

        }
        return response
    }

}

class ListOrdersLogDto (
    val status: String? = null
)

class confirmDeliveryLogDto (
    val likes: Int
)