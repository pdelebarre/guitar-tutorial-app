package com.guitar.tutorial.service;

import com.guitar.tutorial.model.PDFAnnotation;
import com.guitar.tutorial.repository.PDFAnnotationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PDFAnnotationService {

    @Autowired
    private PDFAnnotationRepository pdfAnnotationRepository;

    public List<PDFAnnotation> getAnnotationsByTutorial(Long tutorialId) {
        return pdfAnnotationRepository.findByTutorialId(tutorialId);
    }

    public PDFAnnotation addAnnotation(PDFAnnotation annotation) {
        return pdfAnnotationRepository.save(annotation);
    }

    public void deleteAnnotation(Long id) {
        pdfAnnotationRepository.deleteById(id);
    }
}
