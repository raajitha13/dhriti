package com.example.habit_tracker.repository;

import com.example.habit_tracker.model.HabitCompletion;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface HabitCompletionRepository extends JpaRepository<HabitCompletion, Long> {
    //Spring Data JPA automatically generates the necessary SQL query based on the method name.
    boolean existsByHabitIdAndCompletionDate(Long habitId, LocalDate completionDate);

    //JPQL query
    //The @Param annotation is used to bind the habitId parameter to the query.
    //In JPQl - :habitId - named parameter, are defined using @Param annotation
    @Query("SELECT hc.completionDate FROM HabitCompletion hc WHERE hc.habit.id = :habitId")
    List<LocalDate> findCompletionDatesByHabitId(@Param("habitId") Long habitId);

    //deleteByHabitIdAndCompletionDate(habitId, completedDate)
    //This method deletes HabitCompletion record for a specific habit and completion date.
    @Modifying
    @Transactional
    @Query("DELETE FROM HabitCompletion hc WHERE hc.habit.id = :habitId AND hc.completionDate = :completionDate")
    void deleteByHabitIdAndCompletionDate(@Param("habitId") Long habitId, LocalDate completionDate);

    @Modifying
    @Transactional
    @Query("DELETE FROM HabitCompletion hc WHERE hc.habit.id = :habitId")
    void deleteByHabitId(@Param("habitId") Long habitId);

}

