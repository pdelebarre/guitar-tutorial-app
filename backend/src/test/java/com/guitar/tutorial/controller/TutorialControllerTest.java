package com.guitar.tutorial.controller;

import com.guitar.tutorial.dto.TutorialDTO;
import com.guitar.tutorial.service.TutorialService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class TutorialControllerTest {

    @Mock
    private TutorialService tutorialService;

    @InjectMocks
    private TutorialController tutorialController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(tutorialController, "tutorialsDirectory", "/path/to/tutorials");
    }

    @Test
    void testListTutorials_Success() throws Exception {
        // Arrange
        List<String> mockTutorials = List.of("tutorial1.mp4", "tutorial2.pdf");
        when(tutorialService.listTutorials(any(Path.class), anyList())).thenReturn(mockTutorials);

        // Act
        ResponseEntity<List<TutorialDTO>> response = tutorialController.listTutorials();

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());

        TutorialDTO tutorial1 = response.getBody().get(0);
        assertEquals("tutorial1.mp4", tutorial1.getName());
        assertEquals("mp4", tutorial1.getType());
        verify(tutorialService, times(1)).listTutorials(any(Path.class), anyList());
    }

    @Test
    void testListTutorials_EmptyDirectory() throws Exception {
        // Arrange
        when(tutorialService.listTutorials(any(Path.class), anyList())).thenReturn(List.of());

        // Act
        ResponseEntity<List<TutorialDTO>> response = tutorialController.listTutorials();

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void testGetFile_Success() throws Exception {
        // Arrange
        Resource mockResource = new ByteArrayResource("Dummy content".getBytes());
        when(tutorialService.getFile(any(Path.class), eq("tutorial1"), eq("mp4"))).thenReturn(mockResource);

        // Act
        ResponseEntity<Resource> response = tutorialController.getFile("tutorial1", "mp4");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Dummy content", new String(response.getBody().getInputStream().readAllBytes()));
    }

    @Test
    void testGetFile_NotFound() throws Exception {
        // Arrange
        when(tutorialService.getFile(any(Path.class), eq("tutorial1"), eq("mp4")))
                .thenThrow(new FileNotFoundException("File not found"));

        // Act
        when(tutorialService.getFile(any(Path.class), eq("tutorial1"), eq("mp4")))
                .thenThrow(new FileNotFoundException("File not found"));

        // Act & Assert
        FileNotFoundException exception = assertThrows(FileNotFoundException.class, () -> {
            tutorialController.getFile("tutorial1", "mp4");
        });
        assertEquals("File not found", exception.getMessage());
    }

    @Test
    void testGetFile_InternalError() throws Exception {
        // Arrange
        when(tutorialService.getFile(any(Path.class), eq("tutorial1"), eq("mp4")))
                .thenThrow(new RuntimeException("Internal error"));

        // Act
        ResponseEntity<Resource> response = null;
        try {
            response = tutorialController.getFile("tutorial1", "mp4");
        } catch (RuntimeException e) {
            assertEquals("Internal error", e.getMessage());
            return;
        }

        // Assert
        fail("Expected RuntimeException was not thrown");
    }
}