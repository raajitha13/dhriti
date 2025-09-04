package com.example.habit_tracker.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.habit_tracker.dto.ReflectionResponse;
import com.example.habit_tracker.exception.AlreadyExistsException;
import com.example.habit_tracker.model.Reflection;
import com.example.habit_tracker.model.ReflectionInsights;
import com.example.habit_tracker.model.User;
import com.example.habit_tracker.service.ReflectionService;
import com.example.habit_tracker.util.HabitAccessValidator;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/reflections")
public class ReflectionController {

    private final ReflectionService reflectionService;

    @Autowired
    private HabitAccessValidator accessValidator;


    public ReflectionController(ReflectionService reflectionService) {
        this.reflectionService = reflectionService;
    }

    @GetMapping("/today")
    public ResponseEntity<ReflectionResponse> getTodayReflection() {
        User user = accessValidator.getCurrentUser();
        Reflection reflection = reflectionService.getReflectionByUserAndDate(user, LocalDate.now());

        if (reflection == null) return ResponseEntity.noContent().build();

        ReflectionInsights insights = reflectionService.getInsightsForReflection(reflection);

        ReflectionResponse response = new ReflectionResponse(
                reflection.getId(),
                reflection.getDate(),
                insights != null ? insights.getHighlights() : null,
                insights != null ? insights.getAnalysis() : null,
                reflection.getCreatedAt()
        );

        return ResponseEntity.ok(response);
    }

    
    @GetMapping
    public List<ReflectionResponse> getUserReflections() {
        User user = accessValidator.getCurrentUser();
        List<Reflection> reflections = reflectionService.getReflectionsForUser(user);

        return reflections.stream()
                .map(reflection -> {
                    ReflectionInsights insights = reflectionService.getInsightsForReflection(reflection);
                    return new ReflectionResponse(
                        reflection.getId(),
                        reflection.getDate(),
                        insights != null ? insights.getHighlights() : null,
                        insights != null ? insights.getAnalysis() : null,
                        reflection.getCreatedAt()
                    );
                })
                .toList();
    }


    @PostMapping
    public ResponseEntity<ReflectionResponse> createReflection(
            @RequestBody String inputText,
            @RequestParam(defaultValue = "false") boolean overwrite) {

        User user = accessValidator.getCurrentUser();

        Reflection existing = reflectionService.getReflectionByUserAndDate(user, LocalDate.now());

        if (existing != null && !overwrite) {
            throw new AlreadyExistsException("Reflection exists for this date");
        }

        Reflection reflection = (existing != null)
                ? reflectionService.updateReflection(existing, inputText)
                : reflectionService.createReflection(user, inputText);

        ReflectionInsights insights = reflectionService.getInsightsForReflection(reflection);

        ReflectionResponse response = new ReflectionResponse(
                reflection.getId(),
                reflection.getDate(),
                insights != null ? insights.getHighlights() : null,
                insights != null ? insights.getAnalysis() : null,
                reflection.getCreatedAt()
        );

        return ResponseEntity.ok(response);
    }


    @GetMapping("/range")
    public List<ReflectionResponse> getReflectionsInRange(
            @RequestParam LocalDate from,
            @RequestParam LocalDate to) {

        User user = accessValidator.getCurrentUser();
        List<Reflection> reflections = reflectionService.getReflectionsForUserAndRange(user, from, to);

        return reflections.stream()
                .map(reflection -> {
                    ReflectionInsights insights = reflectionService.getInsightsForReflection(reflection);
                    return new ReflectionResponse(
                            reflection.getId(),
                            reflection.getDate(),
                            insights != null ? insights.getHighlights() : null,
                            insights != null ? insights.getAnalysis() : null,
                            reflection.getCreatedAt()
                    );
                })
                .toList();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editReflection(
            @PathVariable Long id,
            @RequestBody String inputText) {

        try {
            Reflection reflection = reflectionService.getReflectionById(id);
            if (reflection == null) {
                return ResponseEntity.notFound().build();
            }

            reflection = reflectionService.updateReflection(reflection, inputText);
            ReflectionInsights insights = reflectionService.getInsightsForReflection(reflection);

            ReflectionResponse response = new ReflectionResponse(
                reflection.getId(),
                reflection.getDate(),
                insights != null ? insights.getHighlights() : null,
                insights != null ? insights.getAnalysis() : null,
                reflection.getCreatedAt()
            );

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(403).body(
                Map.of("error", ex.getMessage())
            );
        }
    }


}
