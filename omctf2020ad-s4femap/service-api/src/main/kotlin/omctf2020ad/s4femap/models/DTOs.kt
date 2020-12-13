package omctf2020ad.s4femap.models;

open class DTO {

}

class CourierDTORequest : DTO() {
    val login: String = ""
    var password: String = ""
    val personalID: String = ""
}

class MarkDTORequest: DTO() {
    val x: Int = -1
    val y: Int = -1
    val name: String = ""
    var markType: String = ""
    var sensorCode: String? = null
    var isPrivate: Boolean = false
    var sharedWith: String? = null
}

class UpdateMarkDTORequest: DTO() {
    val name: String? = null
    val sensorCode: String? = null
}

class LoginDTORequest: DTO() {
    val login: String = ""
    val password: String = ""
}

class CreateCommentDTORequest: DTO() {
    val description: String =""
    val isPrivate: Boolean = false
    var sharedWith: String? = null
}

class CommentDTO: DTO() {
    var id: String = ""

    //decoded for private
    var description: String = ""

    var markId: String = ""

    var author: String = ""

    var sharedWith: String? = null

    var isPrivate: Boolean = false
}

open class CourierDTOResponse: DTO() {
    open var id: String = ""
    open val login: String = ""
}

class ExtendedCourierDTOResponse : CourierDTOResponse() {
    var personalID: String = ""
}

open class MarkDTO: DTO() {
    var x: Int = 0
    var y: Int = 0
    var id: String = ""
    var name: String = ""
    var author: String = ""
    var isPrivate: Boolean = false
    var markType: String = ""
    var sharedWith: String? = null
    var likes: Int = 0
    var comments: Int = 0
    var isLiked: Boolean = false
}

class ExtendedMarkDTO : MarkDTO() {
    var sensorData: String? = null
}

class MapMarkDTOResponse : DTO() {
    var cell: CellDTO = CellDTO(0, 0)
    var markToShow: MarkDTO = MarkDTO()
    var marks: List<MarkDTO> = listOf<MarkDTO>()
    var marksCount = 0
}

class CellDTO(var x: Int, var y: Int) :DTO()

class ResponseWithToken<T>(
        val token: String,
        val data: T
)

class SensorAnomalyRequest: DTO() {
    val sensorId: String = ""
}

class SensorAnomalyResponse(val anomaly: String) : DTO()

class BunkerDTORequest: DTO() {
    var name: String = ""
    var positionX: Int = 0
    var positionY: Int = 0
}

class BunkerDTOResponse:DTO() {
    var id: String = ""
    var name: String = ""
    var positionX: Int = 0
    var positionY: Int = 0
}

class Response<T>(
        val data: T
)

