package com.guitar.tutorial.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.guitar.tutorial.dto.TutorialDTO;
import com.guitar.tutorial.service.TutorialService;
import com.guitar.tutorial.service.TutorialService.TutorialGroup;

@RestController
@RequestMapping("/api/tutorials")
@Tag(name = "Tutorials API", description = "API to manage and retrieve guitar tutorial files.")
public class TutorialController {

    private static final Logger logger = LoggerFactory.getLogger(TutorialController.class);

    @Value("${tutorials.path}")
    private String tutorialsDirectory;

    @Value("${tutorials.supported-extensions:mp4,pdf,srt}")
    private List<String> supportedExtensions;

    private final TutorialService tutorialService;

    public TutorialController(TutorialService tutorialService) {
        this.tutorialService = tutorialService;
    }

    @Operation(summary = "List Available Tutorials")
    @CrossOrigin
    @GetMapping({"", "/"})
    public ResponseEntity<List<TutorialDTO>> listTutorials() {
        logger.info("Tutorials directory: {}", tutorialsDirectory);
        try {
            Path tutorialsPath = Paths.get(tutorialsDirectory).normalize();
            List<TutorialGroup> tutorialGroups = tutorialService.listTutorials(tutorialsPath, supportedExtensions);

            List<TutorialDTO> tutorialDTOs = tutorialGroups.stream()
                    .map(group -> {
                        String baseName = group.getBaseName();
                        String videoUrl = group.getVideoPath() != null ? "/api/tutorials/" + baseName + "/mp4" : null;
                        String subtitleUrl = group.getSubtitlePath() != null ? "/api/tutorials/" + baseName + "/srt" : null;
                        String tablatureUrl = group.getTablaturePath() != null ? "/api/tutorials/" + baseName + "/pdf" : null;
                        long size = 0;
                        long duration = 0;
                        if (group.getVideoPath() != null) {
                            try {
                                size = group.getVideoPath().toFile().length();
                                duration = tutorialService.getVideoDuration(group.getVideoPath().toFile());
                            } catch (Exception e) {
                                logger.warn("Could not determine duration for video {}: {}", group.getVideoPath().getFileName(), e.getMessage());
                            }
                        }
                        return new TutorialDTO(baseName, videoUrl, subtitleUrl, tablatureUrl, size, duration);
                    })
                    .toList();

            return ResponseEntity.ok(tutorialDTOs);
        } catch (IOException e) {
            logger.error("Error listing tutorials: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Fetch Tutorial File")
    @GetMapping("/{fileName}/{extension}")
    @CrossOrigin
    public ResponseEntity<Resource> getFile(@PathVariable String fileName, @PathVariable String extension) {
        try {
            Path tutorialsPath = Paths.get(tutorialsDirectory).normalize();
            Resource resource = tutorialService.getFile(tutorialsPath, fileName, extension);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"");
            return new ResponseEntity<>(resource, headers, HttpStatus.OK);
        } catch (FileNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IOException e) {
            logger.error("Error fetching file: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}