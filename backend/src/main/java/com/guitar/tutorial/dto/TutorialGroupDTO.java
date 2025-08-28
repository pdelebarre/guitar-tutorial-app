package com.guitar.tutorial.dto;

import java.util.List;

public class TutorialGroupDTO {
    private Long groupId;
    private String groupName;
    private List<TutorialDTO> tutorials;

    // Getters and setters
    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }
    public List<TutorialDTO> getTutorials() { return tutorials; }
    public void setTutorials(List<TutorialDTO> tutorials) { this.tutorials = tutorials; }
}