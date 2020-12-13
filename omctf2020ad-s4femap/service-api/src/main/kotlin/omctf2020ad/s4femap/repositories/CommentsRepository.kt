package omctf2020ad.s4femap.repositories

import omctf2020ad.s4femap.models.Comment
import omctf2020ad.s4femap.models.Courier
import omctf2020ad.s4femap.models.Mark
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

@Repository
interface CommentsRepository : CrudRepository<Comment, String>, CommentsRepositoryCustom

interface CommentsRepositoryCustom {
    fun selectAvailableByMarkIdAndCourierId(markId: String, courierId: String): List<Comment>
}

class CommentsRepositoryImpl : CommentsRepositoryCustom {
    @PersistenceContext
    private val entityManager: EntityManager? = null

    @Autowired
    private var courierRepository: CourierRepository? = null
    @Autowired
    private var markRepository: MarkRepository? = null

    override fun selectAvailableByMarkIdAndCourierId(markId: String, courierId: String): List<Comment> {
        val query = "select " +
                "id," +
                "description," +
                "mark_id," +
                "author_id," +
                "is_private," +
                "private_id " +
                "from comments where mark_id='$markId' AND (is_private=0 OR trim(author_id) = '${courierId.trim()}' OR trim(private_id) = '${courierId.trim()}')"

        val lst = entityManager!!.createNativeQuery(query).resultList
        return lst.map {
            val comment = Comment()
            val item = it as Array<Object>
            comment.id = item[0] as String
            comment.description = item[1] as String
            comment.mark = markRepository?.findById(item[2] as String)?.get() ?: Mark()
            comment.author = courierRepository?.findById(item[3] as String)?.get() ?: Courier()
            comment.isPrivate = (1 == (item[4] as Int))
            val privateId = item[5] as String?
            if(privateId != null) {
                comment.sharedWith = courierRepository?.findById(privateId)?.get()
            }
            System.out.println(comment.mark.id)
            comment
        }
    }

}