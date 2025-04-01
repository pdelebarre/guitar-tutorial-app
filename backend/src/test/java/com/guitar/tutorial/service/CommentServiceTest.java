package com.guitar.tutorial.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.guitar.tutorial.model.Comment;
import com.guitar.tutorial.repository.CommentRepository;

class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentService commentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetCommentsByTutorial() {
        Comment comment1 = new Comment();
        Comment comment2 = new Comment();
        when(commentRepository.findByTutorialId(1L)).thenReturn(Arrays.asList(comment1, comment2));

        List<Comment> result = commentService.getCommentsByTutorial(1L);
        
        assertEquals(2, result.size());
        verify(commentRepository, times(1)).findByTutorialId(1L);
    }

    @Test
    void testAddComment() {
        Comment comment = new Comment();
        when(commentRepository.save(comment)).thenReturn(comment);

        Comment result = commentService.addComment(comment);
        
        assertNotNull(result);
        verify(commentRepository, times(1)).save(comment);
    }

    @Test
    void testDeleteComment() {
        commentService.deleteComment(1L);
        verify(commentRepository, times(1)).deleteById(1L);
    }
}