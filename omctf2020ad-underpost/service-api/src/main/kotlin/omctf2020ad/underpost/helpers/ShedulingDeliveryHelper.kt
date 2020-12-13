package omctf2020ad.underpost.helpers

import omctf2020ad.underpost.models.Bunker
import omctf2020ad.underpost.models.Courier
import omctf2020ad.underpost.models.Order
import omctf2020ad.underpost.repositories.CourierRepository
import omctf2020ad.underpost.repositories.OrderRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import kotlin.math.max
import kotlin.random.Random

/*
this class contains all simulation of courier's work:
moving from point to point, getting and delivering orders,
some chance to damage order while delivery
 */

@Component
class ScheduledDeliveryHelper(@Autowired val courierRepository: CourierRepository,
                              @Autowired val orderRepository: OrderRepository) {

    @Scheduled(fixedRateString ="\${app.stepDelay}")
    fun updateCouriers() {
        val couriers = courierRepository.findAll()
        couriers.forEach {
            if (it.order != null) it.simulateDelivery()
            else it.getOrderFromNearestBunker()
        }
    }

    private fun Courier.getOrderFromNearestBunker() {
        val nearest = orderRepository.findAll()
                .filter { it.status == "waiting for delivery" }
                .minBy { MapUtils.calculateDistance(positionX to positionX, it.good.producingPlace.positionX to it.good.producingPlace.positionY) }
                ?: return
        moveToBunker(nearest.good.producingPlace)
        getOrder(nearest)
    }

    private fun Courier.moveToBunker(bunker: Bunker) {
        positionX = bunker.positionX
        positionY = bunker.positionY
        courierRepository.save(this)
    }

    private fun Courier.getOrder(order: Order) {
        this.order = order
        order.status = "in delivery"
        order.courier = this
        orderRepository.save(order)
        courierRepository.save(this)
    }

    private fun Courier.simulateDelivery() {
        moveToNextCell()
        damageOrder()
        if (order!!.target.positionX == positionX && order!!.target.positionY == positionY)
            deliverOrder()
    }

    private fun Courier.damageOrder() {
        if (Random.nextInt(100) < 6) {//chance to damage is 5%
            val damage = Random.nextInt(40) //max damage step is 40%
            val totalDamage = order!!.damage + damage;
            if (totalDamage >= 100) {
                order!!.damage = 100
            }
            else {
                order!!.damage = totalDamage
            }
            orderRepository.save(order!!)
        }
    }

    private fun Courier.deliverOrder() {
        order!!.status = "delivered"
        orderRepository.save(order!!)
        order = null
        courierRepository.save(this)
    }

    private fun Courier.moveToNextCell() {
        val toX = order!!.target.positionX
        val toY = order!!.target.positionY
        val nextX = when {
            (toX > positionX) -> positionX + 1
            (toX < positionX) -> positionX - 1
            else -> toX
        }
        if (toX == positionX || max(nextX, positionX) % 2 == 0) {
            if (toY > positionY)
                positionY += 1
            if (toY < positionY)
                positionY -= 1
        }
        positionX = nextX
        courierRepository.save(this)
    }
}