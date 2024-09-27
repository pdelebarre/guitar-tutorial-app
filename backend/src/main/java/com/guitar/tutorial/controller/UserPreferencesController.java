package com.guitar.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.guitar.tutorial.model.UserPreferences;
import com.guitar.tutorial.service.UserPreferencesService;

@RestController
@RequestMapping("/api/preferences")
public class UserPreferencesController {

    @Autowired
    private UserPreferencesService userPreferencesService;

    @GetMapping("/{username}")
    public UserPreferences getPreferences(@PathVariable String username) {
        return userPreferencesService.getPreferences(username);
    }

    @PostMapping("/")
    public UserPreferences savePreferences(@RequestBody UserPreferences preferences) {
        return userPreferencesService.savePreferences(preferences);
    }
}
