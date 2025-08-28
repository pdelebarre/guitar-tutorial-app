package com.guitar.tutorial.controller;

import com.guitar.tutorial.model.Tutorial;
import com.guitar.tutorial.service.TutorialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tutorials")
public class TutorialController {
    @Autowired
    private TutorialService tutorialService;

    @GetMapping
    public List<Tutorial> getAllTutorials(
            @RequestParam(required = false) Long groupId,
            @RequestParam(required = false, defaultValue = "title") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String direction
    ) {
        if (groupId != null) {
            return tutorialService.getTutorialsByGroupId(groupId);
        }
        return tutorialService.getTutorialsSorted(sortBy, direction);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tutorial> getTutorialById(@PathVariable Long id) {
        Optional<Tutorial> tutorial = tutorialService.getTutorialById(id);
        return tutorial.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Tutorial createTutorial(@RequestBody Tutorial tutorial) {
        return tutorialService.saveTutorial(tutorial);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tutorial> updateTutorial(@PathVariable Long id, @RequestBody Tutorial tutorial) {
        if (!tutorialService.getTutorialById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        tutorial.setId(id);
        return ResponseEntity.ok(tutorialService.saveTutorial(tutorial));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTutorial(@PathVariable Long id) {
        if (!tutorialService.getTutorialById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        tutorialService.deleteTutorial(id);
        return ResponseEntity.noContent().build();
    }
}package com.guitar.tutorial.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

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
    public ResponseEntity<List<TutorialDTO>> listTutorials(HttpServletRequest request) {
        logger.info("Tutorials directory: {}", tutorialsDirectory);
        try {
            Path tutorialsPath = Paths.get(tutorialsDirectory).normalize();
            List<TutorialGroup> tutorialGroups = tutorialService.listTutorials(tutorialsPath, supportedExtensions);

            List<TutorialDTO> tutorialDTOs = tutorialGroups.stream()
                    .map(group -> {
                        String baseName = group.getBaseName();
                        String baseUrl = request.getRequestURL().toString().replace(request.getRequestURI(), request.getContextPath());
                        String videoUrl = group.getVideoPath() != null ? baseUrl + "/api/tutorials/" + baseName + ".mp4" : null;
                        String subtitleUrl = group.getSubtitlePath() != null ? baseUrl + "/api/tutorials/" + baseName + ".srt" : null;
                        String tablatureUrl = group.getTablaturePath() != null ? baseUrl + "/api/tutorials/" + baseName + ".pdf" : null;
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
    @CrossOrigin
    @GetMapping("/{fileName}.{extension}")
    public ResponseEntity<StreamingResponseBody> getFile(@PathVariable String fileName, @PathVariable String extension, 
            @RequestHeader(value = "Range", required = false) String rangeHeader) {
        try {
            Path tutorialsPath = Paths.get(tutorialsDirectory).normalize();
            Path filePath = tutorialsPath.resolve(fileName + "." + extension).normalize();

            if (!Files.exists(filePath) || !Files.isRegularFile(filePath)) {
                logger.warn("File not found: {}", filePath);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            long fileSize = Files.size(filePath);
            long startByte = 0;
            long endByte = fileSize - 1;

            // Handle range header if present
            if (rangeHeader != null) {
                String[] ranges = rangeHeader.replace("bytes=", "").split("-");
                startByte = Long.parseLong(ranges[0]);
                if (ranges.length > 1) {
                    endByte = Long.parseLong(ranges[1]);
                }
            }

            final long start = startByte;
            final long length = endByte - startByte + 1;

            StreamingResponseBody responseBody = outputStream -> {
                try (InputStream inputStream = Files.newInputStream(filePath)) {
                    inputStream.skip(start);
                    byte[] buffer = new byte[4096];
                    long remaining = length;
                    int bytesRead;
                    
                    while (remaining > 0 && (bytesRead = inputStream.read(buffer, 0, (int)Math.min(buffer.length, remaining))) != -1) {
                        outputStream.write(buffer, 0, bytesRead);
                        remaining -= bytesRead;
                    }
                }
            };

            HttpHeaders headers = new HttpHeaders();
            // Set content type based on file extension
            switch (extension.toLowerCase()) {
                case "mp4":
                    headers.add(HttpHeaders.CONTENT_TYPE, "video/mp4");
                    break;
                case "pdf":
                    headers.add(HttpHeaders.CONTENT_TYPE, "application/pdf");
                    break;
                case "srt":
                    headers.add(HttpHeaders.CONTENT_TYPE, "text/plain");
                    break;
                default:
                    headers.add(HttpHeaders.CONTENT_TYPE, "application/octet-stream");
            }
            
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "." + extension + "\"");
            headers.add(HttpHeaders.ACCEPT_RANGES, "bytes");
            headers.add(HttpHeaders.CONTENT_RANGE, String.format("bytes %d-%d/%d", startByte, endByte, fileSize));
            headers.add(HttpHeaders.CONTENT_LENGTH, String.valueOf(length));

            HttpStatus status = (rangeHeader != null) ? HttpStatus.PARTIAL_CONTENT : HttpStatus.OK;
            return new ResponseEntity<>(responseBody, headers, status);

        } catch (Exception e) {
            logger.error("Error fetching file: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}