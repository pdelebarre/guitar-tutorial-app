package com.guitar.tutorial.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;


@Service
public class TutorialService {
    private static final Logger logger = LoggerFactory.getLogger(TutorialService.class);

    public List<String> listTutorials(Path tutorialsPath, List<String> supportedExtensions) throws IOException {
        if (!Files.exists(tutorialsPath) || !Files.isDirectory(tutorialsPath)) {
            logger.error("Tutorials directory does not exist or is not a directory: {}", tutorialsPath);
            throw new FileNotFoundException("Tutorials directory not found");
        }

        return Files.list(tutorialsPath)
                .filter(Files::isRegularFile)
                .filter(file -> hasSupportedExtension(file.getFileName().toString(), supportedExtensions))
                .map(file -> file.getFileName().toString().replaceAll("\\.(mp4|pdf|srt)$", ""))
                .distinct()
                .collect(Collectors.toList());
    }

    public Resource getFile(Path tutorialsPath, String fileName, String extension) throws IOException {
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

    public boolean hasSupportedExtension(String fileName, List<String> supportedExtensions) {
        return supportedExtensions.stream().anyMatch(fileName::endsWith);
    }
}