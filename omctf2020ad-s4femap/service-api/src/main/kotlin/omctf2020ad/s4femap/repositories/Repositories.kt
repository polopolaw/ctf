package omctf2020ad.s4femap.repositories;

import omctf2020ad.s4femap.models.Bunker
import omctf2020ad.s4femap.models.Courier
import omctf2020ad.s4femap.models.Like
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface CourierRepository : CrudRepository<Courier, String> {
    fun findByLogin(login: String): Courier?
}

@Repository
interface LikeRepository : CrudRepository<Like, String> {

    fun getLikeByMarkIdAndAuthorId(markId: String, authorId: String): Like?
}

/*
base repository provides methods to work with bunkers in DB
 */
@Repository
interface BunkerRepository : CrudRepository<Bunker, String> {
    fun findByPositionX(positionX: Int): List<Bunker>
    fun findByName(name: String): Bunker?
}

