package com.guitar.tutorial.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.guitar.tutorial.model.UserPreferences;

@Repository
public interface UserPreferencesRepository extends JpaRepository<UserPreferences, String> {
    // You can add custom queries here if needed
}
