package com.example.habit_tracker.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

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
        return result.toString();
    }

    public List<String> extractHighlights(String reflectionText) {
        return List.of(
                "Completed a key task today",
                "Felt blocked at some point",
                "Excited about progress"
        );
    }
}

