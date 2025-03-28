package com.guitar.tutorial.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TutorialDTO {
    private String name;
    private String videoUrl;
    private String subtitleUrl;
    private String tablatureUrl;
    private long size;
    private long duration; // Duration in seconds
}