package com.guitar.tutorial.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tutorials")
public class TutorialController {
    private static final Logger logger = LoggerFactory.getLogger(TutorialController.class);

    @Value("${tutorials.path}")
    private String tutorialsDirectory; // Injected path from application.yml or .env

    @GetMapping("/test")
    @CrossOrigin
    public String testEndpoint() {
        logger.info("Test endpoint called"); // Debug log
        return tutorialsDirectory;
    }

    // Serve specific files (video, pdf, srt) based on file name and extension
    @GetMapping("/{fileName}/{extension}")
    @CrossOrigin
    public ResponseEntity<Resource> getFile(@PathVariable String fileName, @PathVariable String extension) {
        try {
            // Create the file path using the injected tutorialsDirectory and file name
            Path filePath = Paths.get(tutorialsDirectory).resolve(fileName + "." + extension);
            logger.info("Fetching file from path: {}", filePath.toString()); // Replaced System.out with logger

            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"");
                logger.info("File found and is readable: {}", resource.getFilename());
                return new ResponseEntity<>(resource, headers, HttpStatus.OK);
            } else {
                logger.warn("File not found or is not readable: {}", filePath.toString());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            logger.error("Error occurred while fetching the file: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // List all available tutorial file names (without extensions)
    @GetMapping("/")
    @CrossOrigin
    public ResponseEntity<?> listTutorials() {
        try {
            Path tutorialsPath = Paths.get(tutorialsDirectory);
            logger.info("Listing tutorials in directory: {}", tutorialsPath.toString());

            return ResponseEntity.ok(
                    Files.list(tutorialsPath)
                            .filter(Files::isRegularFile)
                            .map(file -> file.getFileName().toString().replaceAll("\\.(mp4|pdf|srt)$", ""))
                            .distinct()
                            .collect(Collectors.toList()));
        } catch (Exception e) {
            logger.error("Error occurred while listing tutorial files: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
