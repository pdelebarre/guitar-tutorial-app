package com.guitar.tutorial.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.apache.tika.Tika;
import org.apache.tika.metadata.Metadata;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;


@Service
public class TutorialService {
    private static final Logger logger = LoggerFactory.getLogger(TutorialService.class);

    public List<TutorialGroup> listTutorials(Path tutorialsPath, List<String> supportedExtensions) throws IOException {
        if (!Files.exists(tutorialsPath) || !Files.isDirectory(tutorialsPath)) {
            logger.error("Tutorials directory does not exist or is not a directory: {}", tutorialsPath);
            throw new FileNotFoundException("Tutorials directory not found");
        }

        Map<String, TutorialGroup> tutorialGroups = new HashMap<>();

        try (var filesStream = Files.list(tutorialsPath)) {
            filesStream.filter(Files::isRegularFile)
                    .forEach(file -> {
                        String fileName = file.getFileName().toString();
                        String baseName = fileName.substring(0, fileName.lastIndexOf('.'));
                        String extension = fileName.substring(fileName.lastIndexOf('.') + 1);

                        if (supportedExtensions.contains(extension)) {
                            TutorialGroup tutorialGroup = tutorialGroups.computeIfAbsent(baseName, TutorialGroup::new);
                            tutorialGroup.addFile(file, extension);
                        }
                    });
        }

        return new ArrayList<>(tutorialGroups.values());
    }

    public Resource getFile(Path tutorialsPath, String fileName, String extension) throws IOException {
        if (fileName.contains("..") || fileName.contains("/") || fileName.contains("\\")) {
            throw new IllegalArgumentException("Invalid file name");
        }
        if (extension.contains("..") || extension.contains("/") || extension.contains("\\")) {
            throw new IllegalArgumentException("Invalid file extension");
        }
        Path filePath = tutorialsPath.resolve(fileName + "." + extension).normalize();
        logger.info("Fetching file: {}", filePath);

        Resource resource = new UrlResource(filePath.toUri());
        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            logger.warn("File not found or not readable: {}", filePath);
            throw new FileNotFoundException("File not found");
        }
    }

    public long getVideoDuration(File file) {
        Tika tika = new Tika();
        Metadata metadata = new Metadata();

        try (FileInputStream inputStream = new FileInputStream(file)) {
            tika.parse(inputStream, metadata);

            // Log all metadata keys
            for (String name : metadata.names()) {
                logger.debug("Metadata key: {}, value: {}", name, metadata.get(name));
            }

            String duration = metadata.get("xmpDM:duration"); // Duration in milliseconds
            if (duration == null) {
                duration = metadata.get("Duration"); // Try another key
            }
            if (duration == null) {
                duration = metadata.get("mpeg.header.duration"); // Try another key
            }

            if (duration != null) {
                try {
                    // Handle different duration formats
                    if (duration.contains(":")) {
                        // If duration is in hh:mm:ss format
                        String[] parts = duration.split(":");
                        long hours = Long.parseLong(parts[0]);
                        long minutes = Long.parseLong(parts[1]);
                        double seconds = Double.parseDouble(parts[2]);
                        return hours * 3600 + minutes * 60 + (long) seconds;
                    } else {
                        // If duration is in seconds with decimal
                        return (long) Double.parseDouble(duration); // Convert to seconds
                    }
                } catch (NumberFormatException e) {
                    logger.error("Error parsing duration: {}", duration, e);
                }
            }
        } catch (Exception e) {
            // Log error and return 0 for missing duration
            logger.error("Error parsing video file for duration", e);
        }

        return 0;
    }

    public boolean hasSupportedExtension(String fileName, List<String> supportedExtensions) {
        return supportedExtensions.stream().anyMatch(fileName::endsWith);
    }

    public static class TutorialGroup {
        private String baseName;
        private Path videoPath;
        private Path subtitlePath;
        private Path tablaturePath;

        public TutorialGroup(String baseName) {
            this.baseName = baseName;
        }

        public void addFile(Path file, String extension) {
            switch (extension) {
                case "mp4":
                    this.videoPath = file;
                    break;
                case "srt":
                    this.subtitlePath = file;
                    break;
                case "pdf":
                    this.tablaturePath = file;
                    break;
            }
        }

        public String getBaseName() {
            return baseName;
        }

        public Path getVideoPath() {
            return videoPath;
        }

        public Path getSubtitlePath() {
            return subtitlePath;
        }

        public Path getTablaturePath() {
            return tablaturePath;
        }
    }
}