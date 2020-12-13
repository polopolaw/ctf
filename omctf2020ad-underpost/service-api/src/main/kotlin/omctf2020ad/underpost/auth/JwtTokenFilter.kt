package omctf2020ad.underpost.auth

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.context.request.RequestAttributes
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.filter.GenericFilterBean
import java.io.IOException
import javax.servlet.FilterChain
import javax.servlet.ServletException
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest

class JwtTokenFilter @Autowired constructor(private val jwtTokenProvider: JwtTokenProvider) : GenericFilterBean() {
    @Throws(IOException::class, ServletException::class)
    override fun doFilter(servletRequest: ServletRequest, servletResponse: ServletResponse, filterChain: FilterChain) {
        val request = servletRequest as HttpServletRequest
        saveRequestAttributes(request)
        val token = jwtTokenProvider.resolveToken(request)
        if (token != null && jwtTokenProvider.validateToken(token)) {
            val authentication = jwtTokenProvider.getAuthentication(token)
            SecurityContextHolder.getContext().authentication = authentication
        }
        filterChain.doFilter(servletRequest, servletResponse)
    }

    private fun saveRequestAttributes(request: HttpServletRequest) {
        val context = RequestContextHolder.getRequestAttributes()
        var q = (if(request.queryString != null)  "?" + request.queryString  else "")
        context?.setAttribute("METHOD", request.method, RequestAttributes.SCOPE_REQUEST)
        context?.setAttribute("URI", request.requestURI + q , RequestAttributes.SCOPE_REQUEST)
        context?.setAttribute("IP", request.remoteAddr, RequestAttributes.SCOPE_REQUEST)
    }

}