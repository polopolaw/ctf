package omctf2020ad.s4femap.services

import com.google.gson.Gson
import omctf2020ad.s4femap.auth.JwtUser
import omctf2020ad.s4femap.models.DTO
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.CoreConstants
import ch.qos.logback.core.LayoutBase
import org.springframework.stereotype.Component
import org.springframework.web.context.request.RequestAttributes
import org.springframework.web.context.request.RequestContextHolder
import javax.servlet.http.HttpServletRequest

@Component
class LoggingService {
    private var logger: Logger = LoggerFactory.getLogger(LoggingService::class.java)

    fun error(type: LogEventType, action: String, params: Any?, msg: String? ) {
        logEvent(type, LogEventResult.FAILED, action, params, msg ?: "", null )
    }

    fun error(type: LogEventType, action: String, params: Any?, error: Exception ) {
        logEvent(type, LogEventResult.FAILED, action, params, error.message ?: "", null )
    }

    fun success(type: LogEventType, action: String, params: Any?, output: Any?, msg: String = "" ){
        logEvent(type, LogEventResult.SUCCESS, action, params, msg, output)
    }

    fun trial(type: LogEventType, action: String, params: Any?, msg: String = ""){
        logEvent(type, LogEventResult.TRY, action, params, msg, null)
    }

    fun logEvent(type: LogEventType, result: LogEventResult, action: String, params: Any?, msg: String, output: Any?){
        val auth = SecurityContextHolder.getContext().authentication
        var userId = "";
        if(auth.principal is JwtUser) {
            val user = auth.principal as JwtUser
            userId = user.username;
        }
        var paramsString = ""
        val gson = Gson()
        if(params != null) {
            paramsString = String.format("| params: %s", gson.toJson(params))
        }
        var outputString = ""
        if(output != null) {
            outputString =  String.format("| output: %s", gson.toJson(output))
        }
        val context = RequestContextHolder.getRequestAttributes()
        val requestMethod:String = context?.getAttribute("METHOD", RequestAttributes.SCOPE_REQUEST) as String
        val requestUri:String = context?.getAttribute("URI", RequestAttributes.SCOPE_REQUEST) as String
        val remoteIp:String = context?.getAttribute("IP", RequestAttributes.SCOPE_REQUEST) as String

        logger.warn(String.format("| uri: %s | from: %s | event: %s | action: %s %s | result: %s | user: %s | %s %s|",
                requestMethod + ' ' + requestUri,
                remoteIp,
                type,
                action,
                paramsString,
                result,
                userId,
                msg,
                outputString
        ));
    }
}

enum class LogEventResult(val value: String) {
    SUCCESS("SUCCESS"),
    FAILED("FAILED"),
    TRY("TRY")
}

enum class LogEventType(val value: String) {
    ACCOUNT("ACCOUNT"),
    DATA_ACCESS("DATA_ACCESS"),
    FLAG_FIELD("FLAG_FIELD"),
    FILE_UPLOAD("FILE_UPLOAD"),
    EXTERNAL_EXECUTION("EXTERNAL_EXECUTION"),
}