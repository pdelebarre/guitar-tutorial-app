package com.guitar.tutorial.service;


import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class VideoStreamingService {

    // Define the buffer size for video chunk reading
    private static final int BUFFER_SIZE = 1024 * 16; // 16KB chunks

    // Method to stream video files by song ID with range request support
    public ResponseEntity<Resource> streamVideo(String song, HttpServletRequest request, String tutorialsDirectory)
            throws IOException {
        // Locate the video file for the given song ID in the external tutorials
        // directory
        Path videoPath = Paths.get(tutorialsDirectory).resolve(song+".mp4");

        // Check if the file exists
        if (!Files.exists(videoPath)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Create a Resource object pointing to the video file
        Resource videoResource = new UrlResource(videoPath.toUri());

        // Get the media type based on the file resource
        MediaType mediaType = MediaTypeFactory.getMediaType(videoResource)
                .orElse(MediaType.APPLICATION_OCTET_STREAM);

        // Get the Range header from the request
        String rangeHeader = request.getHeader(HttpHeaders.RANGE);
        long fileSize = Files.size(videoPath);

        // If no range is provided, stream the whole video
        if (rangeHeader == null) {
            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .contentLength(fileSize)
                    .body(videoResource);
        }

        // Parse the range header (e.g., "bytes=0-1023")
        long[] range = parseRange(rangeHeader, fileSize);
        long start = range[0];
        long end = range[1];
        long contentLength = end - start + 1;

        // Create the Content-Range header
        String contentRange = "bytes " + start + "-" + end + "/" + fileSize;

        // Return the requested byte range (206 Partial Content)
        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_RANGE, contentRange)
                .contentLength(contentLength)
                .body(new ByteRangeResource(videoPath, start, end));
    }

    // Parse the range header and return the start and end bytes
    private long[] parseRange(String rangeHeader, long fileSize) {
        String[] ranges = rangeHeader.replace("bytes=", "").split("-");
        long start = Long.parseLong(ranges[0]);
        long end = (ranges.length > 1 && !ranges[1].isEmpty()) ? Long.parseLong(ranges[1]) : fileSize - 1;

        // Handle invalid or out-of-range values
        if (start > end || start >= fileSize || end >= fileSize) {
            throw new IllegalArgumentException("Invalid byte range");
        }

        return new long[] { start, end };
    }

    // Inner class to handle byte-range requests for video files
    private class ByteRangeResource extends InputStreamResource {
        private final long start;
        private final long end;

        public ByteRangeResource(Path filePath, long start, long end) throws IOException {
            super(Files.newInputStream(filePath));
            this.start = start;
            this.end = end;
        }

        @Override
        public long contentLength() throws IOException {
            return end - start + 1;
        }

        @Override
        public InputStream getInputStream() throws IOException {
            InputStream inputStream = super.getInputStream();
            inputStream.skip(start); // Skip to the start byte
            return inputStream;
        }
    }
}
