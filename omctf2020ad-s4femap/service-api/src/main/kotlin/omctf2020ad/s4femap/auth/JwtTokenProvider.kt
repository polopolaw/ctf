package omctf2020ad.s4femap.auth

import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import omctf2020ad.s4femap.services.CourierService
import org.apache.tomcat.util.codec.binary.Base64
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.stereotype.Component
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException
import java.util.*
import javax.servlet.http.HttpServletRequest


@Component
class JwtTokenProvider {
    private val validityInMilliseconds: Long = 3600000
    @Value("\${app.secret}")
    private lateinit var secret: String
    @Autowired
    private lateinit var courierService: CourierService


    @Throws(NoSuchAlgorithmException::class)
    fun encodePassword(secret: String): String {
        val md = MessageDigest.getInstance("SHA-256")
        return Base64.encodeBase64String(md.digest(secret.toByteArray()))
    }

    fun createToken(user: JwtUser): String {
        val claims = Jwts.claims().setSubject(user.username)
        claims["id"] = user.id
        val now = Date()
        val validity = Date(now.time + validityInMilliseconds)
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(SignatureAlgorithm.HS256, encodePassword(secret))
                .compact()
    }

    fun getAuthentication(token: String?): Authentication {
        val userDetails = courierService.loadUserByUsername(getUsername(token.toString()))
        return UsernamePasswordAuthenticationToken(userDetails, "", userDetails.authorities)
    }

    fun getUsername(token: String): String {
        return Jwts.parser().setSigningKey(encodePassword(secret)).parseClaimsJws(token).body.subject
    }

    fun resolveToken(req: HttpServletRequest): String? {
        val bearerToken = req.getHeader("Authorization")
        return if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            bearerToken.substring(7)
        } else null
    }


    fun validateToken(token: String): Boolean {
        return try {
            val claims = Jwts.parser().setSigningKey(encodePassword(secret)).parseClaimsJws(token)
            return !claims.body.expiration.before(Date())
        } catch (exc: JwtException) {
            false
        } catch (exc: IllegalArgumentException) {
            false

        }
    }


}