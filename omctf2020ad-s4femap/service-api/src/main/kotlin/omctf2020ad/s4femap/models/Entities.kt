package omctf2020ad.s4femap.models

import org.hibernate.annotations.Formula
import javax.persistence.*
import kotlin.jvm.Transient


@Entity
@Table(name = "couriers")
class Courier  {
    @Id
    var id: String = ""

    var login: String = ""

    var passwordHash: String = ""

}

@Entity
@Table(name = "comments")
class Comment  {
    @Id
    var id: String = ""

    //encoded for private
    @Column(name = "description")
    var description: String = ""

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mark_id")
    var mark = Mark()

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id")
    var author = Courier()

    @Column(name = "is_private")
    var isPrivate: Boolean = false

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "private_id", nullable = true)
    var sharedWith : Courier? = null
}

@Entity
@Table(name = "likes")
class Like  {
    @Id
    var id: String = ""

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id")
    var author = Courier()

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mark_id")
    var mark = Mark()
}


@Entity
@Table(name = "marks")
class Mark  {
    @Id
    var id: String = ""

    var x: Int = 0

    var y: Int = 0

    var name: String = ""

    var isPrivate: Boolean = false

    var markType: String = ""

    var sensorCode: String? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    var author: Courier = Courier()

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "private_id", nullable = true)
    var sharedWith: Courier? = null

    @Formula(value = "(SELECT count(*) FROM likes WHERE likes.mark_id=id)")
    var likes: Int = 0

    @Formula(value = "(SELECT count(*) FROM comments WHERE comments.mark_id=id)")
    var comments: Int = 0

    @Transient
    var isLiked: Boolean = false
}

@Entity
@Table(name = "bunkers")
class Bunker {
    @Id
    var id: String = ""
    var name: String = ""
    var positionX: Int = 0
    var positionY: Int = 0
}




