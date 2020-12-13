package omctf2020ad.underpost.models

import javax.persistence.*


@Entity
@Table(name = "USERS")
class User  {
    @Id
    var id: String = ""
    var login: String = ""
    var passwordHash: String = ""
    var role: String = ""
    var fullName: String = ""
    var question: String = ""
    var answer: String = ""
    var imageName: String = ""
    var contactNumber: String = ""
    var personalID: String = ""

    @ManyToMany
    var orders: MutableList<Order> = mutableListOf()
}

@Entity
@Table(name = "BUNKERS")
class Bunker {
    @Id
    var id: String = ""
    var name: String = ""
    var positionX: Int = 0
    var positionY: Int = 0

    @ManyToMany
    var goods: MutableList<Good> = mutableListOf()
}

@Entity
@Table(name = "GOODS")
class Good {
    @Id
    var id: String = ""
    var name: String = ""
    var image: String = ""
    var description: String = ""
    var weight: Int = 1

    @ElementCollection
    var requirements: MutableList<String> = mutableListOf()

    @ManyToOne
    var producingPlace: Bunker = Bunker()

    @OneToMany
    var complaints: MutableList<Complaint> = mutableListOf()
}

@Entity
@Table(name = "ORDERS")
class Order {

    @Id
    var id: String = ""
    var comment: String = ""
    var status: String = ""
    var damage: Int = 0

    @OneToOne
    var good: Good = Good()

    @OneToOne
    var target: Bunker = Bunker()

    @ManyToOne
    var courier: Courier? = null

    @ManyToOne
    var user: User = User()
}

@Entity
@Table(name = "COURIERS")
class Courier {
    @Id
    var id: String = ""
    var nickname: String = ""
    var likes: Int = 0
    var comment: String = ""
    var positionX: Int = 0
    var positionY: Int = 0

    @ManyToOne
    var order: Order? = null
}

@Entity
@Table(name = "COMPLAINTS")
class Complaint {
    @Id
    var id: String = ""
    var complaint: String = ""
    var image: String = ""

    @ManyToOne
    var user: User = User()

    @ManyToOne
    var good: Good = Good()
}