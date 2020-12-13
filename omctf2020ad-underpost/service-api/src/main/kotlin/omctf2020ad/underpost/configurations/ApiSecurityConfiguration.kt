package omctf2020ad.underpost.configurations

import omctf2020ad.underpost.auth.JwtTokenFilter
import omctf2020ad.underpost.auth.JwtTokenProvider
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.builders.WebSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.access.channel.ChannelProcessingFilter
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import java.util.*


/*
contains all configuration connected with security
 */
@Configuration
@EnableWebSecurity
class ApiSecurityConfiguration : WebSecurityConfigurerAdapter() {
    @Autowired
    private lateinit var jwtTokenProvider: JwtTokenProvider

    @Throws(Exception::class)
    override fun configure(http: HttpSecurity) {
        http
                .cors()
                .and()
                .csrf()
                .disable()
                .headers().frameOptions().sameOrigin()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .addFilterBefore(WebSecurityCorsFilter(), ChannelProcessingFilter::class.java)
                .addFilterAfter(jwtTokenFilter(), UsernamePasswordAuthenticationFilter::class.java)
                .authorizeRequests()
                .antMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
                .antMatchers(HttpMethod.POST, "/api/users").permitAll()
                .antMatchers(HttpMethod.GET, "/api/files/**").permitAll()
                .antMatchers("/api/session", "/api/restore", "/api/ping", "/api/version", "/api/health").permitAll()
                .antMatchers("/api/admin/**").hasAnyAuthority("ROLE_ADMIN")
                .antMatchers(HttpMethod.POST, "/api/bunkers/**", "/api/couriers/**", "/api/goods/**").hasAnyAuthority("ROLE_ADMIN")
                .antMatchers("/api/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_USER")

    }

    @Throws(Exception::class)
    override fun configure(web: WebSecurity) {
        web.ignoring().antMatchers("/api/healthcheck", "/api/version")
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = Collections.singletonList("*")
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "HEAD", "OPTIONS", "DELETE", "PATCH")
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/api/**", configuration)
        return source
    }

    @Bean
    fun jwtTokenFilter(): JwtTokenFilter {
        return JwtTokenFilter(jwtTokenProvider)
    }
}