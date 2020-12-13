package omctf2020ad.underpost.models

class UserDTORequest(
        val login: String,
        var password: String,
        val question: String,
        val answer: String,
        val contactNumber: String,
        val personalID: String
)

class PasswordUpdateDTORequest(
        val password: String
)

class UserUpdateDTORequest(
        val contactNumber: String?
)

class ExtendedUserDTOResponse : UserDTOResponse() {
    val question: String = ""
    val contactNumber: String = ""
    var role: String = ""
    val personalID: String = ""
}

class LoginDTORequest(
        val login: String,
        val password: String
)

class RecoveryDTORequest(
        val login: String,
        val answer: String
)

open class UserDTOResponse {
    open var id: String = ""
    open val login: String = ""
}

class ResponseWithToken<T>(
        val token: String,
        val data: T
)

class GoodsExtendedBunkerDTOResponse : BunkerDTOResponse() {
    val goods: MutableList<GoodDTOResponse> = mutableListOf()
}

class OrdersExtendedBunkerDTOResponse : BunkerDTOResponse() {
    var distance: Int = 0
    var couriersHere: List<CourierDTOResponse> = listOf()
}

open class BunkerDTOResponse {
    open var id: String = ""
    open var name: String = ""
    open var positionX: Int = 0
    open var positionY: Int = 0
}

class BunkerDTORequest {
    var name: String = ""
    var positionX: Int = 0
    var positionY: Int = 0
}

open class GoodDTOResponse {
    var id: String = ""
    var name: String = ""
    var image: String = ""
    var description: String = ""
    var producingPlace: BunkerDTOResponse = BunkerDTOResponse()
    var weight: Int = 1
    var requirements: MutableList<String> = mutableListOf()
}

class ExtendedGoodDTOResponse {
    var id: String = ""
    var name: String = ""
    var image: String = ""
    var description: String = ""
    var producingPlace: OrdersExtendedBunkerDTOResponse = OrdersExtendedBunkerDTOResponse()
    var weight: Int = 1
    var requirements: MutableList<String> = mutableListOf()
}

class GoodDTOResponseWithComplains : GoodDTOResponse() {
    var complaints: MutableList<ComplaintDTOResponse> = mutableListOf()
}

class GoodDTORequest {
    var name: String = ""
    var image: String = ""
    var description: String = ""
    var producingPlaceId: String = ""
    var weight: Int = 1
    var requirements: List<String> = listOf()
}

class OrderDTOResponse {
    var id: String = ""
    var comment: String = ""
    var good: GoodDTOResponse = GoodDTOResponse()
    var target: BunkerDTOResponse = BunkerDTOResponse()
    var courier: ShortCourierDTO? = null
    var positionX: Int = 0
    var positionY: Int = 0
    var status: String = ""
    var damage: Int = 0
}

class OrderDTORequest {
    var comment: String = ""
    var goodId: String = ""
    var targetId: String = ""
}



class CourierDTORequest {
    var nickname: String = ""
    var likes: Int = 0
    var comment: String = ""
    var positionX: Int = 0
    var positionY: Int = 0
}

open class CourierDTOResponse {
    open var id: String = ""
    open var nickname: String = ""
    open var likes: Int = 0
    open var positionX: Int = 0
    open var positionY: Int = 0
    open var orders: MutableList<OrderDTOResponse> = mutableListOf() //for all users - only their goods
}

class ExtendedCourierDTOResponse : CourierDTOResponse() {
    var comment: String = ""
}

class ComplaintDTORequest {
    var complaint: String = ""
}

class ComplaintDTOResponse {
    var good: GoodDTOResponse? = null
    var complaint: String = ""
    var user: UserDTOResponse = UserDTOResponse()
    var courier: ShortCourierDTO? = null
    var image: String? = null
}
class ShortCourierDTO{
    var courierId: String? = null
    var nickname: String = ""
}

class FinishOrderDTORequest {
    var likes: Int = 0
}