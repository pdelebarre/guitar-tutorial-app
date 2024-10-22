package com.guitar.tutorial.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;


@Data
@Entity
@Table(name = "annotations")
public class PDFAnnotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long tutorialId; // Assuming tablatureUrl corresponds to tutorialId

    private String contentText;
    private String contentImage;
    private String position;
    private String commentText;
    private String commentEmoji;
}
