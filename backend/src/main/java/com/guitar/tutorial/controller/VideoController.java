package com.guitar.tutorial.controller;



import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.guitar.tutorial.service.VideoStreamingService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    @Autowired
    private VideoStreamingService videoStreamingService;

    // External tutorials directory injected from application.properties or
    // environment variable
    @Value("${tutorials.path}")
    private String tutorialsDirectory;

    // Endpoint to stream video files for a specific video (based on song ID)
    @GetMapping("/{song}/stream")
    public ResponseEntity<Resource> streamVideo(@PathVariable String song, HttpServletRequest request) throws IOException {
        // Call the VideoStreamingService to handle the video streaming logic
        return videoStreamingService.streamVideo(song, request, tutorialsDirectory);
    }
}
