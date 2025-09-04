package com.example.habit_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.habit_tracker.model.Reflection;
import com.example.habit_tracker.model.ReflectionInsights;

@Repository
public interface ReflectionInsightsRepository extends JpaRepository<ReflectionInsights, Long> {
    ReflectionInsights findInsightByReflection(Reflection reflection);

    void deleteByReflection(Reflection reflection);
}
