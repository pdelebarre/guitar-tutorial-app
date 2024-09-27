package com.guitar.tutorial.model;

import lombok.Data;

@Data
public class Tutorial {
    private String videoFileName;
    private String subtitleFileName; // Optional subtitle file (SRT)
    private String tablatureFileName; // Optional PDF tablature
}
