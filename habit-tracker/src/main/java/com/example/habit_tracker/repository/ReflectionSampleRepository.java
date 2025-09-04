package com.example.habit_tracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.habit_tracker.model.ReflectionSample;

public interface ReflectionSampleRepository extends JpaRepository<ReflectionSample, Long> {
    List<ReflectionSample> findAll();
}
