package com.guitar.tutorial.repository;

import com.guitar.tutorial.model.PDFAnnotation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PDFAnnotationRepository extends JpaRepository<PDFAnnotation, Long> {
    List<PDFAnnotation> findByTutorialId(Long tutorialId);
}
