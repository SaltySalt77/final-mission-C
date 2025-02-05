package com.peer.missionpeerflow.controller;

import com.peer.missionpeerflow.dto.request.comment.QuestionCommentDeleteRequest;
import com.peer.missionpeerflow.dto.request.comment.QuestionCommentRequest;
import com.peer.missionpeerflow.dto.response.QuestionCommentResponse;
import com.peer.missionpeerflow.exception.UnauthorizedException;
import com.peer.missionpeerflow.service.QuestionCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@RequiredArgsConstructor
@RequestMapping("/v1/question/comment")
@RestController
public class QuestionCommentController {

    private final QuestionCommentService questionCommentService;

    @PostMapping("")
    public Map<String, String> create(@Valid @RequestBody QuestionCommentRequest questionCommentRequest)
    {
        questionCommentService.create(questionCommentRequest);
        return CreateIdJson.createIdJson(Long.toString(questionCommentRequest.getQuestionId()));
    }

    @GetMapping("")
    public Page<QuestionCommentResponse> getPage(@RequestParam(value = "questionId") Long questionId, @RequestParam(value = "page", defaultValue = "0") int page, @RequestParam(value = "size", defaultValue = "10") int size)
    {
        return questionCommentService.getPage(questionId, page, size);
    }

    @PutMapping("/{commentId}")
    public Map<String, String>  modify(@Valid @RequestBody QuestionCommentRequest questionCommentRequest, @PathVariable("commentId") Long commentId)
    {
        if (questionCommentRequest.getPassword().equals(questionCommentService.getComment(commentId).getPassword())) {
            questionCommentService.modify(commentId, questionCommentRequest);
        }
        else {
            throw new UnauthorizedException("비밀번호가 일치하지 않습니다.");
        }
        return CreateIdJson.createIdJson(Long.toString(questionCommentRequest.getQuestionId()));
    }

    @PostMapping("/{commentId}")
    public ResponseEntity delete(@Valid @RequestBody QuestionCommentDeleteRequest questionCommentDeleteRequest, @PathVariable("commentId") Long commentId)
    {
        if (questionCommentDeleteRequest.getPassword().equals(questionCommentService.getComment(commentId).getPassword())) {
            questionCommentService.delete(commentId);
        }
        else {
            throw new UnauthorizedException("비밀번호가 일치하지 않습니다.");
        }
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
    }
}
