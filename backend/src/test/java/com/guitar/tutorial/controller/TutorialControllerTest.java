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
        ReflectionTestUtils.setField(tutorialController, "supportedExtensions", List.of("mp4", "pdf"));
    }

    @Test
    void testListTutorials_Success() throws Exception {
        // Arrange
        TutorialService.TutorialGroup mockGroup1 = new TutorialService.TutorialGroup("tutorial1");
        mockGroup1.addFile(Path.of("/path/to/tutorial1.mp4"), "mp4");
        
        List<String> supportedExtensions = List.of("mp4", "pdf");
        Path expectedPath = Path.of("/path/to/tutorials");
        
        System.out.println("Setting up mock to return: " + mockGroup1);
        when(tutorialService.listTutorials(eq(expectedPath), eq(supportedExtensions)))
            .thenReturn(List.of(mockGroup1));

        // Act
        ResponseEntity<List<TutorialDTO>> response = tutorialController.listTutorials();
        System.out.println("Received response: " + response.getBody());

        // Assert
        verify(tutorialService).listTutorials(eq(expectedPath), eq(supportedExtensions));
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size(), "Expected 1 tutorial but got: " + response.getBody());

        TutorialDTO tutorial1 = response.getBody().get(0);
        assertEquals("tutorial1", tutorial1.getName());
        assertNotNull(tutorial1.getVideoUrl());
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
        ResponseEntity<Resource> response = tutorialController.getFile("tutorial1", "mp4");

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(tutorialService).getFile(any(Path.class), eq("tutorial1"), eq("mp4"));
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