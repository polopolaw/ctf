package omctf2020ad.s4femap.controllers;

import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.context.request.WebRequest
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler


@ControllerAdvice
class RestExceptionHandler : ResponseEntityExceptionHandler() {
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

    @ExceptionHandler(CourierNotFoundException::class)
    protected fun handleUserNotFound(ex: Exception, request: WebRequest): ResponseEntity<Any> {
        return handleExceptionInternal(ex, "Courier Not Found",
                HttpHeaders(), HttpStatus.NOT_FOUND, request)
    }

    @ExceptionHandler(MarkNotFoundException::class)
    protected fun handleMarkNotFound(ex: Exception, request: WebRequest): ResponseEntity<Any> {
        return handleExceptionInternal(ex, "Mark Not Found",
                HttpHeaders(), HttpStatus.NOT_FOUND, request)
    }

    @ExceptionHandler(NotAuthorizedException::class)
    protected fun handleNotAuthorized(ex: NotAuthorizedException, request: WebRequest): ResponseEntity<Any> {
        return handleExceptionInternal(ex, "Action is not authorized. " + ex.msg,
                HttpHeaders(), HttpStatus.FORBIDDEN, request)
    }


    @ExceptionHandler(DirectoryNotExistsException::class)
    protected fun handleDirectoryNotFound(ex: Exception, request: WebRequest): ResponseEntity<Any> {
        return handleExceptionInternal(ex, "Directory Not Found",
                HttpHeaders(), HttpStatus.NOT_FOUND, request)
    }
}
class CourierNotFoundException : RuntimeException()
class NotUniqueFieldException(val field: String) : RuntimeException()
class WrongPasswordException : RuntimeException()
class MarkNotFoundException : RuntimeException()
class NotAuthorizedException(val msg:String="") : RuntimeException()
class DirectoryNotExistsException: RuntimeException()
