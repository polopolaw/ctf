package omctf2020ad.underpost.auth

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.util.*

class JwtUser(
        val id: String,
        private val username: String,
        private val password: String,
        private val role: String,
        val salt: String
) : UserDetails {
    override fun getAuthorities(): Collection<GrantedAuthority> {
        val authorities = ArrayList<GrantedAuthority>()
        authorities.add(SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
        return authorities
    }

    override fun getPassword() = password

    override fun getUsername() = username

    override fun isAccountNonExpired() = true

    override fun isAccountNonLocked() = true

    override fun isCredentialsNonExpired() = false

    override fun isEnabled() = true

}