package com.guitar.tutorial.repository;

import com.guitar.tutorial.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<Group, Long> {
    // Additional query methods if needed
}