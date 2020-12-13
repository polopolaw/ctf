package omctf2020ad.s4femap.configurations

import omctf2020ad.s4femap.auth.JwtTokenFilter
import omctf2020ad.s4femap.auth.JwtTokenProvider
import omctf2020ad.s4femap.auth.WebSecurityCorsFilter
import omctf2020ad.s4femap.services.LoggingService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Scope
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

@Configuration
@EnableWebSecurity
class ApiSecurityConfiguration : WebSecurityConfigurerAdapter() {
    @Autowired
    private lateinit var jwtTokenProvider: JwtTokenProvider

    @Autowired
    private lateinit var logger: LoggingService

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
                .and().addFilterBefore(WebSecurityCorsFilter(), ChannelProcessingFilter::class.java)
                .addFilterAfter(jwtTokenFilter(), UsernamePasswordAuthenticationFilter::class.java)
                .authorizeRequests()
                .antMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
                .antMatchers(HttpMethod.POST, "/api/user").permitAll()
                .antMatchers(HttpMethod.POST, "/api/user/session").permitAll()
                .antMatchers(HttpMethod.GET, "/api/user").hasAnyRole("USER")
                .antMatchers("/api/mark/**").hasAnyRole("USER")
                .antMatchers(HttpMethod.POST, "/api/mark/**").hasAnyRole("USER")
                .antMatchers("/api/bunkers/**").hasAnyRole("USER")
                //TODO do we have ADMINs or specific rights here? if no - I'd rather simplify this
                //.antMatchers("/api/ping", "/api/version", "/api/health", "/api/exploit").permitAll()
    }

    @Throws(Exception::class)
    override fun configure(web: WebSecurity) {
        web.ignoring().antMatchers("/api/healthcheck", "/api/version")
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.setAllowedOrigins(Collections.singletonList("*"));
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "HEAD", "OPTIONS", "DELETE", "PATCH")
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/api/**", configuration)
        return source
    }


    @Bean
    fun jwtTokenFilter(): JwtTokenFilter {
        return JwtTokenFilter(jwtTokenProvider, logger)
    }
}