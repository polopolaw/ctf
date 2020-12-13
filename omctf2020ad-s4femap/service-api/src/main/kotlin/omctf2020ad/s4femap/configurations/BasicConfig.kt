package omctf2020ad.s4femap.configurations

import omctf2020ad.s4femap.auth.JwtUser
import omctf2020ad.s4femap.models.*
import omctf2020ad.s4femap.services.MarkLogDTO
import org.modelmapper.Converter
import org.modelmapper.ModelMapper
import org.modelmapper.PropertyMap
import org.modelmapper.convention.MatchingStrategies
import org.modelmapper.spi.MappingContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


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

        val user2JwtuserConverter : Converter<Courier, JwtUser> = object: Converter<Courier, JwtUser> {
            override fun convert(p0: MappingContext<Courier, JwtUser>?): JwtUser {
                val user = p0?.source
                val jwtUser = JwtUser(
                        user?.id ?: "",
                        user?.login ?: "",
                        user?.passwordHash ?: "")
                return jwtUser
            }
        }
        mapper.addConverter(user2JwtuserConverter);

        val mark2markDtoConverter : Converter<Mark, MarkDTO> = object: Converter<Mark, MarkDTO> {
            override fun convert(p0: MappingContext<Mark, MarkDTO>?): MarkDTO {
                val mark = p0?.source ?: return MarkDTO()
                val dto = MarkDTO()
                dto.x = mark.x
                dto.y = mark.y
                dto.id = mark.id
                dto.name = mark.name
                dto.author = mark.author.login
                dto.isPrivate = mark.isPrivate
                dto.markType = mark.markType
                dto.sharedWith = mark.sharedWith?.login
                dto.likes = mark.likes
                dto.comments = mark.comments
                dto.isLiked = mark.isLiked
                return dto
            }
        }
        mapper.addConverter(mark2markDtoConverter);

        val comment2commentDtoConverter : Converter<Comment, CommentDTO> = object: Converter<Comment, CommentDTO> {
            override fun convert(p0: MappingContext<Comment, CommentDTO>?): CommentDTO {
                val comment = p0?.source ?: return CommentDTO()

                val dto = CommentDTO()
                dto.id = comment.id
                dto.description = comment.description
                dto.author = comment.author.login
                dto.isPrivate = comment.isPrivate
                dto.markId = comment.mark.id
                if(comment.isPrivate && comment.sharedWith != null) {
                    dto.sharedWith = comment.sharedWith?.login
                }

                return dto
            }
        }
        mapper.addConverter(comment2commentDtoConverter);

        val mark2markLogDtoConverter : Converter<Mark, MarkLogDTO> = object: Converter<Mark, MarkLogDTO> {
            override fun convert(p0: MappingContext<Mark, MarkLogDTO>?): MarkLogDTO {
                val mark = p0?.source ?: return MarkLogDTO()

                val dto = MarkLogDTO()
                dto.name = mark.name
                dto.author = mark.author.login
                dto.isPrivate = mark.isPrivate
                return dto
            }
        }
        mapper.addConverter(mark2markLogDtoConverter);

        return mapper
    }

}