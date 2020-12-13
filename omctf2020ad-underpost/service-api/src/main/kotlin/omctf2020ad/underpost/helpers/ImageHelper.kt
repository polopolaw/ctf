package omctf2020ad.underpost.helpers

import omctf2020ad.underpost.services.LogEventType
import omctf2020ad.underpost.services.LoggingService
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.nio.file.Path
import java.security.InvalidParameterException


object ImageHelper {
    fun saveImage(image: MultipartFile, login: String, log: LoggingService): String {
        val filePathInfo = "images/$login/${image.originalFilename?:"<null>"}"
        var info: FileUploadLogDto = FileUploadLogDto(pathToSave = filePathInfo, fileStartBytes = image.inputStream?.readNBytes(30))
        try {
            if (!isPngOrJpeg(image.contentType)) {
                throw InvalidParameterException("JPG or PNG images are valid only")
            }
            val path = Path.of("images/$login")
            if (!path.toFile().exists()) {
                path.toFile().mkdirs()
            }
            val filePath = Path.of("images/$login/${image.originalFilename!!}")
            val dest = File(filePath.toUri())
            image.transferTo(dest)
            val result = "$login/${image.originalFilename!!}"
            log.success(LogEventType.FILE_UPLOAD, "image file upload", info, result )
            return result
        }
        catch(ex: Exception){
            log.error(LogEventType.FILE_UPLOAD, "image file upload", info, ex )
            throw ex
        }

    }

    private fun isPngOrJpeg(contentType: String?) = listOf("image/png", "image/jpeg").contains(contentType)
}

class FileUploadLogDto(
    val pathToSave: String? = null,
    val fileStartBytes: ByteArray? = null
)