package com.guitar.tutorial.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class UserPreferences {

    @Id
    private String username;
    private String theme;
    private String level;
    private boolean darkMode;
}
