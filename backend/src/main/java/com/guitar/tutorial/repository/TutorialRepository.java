package com.guitar.tutorial.repository;

import com.guitar.tutorial.model.Tutorial;
import com.guitar.tutorial.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TutorialRepository extends JpaRepository<Tutorial, Long> {
    List<Tutorial> findByGroup(Group group);

    // Filtering by group id
    List<Tutorial> findByGroupId(Long groupId);

    // Sorting by title
    List<Tutorial> findAllByOrderByTitleAsc();
    List<Tutorial> findAllByOrderByTitleDesc();

    // Sorting by rank
    List<Tutorial> findAllByOrderByRankAsc();
    List<Tutorial> findAllByOrderByRankDesc();

    // Custom query for flexible sorting
    @Query("SELECT t FROM Tutorial t WHERE (:groupId IS NULL OR t.group.id = :groupId)")
    List<Tutorial> filterByGroup(@Param("groupId") Long groupId);
}