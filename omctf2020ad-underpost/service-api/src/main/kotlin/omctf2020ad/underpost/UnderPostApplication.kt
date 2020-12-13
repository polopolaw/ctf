package omctf2020ad.underpost

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
@EnableJpaRepositories(basePackages = ["omctf2020ad.underpost.repositories"])
class UnderPostApplication

fun main(args: Array<String>) {
    runApplication<UnderPostApplication>(*args)
}
