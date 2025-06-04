package com.example.habit_tracker.model;

import java.time.LocalDate;
import java.util.List;

public class HabitWithCompletionsDto {
    private Long id;
    private String name;
    private int currentStreak;
    private int longestStreak;
    private int totalCompletedDays;
    private LocalDate lastCompletedDate;
    private List<LocalDate> completedDates;

    // Include userId if needed on frontend
    private Long userId;

    // Constructors, Getters, Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getCurrentStreak() {
        return currentStreak;
    }
    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }
    public int getLongestStreak() {
        return longestStreak;
    }
    public void setLongestStreak(int longestStreak) {
        this.longestStreak = longestStreak;
    }
    public int getTotalCompletedDays() {
        return totalCompletedDays;
    }
    public void setTotalCompletedDays(int totalCompletedDays) {
        this.totalCompletedDays = totalCompletedDays;
    }
    public LocalDate getLastCompletedDate() {
        return lastCompletedDate;
    }
    public void setLastCompletedDate(LocalDate lastCompletedDate) {
        this.lastCompletedDate = lastCompletedDate;
    }
    public List<LocalDate> getCompletedDates() {
        return completedDates;
    }
    public void setCompletedDates(List<LocalDate> completedDates) {
        this.completedDates = completedDates;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
}

