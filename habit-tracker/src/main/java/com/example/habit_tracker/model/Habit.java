package com.example.habit_tracker.model;

import java.time.LocalDate;

//jakarta.* packages, designed to replace javax.*, are updated versions of Java EE APIs
//These annotations are part of the Java Persistence API (JPA), 
//which is a specification for managing relational data in Java applications.

//jakarta supports more advanced database features like stored procedures, batch updates, and 
//native queries than java persistence API.
//Changing the Java Persistence API would have required a significant amount of work to ensure 
//that existing applications and libraries would continue to work without any issues. 
//This would have required a lot of time, resources, and testing to ensure that the changes did 
//not introduce any regressions or compatibility issues.
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "habits")
public class Habit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Habit name cannot be empty")
    @Size(max = 50, message = "Habit name must be under 50 characters")
    private String name;
    private int currentStreak;
    private int longestStreak;
    private int totalCompletedDays;
    private LocalDate lastCompletedDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and Setters

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

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
}
