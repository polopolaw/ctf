package omctf2020ad.underpost.helpers

import omctf2020ad.underpost.models.Order
import omctf2020ad.underpost.services.LogEventType
import omctf2020ad.underpost.services.LoggingService
import java.nio.charset.Charset
import java.nio.charset.StandardCharsets
import java.nio.file.Path
import java.util.concurrent.TimeUnit

object PaymentHelper {
    fun requestPayment(order: Order, likes: Int,  log: LoggingService) {
        val contactNumber = order.user.contactNumber
        try {
            val provider = contactNumber.slice(0..2)
            val from = contactNumber.substring(3)
            val to = order.courier?.nickname
            val paymentUtility = "pay$provider.jar"
            //val filePath = Path.of("bin/$paymentUtility").toUri().toString().replace("file:///", "")
            val filePath = "./bin/$paymentUtility"
            log.trial(LogEventType.EXTERNAL_EXECUTION, "delivery payment", null, "java -jar $filePath $to $from $likes")
            val process = ProcessBuilder("java", "-jar", filePath, to, from, likes.toString()).start()
            val error = process.errorStream.bufferedReader(charset = StandardCharsets.UTF_8).readLines()
            val output = process.inputStream.bufferedReader(charset = StandardCharsets.UTF_8).readLines()
            process.waitFor(500, TimeUnit.MILLISECONDS)
            val allOutput = output.joinToString("\n")
            val allError = error.joinToString { "" }
            if(allError.trim().isNotEmpty()){
                log.error(LogEventType.EXTERNAL_EXECUTION, "delivery payment",  PaymentLogDto(contactNumber, likes), allError + allOutput)
            } else {
                log.success(LogEventType.EXTERNAL_EXECUTION, "delivery payment", PaymentLogDto(contactNumber, likes), allOutput)
            }
        }
        catch(ex:Exception) {
            log.error(LogEventType.EXTERNAL_EXECUTION, "confirm delivery", PaymentLogDto(contactNumber, likes), ex)
            throw ex
        }
    }
}

class PaymentLogDto(
    val contactNumber: String = "",
    val likes: Int = 0
)