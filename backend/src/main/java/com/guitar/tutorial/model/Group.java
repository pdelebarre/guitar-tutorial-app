package com.guitar.tutorial.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // If you want to support multi-user, add a userId or User reference
    // private Long userId;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tutorial> tutorials;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<Tutorial> getTutorials() { return tutorials; }
    public void setTutorials(List<Tutorial> tutorials) { this.tutorials = tutorials; }
}