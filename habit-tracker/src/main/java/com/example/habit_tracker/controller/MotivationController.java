package com.example.habit_tracker.controller;

import com.example.habit_tracker.util.HabitAccessValidator;
import com.example.habit_tracker.service.MotivationService;
import com.example.habit_tracker.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/motivation")
@CrossOrigin(origins = "http://localhost:4200")
public class MotivationController {

    @Autowired
    private MotivationService motivationService;

    @Autowired
    private HabitAccessValidator accessValidator;

    @GetMapping("/summary")
    public ResponseEntity<?> getMotivationSummary() {
        try {
            User user = accessValidator.getCurrentUser();
            String summary = motivationService.generateSummary(user);
            return ResponseEntity.ok(Map.of("weekly_summary", summary));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Could not fetch AI summary."));
        }
    }

    @GetMapping("/quote")
    public ResponseEntity<?> getMotivationalQuote() {
        try {
            User user = accessValidator.getCurrentUser();
            String quote = motivationService.getQuote(user);
            return ResponseEntity.ok(Map.of("motivational_quote", quote));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("motivational_quote", "Still water, steady bloom. Still effort, steady you."));
        }
    }
}
