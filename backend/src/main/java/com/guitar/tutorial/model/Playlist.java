package com.guitar.tutorial.model;

import lombok.Data;


import java.util.List;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Data
@Entity
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String username; // User who owns the playlist

    @ElementCollection
    private List<Long> tutorialIds; // IDs of tutorials in the playlist
}
