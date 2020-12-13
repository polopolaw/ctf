package omctf2020ad.underpost.repositories

import omctf2020ad.underpost.models.*
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext


/*
base repository provides methods to work with users in DB
 */
@Repository
interface UserRepository : CrudRepository<User, String> {
    fun findByLogin(login: String): User?
}

/*
base repository provides methods to work with bunkers in DB
 */
@Repository
interface BunkerRepository : CrudRepository<Bunker, String> {
    fun findByPositionX(positionX: Int): List<Bunker>
    fun findByName(name: String): Bunker?
}

/*
base repository provides methods to work with goods in DB
 */
@Repository
interface GoodRepository : CrudRepository<Good, String> {
    fun findByName(name: String): Good?
}

/*
base repository provides methods to work with goods in DB
 */
@Repository
interface OrderRepository : CrudRepository<Order, String>, OrderRepositoryCustom {
    @Query("select o from Order o where o.user.id = ?1")
    fun findMy(id: String): List<Order>

    fun findByIdAndStatus(id: String, status: String): List<Order>

//    @Query(value = "select * from order where status = ?1", nativeQuery = true)
//    fun findAllWithStatus(status: String): List<Order>
}

interface OrderRepositoryCustom {
    fun findMyWithStatus(id: String, status: String): List<Order>
}

class OrderRepositoryImpl : OrderRepositoryCustom {
    @PersistenceContext
    private val entityManager: EntityManager? = null

    override fun findMyWithStatus(id: String, status: String): List<Order> {
        val queryBase = String.format("select * from orders where user_id = '%s' and status IN ", id)
        val statusFilter = when (status) {
            "UNDELIVERED" -> {
                String.format("('%s','%s')", "waiting for delivery", "in delivery")
            }
            "ACTIVE" -> {
                String.format("('%s','%s','%s')", "waiting for delivery", "in delivery", "delivered")
            }
            else -> {
                String.format("('%s')", status)
            }
        }
        return entityManager!!.createNativeQuery(queryBase + statusFilter, Order::class.java)
                .resultList
                .map { x: Any? -> x as Order }
    }
}

/*
base repository provides methods to work with couriers in DB
 */
@Repository
interface CourierRepository : CrudRepository<Courier, String> {
    fun findByNickname(nick: String): Courier?
}

/*
base repository provides methods to work with couriers in DB
 */
@Repository
interface ComplaintRepository : CrudRepository<Complaint, String>