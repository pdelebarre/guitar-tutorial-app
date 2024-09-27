package com.guitar.tutorial.service;

import com.guitar.tutorial.model.UserPreferences;
import com.guitar.tutorial.repository.UserPreferencesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserPreferencesService {

    @Autowired
    private UserPreferencesRepository userPreferencesRepository;

    public UserPreferences getPreferences(String username) {
        return userPreferencesRepository.findById(username).orElse(new UserPreferences());
    }

    public UserPreferences savePreferences(UserPreferences preferences) {
        return userPreferencesRepository.save(preferences);
    }
}
