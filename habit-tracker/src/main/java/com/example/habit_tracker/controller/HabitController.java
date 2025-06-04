package com.example.habit_tracker.controller;

import com.example.habit_tracker.model.Habit;
import com.example.habit_tracker.model.HabitWithCompletionsDto;
import com.example.habit_tracker.model.User;
import com.example.habit_tracker.repository.HabitRepository;
import com.example.habit_tracker.service.HabitService;
import com.example.habit_tracker.util.HabitAccessValidator;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/habits")
public class HabitController {

    private final HabitService habitService;

    @Autowired
    private HabitRepository habitRepository;

    @Autowired
    private HabitAccessValidator accessValidator;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "Habit Tracker Application is running!";
    }

    @GetMapping
    public List<Habit> getAllHabits() {
        User user = accessValidator.getCurrentUser();
        return habitRepository.findByUser(user);
    }

    @GetMapping("/HabitsWithCompletions")
    public ResponseEntity<List<HabitWithCompletionsDto>> getAllHabitsWithCompletions() {
        User user = accessValidator.getCurrentUser();
        List<HabitWithCompletionsDto> result = habitService.getHabitsWithCompletionsByUser(user);
        return ResponseEntity.ok(result);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Habit> getHabitById(@PathVariable Long id) {
        Habit habit = accessValidator.getHabitIfOwnedByCurrentUser(id);
        return ResponseEntity.ok(habit);
    }

    @PostMapping
    public Habit createHabit(@Valid @RequestBody Habit habit) {
        habit.setUser(accessValidator.getCurrentUser());
        return habitService.createHabit(habit);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Habit> updateHabit(@PathVariable Long id, @Valid @RequestBody Habit habit) {
        Habit existingHabit = accessValidator.getHabitIfOwnedByCurrentUser(id);
        habit.setUser(existingHabit.getUser()); // preserve user
        Habit updated = habitService.updateHabit(id, habit);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(@PathVariable Long id) {
        accessValidator.getHabitIfOwnedByCurrentUser(id); // just validates ownership
        habitService.deleteHabit(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Map<String, String>> toggleHabitCompletion(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        accessValidator.getHabitIfOwnedByCurrentUser(id);
        LocalDate date = LocalDate.parse(body.get("date"));
        habitService.markHabitCompleted(id, date);
        return ResponseEntity.ok(Map.of("message", "Habit toggled for " + date));
    }

    @GetMapping("/{id}/completions")
    public ResponseEntity<List<LocalDate>> getCompletionDates(@PathVariable Long id) {
        accessValidator.getHabitIfOwnedByCurrentUser(id);
        List<LocalDate> completions = habitService.getCompletionDates(id);
        return ResponseEntity.ok(completions);
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<Map<String, Object>> getHabitAnalytics(@PathVariable Long id) {
        accessValidator.getHabitIfOwnedByCurrentUser(id);
        Map<String, Object> stats = habitService.getHabitAnalytics(id);
        return ResponseEntity.ok(stats);
    }
}
