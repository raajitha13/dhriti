package com.example.habit_tracker.util;

import com.example.habit_tracker.exception.AccessDeniedException;
import com.example.habit_tracker.exception.ResourceNotFoundException;
import com.example.habit_tracker.model.Habit;
import com.example.habit_tracker.model.User;
import com.example.habit_tracker.repository.HabitRepository;
import com.example.habit_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class HabitAccessValidator {

    @Autowired
    private HabitRepository habitRepository;

    @Autowired
    private UserRepository userRepository;

    public Habit getHabitIfOwnedByCurrentUser(Long habitId) {
        Habit habit = habitRepository.findById(habitId)
            .orElseThrow(() -> new ResourceNotFoundException("Habit not found"));

        String currentUsername = SecurityUtils.getCurrentUsername();
        if (!habit.getUser().getUsername().equals(currentUsername)) {
            throw new AccessDeniedException("Access denied: Habit does not belong to current user");
        }

        return habit;
    }

    public User getCurrentUser() {
        String username = SecurityUtils.getCurrentUsername();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
