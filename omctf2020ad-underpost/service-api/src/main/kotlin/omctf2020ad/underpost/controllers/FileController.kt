package omctf2020ad.underpost.controllers

import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController
import java.net.URLDecoder
import java.nio.file.Path
import javax.servlet.http.HttpServletRequest


@RestController
@RequestMapping("/api/files")
class FileController {
    @GetMapping("/**")
    @ResponseBody
    fun serveFile(request: HttpServletRequest): ResponseEntity<Resource> {
        val pathPart = request.requestURI.split(request.contextPath + "/api/files/")[1]
        val decoded = URLDecoder.decode(pathPart, "utf-8")
        val file = Path.of("images/$decoded")
        val resource = UrlResource(file.toUri())
        if (resource.exists() || resource.isReadable) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.fileName.toString() + "\"")
                    .body(resource)
        } else {
            throw RuntimeException("Could not read file: $pathPart")
        }

    }
}