package omctf2020ad.s4femap.services

import org.springframework.stereotype.Service

@Service
class MarkTypesService() {
    val enemy = "enemy"
    val anomaly = "anomaly"
    val loot = "loot"
    val obstacle = "obstacle"
    val assistance = "assistance"
    val sensor = "sensor"

    fun getAll(): List<String> {
        return listOf(enemy, anomaly, loot, obstacle, assistance, sensor)
    }
}