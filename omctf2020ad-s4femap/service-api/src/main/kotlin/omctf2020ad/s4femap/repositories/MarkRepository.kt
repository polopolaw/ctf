package omctf2020ad.s4femap.repositories

import omctf2020ad.s4femap.models.Courier
import omctf2020ad.s4femap.models.Mark
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

@Repository
interface MarkRepository : CrudRepository<Mark, String>, MarkRepositoryCustom {

    fun findBySensorCode(code: String): Mark?

    fun countAllByXAndY(x: Int, y: Int): Int
}

interface MarkRepositoryCustom {
    fun findVisibleWithType(courierId: String, type: List<String>?): List<Mark>

    fun selectLikedByCourierId(courierId: String): List<Mark>

    fun findMarksAtXY(courierId: String, x: Int, y: Int) : List<Mark>
}

class MarkRepositoryImpl : MarkRepositoryCustom {
    @PersistenceContext
    private val entityManager: EntityManager? = null

    @Autowired
    private var courierRepository: CourierRepository? = null

    override fun findVisibleWithType(courierId: String, type: List<String>?): List<Mark> {
        val types = type?.joinToString { "'$it'" }
        var query = "select id," +
                "        x," +
                "        y," +
                "        [name]," +
                "        is_private," +
                "        mark_type," +
                "        sensor_code," +
                "        author_id," +
                "        private_id," +
                "        (SELECT count(*) FROM likes WHERE likes.mark_id=marks.id) as likes, " +
                "        (SELECT count(*) FROM comments WHERE comments.mark_id=marks.id) as comments " +
                "    from" +
                "        marks" +
                "    where" +
                "        (is_private=0 " +
                "        or author_id='$courierId' " +
                "        or private_id='$courierId')"

        types?.let { query += " and mark_type IN ($types)" }
        val lst = entityManager!!.createNativeQuery(query).resultList
        return mapList2ListOfMark(lst as List<Any>)
    }

    override fun selectLikedByCourierId(courierId: String): List<Mark> {
        val query = "select marks.id, " +
                "        x," +
                "        y," +
                "        [name]," +
                "        is_private," +
                "        mark_type," +
                "        sensor_code," +
                "        marks.author_id," +
                "        private_id," +
                "        (SELECT count(*) FROM likes WHERE likes.mark_id=marks.id) as likes, " +
                "        (SELECT count(*) FROM comments WHERE comments.mark_id=marks.id) as comments " +
                "from marks inner join likes on marks.id=likes.mark_id where lower(likes.author_id) = '$courierId'"


        val lst = entityManager!!.createNativeQuery(query).resultList
        return mapList2ListOfMark(lst as List<Any>)
    }

    override fun findMarksAtXY(courierId: String, x: Int, y: Int) : List<Mark> {
        var query = "select id," +
                "        x," +
                "        y," +
                "        [name]," +
                "        is_private," +
                "        mark_type," +
                "        sensor_code," +
                "        author_id," +
                "        private_id," +
                "        (SELECT count(*) FROM likes WHERE likes.mark_id=marks.id) as likes, " +
                "        (SELECT count(*) FROM comments WHERE comments.mark_id=marks.id) as comments " +
                "    from" +
                "        marks" +
                "    where" +
                "        (x=$x and y=$y) " +
                "        and (is_private=0 " +
                "          or author_id='$courierId' " +
                "          or private_id='$courierId')"

        val lst = entityManager!!.createNativeQuery(query).resultList
        return mapList2ListOfMark(lst as List<Any>)
    }

    private fun mapList2ListOfMark(lst:List<Any>): List<Mark>{
        return lst.map {
            val mark = Mark()
            val item = it as Array<Any>
            mark.id = item[0] as String
            mark.x = item[1] as Int
            mark.y = item[2] as Int
            mark.name = item[3] as String
            mark.isPrivate = (1 == (item[4] as Int))
            mark.markType = item[5] as String
            mark.sensorCode = item[6] as String?
            mark.author = courierRepository?.findById(item[7] as String)?.get() ?: Courier()
            val privateId = item[8] as String?
            if(privateId != null) {
                mark.sharedWith = courierRepository?.findById(privateId)?.get()
            }
            mark.likes = item[9] as Int
            mark.comments = item[10] as Int
            mark
        }
    }
}