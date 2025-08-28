package com.guitar.tutorial.controller;

import com.guitar.tutorial.model.Group;
import com.guitar.tutorial.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/groups")
public class GroupController {
    @Autowired
    private GroupService groupService;

    @GetMapping
    public List<Group> getAllGroups() {
        return groupService.getAllGroups();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupById(@PathVariable Long id) {
        Optional<Group> group = groupService.getGroupById(id);
        return group.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Group createGroup(@RequestBody Group group) {
        return groupService.saveGroup(group);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Group> updateGroup(@PathVariable Long id, @RequestBody Group group) {
        if (!groupService.getGroupById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        group.setId(id);
        return ResponseEntity.ok(groupService.saveGroup(group));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        if (!groupService.getGroupById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        groupService.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }
}