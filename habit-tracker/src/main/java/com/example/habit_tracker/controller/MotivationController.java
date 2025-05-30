package com.example.habit_tracker.controller;

import com.example.habit_tracker.util.HabitAccessValidator;
import com.example.habit_tracker.service.MotivationService;
import com.example.habit_tracker.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/motivation")
@CrossOrigin(origins = "http://localhost:4200")
public class MotivationController {

    @Autowired
    private MotivationService motivationService;

    @Autowired
    private HabitAccessValidator accessValidator;

    @GetMapping
    public ResponseEntity<?> getMotivationSummary() {
        User user = accessValidator.getCurrentUser();

        try {
            String summary = motivationService.generateMotivationSummary(user);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"Could not fetch AI summary.\"}");
        }
    }
}
