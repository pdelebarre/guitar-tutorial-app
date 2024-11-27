package com.guitar.tutorial.dto;

public class TutorialDTO {
    private String name;
    private String type;
    private long size;
    private long duration; // Duration in seconds

    public TutorialDTO(String name, String type, long size, long duration) {
        this.name = name;
        this.type = type;
        this.size = size;
        this.duration = duration;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public long getDuration() {
        return duration;
    }

    public void setDuration(long duration) {
        this.duration = duration;
    }
}