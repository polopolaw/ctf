package omctf2020ad.s4femap.auth

import java.io.IOException
import javax.servlet.*
import javax.servlet.http.HttpServletResponse


class WebSecurityCorsFilter : Filter {
    @Throws(ServletException::class)
    override fun init(filterConfig: FilterConfig?) {
    }

    @Throws(IOException::class, ServletException::class)
    override fun doFilter(request: ServletRequest?, response: ServletResponse, chain: FilterChain) {
        val res = response as HttpServletResponse
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT, HEAD, PATCH")
        res.setHeader("Access-Control-Max-Age", "3600")
        res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, x-requested-with, Cache-Control")
        chain.doFilter(request, res)
    }

    override fun destroy() {}
}
