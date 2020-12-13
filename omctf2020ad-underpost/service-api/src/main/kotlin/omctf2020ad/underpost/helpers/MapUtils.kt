package omctf2020ad.underpost.helpers

import kotlin.math.abs
import kotlin.math.max

object MapUtils {
    fun calculateDistance(from: Pair<Int, Int>, to: Pair<Int, Int>): Int {
        val targetPositionX = from.first
        val targetPositionY = from.second
        val destinationPositionX = to.first
        val destinationPositionY = to.second
        val offsetCorrection = when {
            abs(targetPositionX - destinationPositionX) == 1 && max(targetPositionX, destinationPositionX) % 2 == 1 -> 0
            abs(targetPositionX - destinationPositionX) == 1 && max(targetPositionX, destinationPositionX) % 2 == 0 -> 1
            else -> abs(targetPositionX - destinationPositionX) / 2
        }
        return abs(targetPositionX - destinationPositionX) + //distance along X axis
                abs(targetPositionY - destinationPositionY) - //distance along Y axis
                offsetCorrection
    }
}