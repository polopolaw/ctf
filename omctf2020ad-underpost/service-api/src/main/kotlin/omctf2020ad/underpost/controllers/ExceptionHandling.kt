package omctf2020ad.underpost.controllers

import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.context.request.WebRequest
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import java.security.InvalidParameterException

/*
Handles custom exceptions and transform them to the user and UI readable error messages
 */
@ControllerAdvice
class RestExceptionHandler : ResponseEntityExceptionHandler() {
    @ExceptionHandler(UserNotFoundException::class)
    protected fun handleUserNotFound(ex: Exception, request: WebRequest): ResponseEntity<Any> {
        return handleExceptionInternal(ex, "User Not Found",
                HttpHeaders(), HttpStatus.NOT_FOUND, request)
    }

    @ExceptionHandler(ObjectNotFoundException::class)
    protected fun handleNotFound(ex: ObjectNotFoundException, request: WebRequest): ResponseEntity<Any> {
        return handleExceptionInternal(ex, "${ex.obj} with id ${ex.id} not found",
                HttpHeaders(), HttpStatus.NOT_FOUND, request)
    }

    @ExceptionHandler(NotUniqueFieldException::class)
    protected fun handleNotUnique(ex: NotUniqueFieldException, request: WebRequest): ResponseEntity<Any> {
        return handleExceptionInternal(ex, "Field should be unique: ${ex.field}",
                HttpHeaders(), HttpStatus.CONFLICT, request)
    }

    @ExceptionHandler(WrongPasswordException::class)
    protected fun handleWrongPassword(ex: WrongPasswordException, request: WebRequest): ResponseEntity<Any> {
        return handleExceptionInternal(ex, "Wrong password",
                HttpHeaders(), HttpStatus.NOT_FOUND, request)
    }

    @ExceptionHandler(InvalidParameterException::class)
    protected fun handleInvalidParameter(ex: InvalidParameterException, request: WebRequest): ResponseEntity<Any> {
        return handleExceptionInternal(ex, ex.message,
                HttpHeaders(), HttpStatus.UNPROCESSABLE_ENTITY, request)
    }
}

/*
list of custom exceptions to transform
 */
class UserNotFoundException : RuntimeException()
class ObjectNotFoundException(val obj: String, val id: String) : RuntimeException()
class NotUniqueFieldException(val field: String) : RuntimeException()
class WrongPasswordException : RuntimeException()
