package omctf2020ad.underpost.configurations

import omctf2020ad.underpost.auth.JwtUser
import omctf2020ad.underpost.models.User
import org.modelmapper.Converter
import org.modelmapper.ModelMapper
import org.modelmapper.convention.MatchingStrategies
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

/*
contains all basic configuration beans
 */
@Configuration
class BasicConfig {

    //configures model mapping
    @Bean
    fun modelMapper(): ModelMapper? {
        val mapper = ModelMapper()
        mapper.configuration
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setFieldMatchingEnabled(true)
                .setSkipNullEnabled(true)
                .fieldAccessLevel = org.modelmapper.config.Configuration.AccessLevel.PRIVATE

        val user2JwtuserConverter: Converter<User, JwtUser> = Converter<User, JwtUser> { p0 ->
            val user = p0?.source
            val jwtUser = JwtUser(
                    user?.id ?: "",
                    user?.login ?: "",
                    user?.passwordHash ?: "",
                    user?.role ?: "",
                    user?.personalID ?: "")

            jwtUser
        }
        mapper.addConverter(user2JwtuserConverter)


        return mapper
    }
}

