package com.guitar.tutorial.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.guitar.tutorial.model.PDFAnnotation;
import com.guitar.tutorial.service.PDFAnnotationService;

@RestController
@RequestMapping("/api/annotations")
public class PDFAnnotationController {

    @Autowired
    private PDFAnnotationService pdfAnnotationService;

    @GetMapping("/tutorial/{tutorialId}")
    public List<PDFAnnotation> getAnnotations(@PathVariable Long tutorialId) {
        return pdfAnnotationService.getAnnotationsByTutorial(tutorialId);
    }

    @PostMapping("/")
    public PDFAnnotation addAnnotation(@RequestBody PDFAnnotation annotation) {
        return pdfAnnotationService.addAnnotation(annotation);
    }

    @DeleteMapping("/{id}")
    public void deleteAnnotation(@PathVariable Long id) {
        pdfAnnotationService.deleteAnnotation(id);
    }
}
