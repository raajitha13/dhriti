package com.example.habit_tracker.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.habit_tracker.model.Reflection;
import com.example.habit_tracker.model.User;

import jakarta.transaction.Transactional;

@Repository
public interface ReflectionRepository extends JpaRepository<Reflection, Long> {
    Reflection findReflectionById(Long id);

    List<Reflection> findByUser(User user);

    Reflection findReflectionByUserAndDate(User user, LocalDate date);

    List<Reflection> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate start, LocalDate end);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("UPDATE Reflection r SET r.inputText = NULL WHERE r.createdAt < :cutoffDate")
    void clearOldReflectionInput(@Param("cutoffDate") LocalDateTime cutoffDate);

}
