package com.example.habit_tracker.repository;

//JpaRepository interface is provided by Spring Data JPA.
import com.example.habit_tracker.model.Habit;
import com.example.habit_tracker.model.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

//@Repository is used to mark this as a spring component(a class managed by the Spring Framework) that handles db operations.
@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {
    //this interface is designed to perform CRUD operations on Habit entity.
    //JpaRepository interface takes two type parameters: the entity type (Habit) and the type of its primary key (Long). 
    //This means that HabitRepository will provide methods for managing Habit entities with Long IDs.
    //For example,findAll(), findById(), save(), deleteById(), etc. are all provided by JpaRepository.
    List<Habit> findByUser(User user);

    boolean existsByNameAndUserId(String name, Long userId);



    @Query("SELECT SUM(h.currentStreak) FROM Habit h WHERE h.user = :user")
    Integer getTotalStreakByUser(@Param("user") User user);

    @Query("SELECT MAX(h.longestStreak) FROM Habit h WHERE h.user = :user")
    Integer getMaxLongestStreakByUser(@Param("user") User user);

    @Query("SELECT SUM(h.totalCompletedDays) FROM Habit h WHERE h.user = :user")
    Integer getTotalCompletionsByUser(@Param("user") User user);



}
