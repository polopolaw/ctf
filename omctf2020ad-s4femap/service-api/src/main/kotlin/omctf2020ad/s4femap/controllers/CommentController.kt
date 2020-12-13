package omctf2020ad.s4femap.controllers

import io.swagger.annotations.ApiOperation
import omctf2020ad.s4femap.models.CreateCommentDTORequest
import omctf2020ad.s4femap.models.MarkDTORequest
import omctf2020ad.s4femap.services.CommentsService
import omctf2020ad.s4femap.services.MarkService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/mark")
class CommentController(@Autowired val commentsService: CommentsService) {

    @PostMapping("/{markId}/comment")
    @ApiOperation("creates new comment for specified mark")
    fun createComment(@PathVariable(name = "markId") markId: String,  @RequestBody comment: CreateCommentDTORequest) = commentsService.create(markId,  comment)

    @GetMapping("/{markId}/comment")
    @ApiOperation("Get all comments available for current user")
    fun listComments(@PathVariable(name = "markId") markId: String) = commentsService.listAll(markId)


}