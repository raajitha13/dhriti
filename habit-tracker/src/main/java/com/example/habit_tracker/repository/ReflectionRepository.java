package com.example.habit_tracker.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.habit_tracker.model.Reflection;
import com.example.habit_tracker.model.User;

@Repository
public interface ReflectionRepository extends JpaRepository<Reflection, Long> {
    Reflection findReflectionById(Long id);

    List<Reflection> findByUser(User user);

    Reflection findReflectionByUserAndDate(User user, LocalDate date);

    List<Reflection> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate start, LocalDate end);
}
