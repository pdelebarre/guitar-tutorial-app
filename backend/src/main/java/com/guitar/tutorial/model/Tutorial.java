package com.guitar.tutorial.model;

import jakarta.persistence.*;

@Entity
public class Tutorial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String videoUrl;
    private String pdfUrl;
    private Integer rank;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }
    public Integer getRank() { return rank; }
    public void setRank(Integer rank) { this.rank = rank; }
    public Group getGroup() { return group; }
    public void setGroup(Group group) { this.group = group; }
}package com.guitar.tutorial.model;

import lombok.Data;

@Data
public class Tutorial {
    private String videoFileName;
    private String subtitleFileName; // Optional subtitle file (SRT)
    private String tablatureFileName; // Optional PDF tablature
}
