package omctf2020ad.s4femap

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
@EnableJpaRepositories(basePackages = ["omctf2020ad.s4femap.repositories"])
class S4femapApplication

fun main(args: Array<String>) {
    runApplication<S4femapApplication>(*args)
}
