package com.example.habit_tracker.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ReflectionInsightsService {

    public String analyze(String text) {
        // Dummy output for now
        Map<String, Object> result = Map.of(
                "completedActivities", List.of("gym", "reading"),
                "completedHabits", List.of("exercise", "meditation"),
                "blockers", List.of("tiredness"),
                "sentiment", "positive",
                "tone", "calm",
                "timeWasters", List.of("instagram")
        );
        try {
            return new ObjectMapper().writeValueAsString(result);
        } catch (Exception e) {
            throw new RuntimeException("Error converting to JSON", e);
        }
    }

    public List<String> extractHighlights(String reflectionText) {
        //its not compulsory to have highlights everyday - just if user says something big/important like I want to achieve this... etc
        return List.of(
                "Completed a key task today",
                "Felt blocked at some point",
                "Excited about progress"
        );
    }
}

