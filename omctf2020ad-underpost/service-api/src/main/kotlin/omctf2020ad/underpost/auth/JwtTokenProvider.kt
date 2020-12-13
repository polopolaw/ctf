package omctf2020ad.underpost.auth

import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.impl.TextCodec
import omctf2020ad.underpost.models.User
import org.apache.tomcat.util.codec.binary.Base64
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Component
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException
import java.util.*
import java.util.regex.Pattern
import javax.servlet.http.HttpServletRequest

@Component
class JwtTokenProvider {
    private val validityInMilliseconds: Long = 3600000
    @Value("\${app.secret}")
    private lateinit var secret: String
    @Autowired
    private lateinit var userDetailsService: UserDetailsService

    @Throws(NoSuchAlgorithmException::class)
    fun encodePassword(secret: String): String {
        val md = MessageDigest.getInstance("SHA-256")
        return Base64.encodeBase64String(md.digest(secret.toByteArray()))
    }

    fun createToken(user: JwtUser): String {
        SaltStorage.add(user.username, user.salt.toString()) //add personalized salt
        val secretKey = composePersonalSecretKey(user.username)
        val claims = Jwts.claims().setSubject(user.username)
        val authority = user.authorities.iterator().next()
        val authorityRole = authority.authority
        claims["role"] = authorityRole
        claims["id"] = user.id
        val now = Date()
        val validity = Date(now.time + validityInMilliseconds)
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact()
    }

    fun getAuthentication(token: String?): Authentication {
        val secretKey = composeSecretKey(token)
        val claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).body
        val username = claims.subject
        val authorityRole = claims["role"] as String?
        val id = claims["id"] as String
        //optimization: do not require db connection here
//data in token is protected from change by control hash sum.
//No one can dechyper other user token because secret is user specific
        val user = User();
        user.id = id
        user.login = username
        user.role = if (authorityRole!!.startsWith("ROLE_")) authorityRole.substring(5).toLowerCase() else ""

        return TokenAuthentication(token!!,
                convertToAuthorities(authorityRole),
                true,
                user
        )
    }

    fun resolveToken(req: HttpServletRequest): String? {
        val bearerToken = req.getHeader("Authorization")
        return if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            bearerToken.substring(7)
        } else null
    }

    fun validateToken(token: String?): Boolean {
        return try {
            val secretKey = composeSecretKey(token)
            val claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).body
            claims.expiration.after(Date())
        } catch (exc: JwtException) {
            false
        } catch (exc: IllegalArgumentException) {
            false
        }
    }

    private fun convertToAuthorities(authorityRole: String?): ArrayList<SimpleGrantedAuthority?> {
        val authorities = ArrayList<SimpleGrantedAuthority?>()
        authorities.add(SimpleGrantedAuthority(authorityRole))
        return authorities
    }

    fun composeSecretKey(token: String?): String? {
        if (token == null || token == "") {
            return null
        }
        val tokenData = String(TextCodec.BASE64URL.decode(token))
        val sub = Pattern.compile("\"sub\":\\s*?\"(.+?)\"", Pattern.MULTILINE)
        val matcher = sub.matcher(tokenData)
        return if (matcher.find()) {
            val username = matcher.group(1)
            composePersonalSecretKey(username)
        } else {
            null
        }
    }

    fun composePersonalSecretKey(username: String?): String? {
        if (username == null || username == "") {
            return null
        }
        var secretKey = SaltStorage.getSalt(username) + secret //mix with personalized salt
        //enlarge lengh of secret key to 64 to prevent brutforce
        while (secretKey.length < 64) {
            secretKey += secretKey
        }
        secretKey = secretKey.substring(0, 64)
        return secretKey
    }
}