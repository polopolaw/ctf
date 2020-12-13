package omctf2020ad.underpost.auth

import omctf2020ad.underpost.models.User
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority

class TokenAuthentication(private var token: String,
                          authorities: Collection<SimpleGrantedAuthority?>?,
                          private var isAuthenticated: Boolean,
                          private var principal: User?) : Authentication {
    private var authorities: Collection<GrantedAuthority?>? = authorities
    private var details: Any? = null

    override fun getAuthorities(): Collection<GrantedAuthority?> {
        return authorities!!
    }

    override fun getCredentials() = null

    override fun getDetails() = details!!

    override fun getName() = principal?.fullName

    override fun getPrincipal() = principal

    override fun isAuthenticated() = isAuthenticated

    override fun setAuthenticated(b: Boolean) {
        isAuthenticated = b
    }

}