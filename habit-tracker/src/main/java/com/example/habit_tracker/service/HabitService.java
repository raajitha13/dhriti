package com.example.habit_tracker.service;

import com.example.habit_tracker.model.Habit;
import com.example.habit_tracker.model.HabitCompletion;
import com.example.habit_tracker.repository.HabitCompletionRepository;
import com.example.habit_tracker.repository.HabitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class HabitService {

    //constructor injection
    private final HabitRepository habitRepository;
    private final HabitCompletionRepository habitCompletionRepository;

    public HabitService(HabitRepository habitRepository, HabitCompletionRepository habitCompletionRepository) {
        this.habitRepository = habitRepository;
        this.habitCompletionRepository = habitCompletionRepository;
    }

    // Get all habits
    public List<Habit> getAllHabits() {
        return habitRepository.findAll();
    }

    // Get habit by ID
    //returns an Optional<Habit>. The orElseThrow method is called on the Optional. 
    //If the Optional is empty (i.e., the habit was not found), it throws a RuntimeException
    //If Optional contains habit object, orElseThrow method returns habit object.
    //msg printed to console
    public Habit getHabitById(Long id) {
        return habitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Habit not found"));
    }

    // Create a new habit
    public Habit createHabit(Habit habit) {

        boolean exists = habitRepository.existsByNameAndUserId(habit.getName(), habit.getUser().getId());
        if (exists) {
            throw new IllegalArgumentException("Habit with name '" + habit.getName() + "' already exists.");
        }

        habit.setCurrentStreak(0);
        habit.setLongestStreak(0);
        habit.setTotalCompletedDays(0);
        habit.setLastCompletedDate(null);
        return habitRepository.save(habit);
    }

    // Update an existing habit
    public Habit updateHabit(Long id, Habit updatedHabit) {
        Habit habit = getHabitById(id);
        habit.setName(updatedHabit.getName());
        return habitRepository.save(habit);
    }

    // Delete a habit
    public void deleteHabit(Long habitId) {
        habitCompletionRepository.deleteByHabitId(habitId); 
        habitRepository.deleteById(habitId);
    }

    @Transactional
    public void markHabitCompleted(Long habitId, LocalDate completedDate) {
        Habit habit = getHabitById(habitId);

        // Check if the habit has already been marked as completed for this date
        boolean alreadyCompleted = habitCompletionRepository.existsByHabitIdAndCompletionDate(habitId, completedDate);

        // If habit is not completed for this date, mark it as completed
        if (!alreadyCompleted) {
            // Save the completion record
            HabitCompletion habitCompletion = new HabitCompletion(habit, completedDate);
            habitCompletionRepository.save(habitCompletion);

            // Update habit properties
            updateHabitStreaksAndStats(habit, completedDate, true);
        } else {
            // If already completed for this date, remove the completion record
            habitCompletionRepository.deleteByHabitIdAndCompletionDate(habitId, completedDate);

            // Recalculate streaks and stats after deletion
            updateHabitStreaksAndStats(habit, completedDate, false);
        }

        // Save the updated habit
        habitRepository.save(habit);
    }

    // Helper method to update streaks, longest streak, total completed days, and last completed date
    private void updateHabitStreaksAndStats(Habit habit, LocalDate completedDate, boolean isCompletion) {
        List<LocalDate> completionDates = habitCompletionRepository.findCompletionDatesByHabitId(habit.getId());
        completionDates.sort(Comparator.naturalOrder()); // Sort dates in ascending order

        // Variables to store streak calculations
        int currentStreak = 0;
        int longestStreak = 0;
        int totalCompletedDays = 0;
        LocalDate lastCompletedDate = null;

        // Loop through the completion dates to calculate streaks
        for (int i = 0; i < completionDates.size(); i++) {
            totalCompletedDays++;

            if (i > 0 && completionDates.get(i).isEqual(completionDates.get(i - 1).plusDays(1))) {
                currentStreak++; // Increase streak if dates are consecutive
            } else {
                currentStreak = 1; // Reset streak if the dates are not consecutive
            }

            longestStreak = Math.max(longestStreak, currentStreak);
            lastCompletedDate = completionDates.get(i); // Keep updating the last completed date
        }

        // Update the habit object with the recalculated values
        habit.setCurrentStreak(currentStreak);
        habit.setLongestStreak(longestStreak);
        habit.setTotalCompletedDays(totalCompletedDays);
        habit.setLastCompletedDate(lastCompletedDate);
    }

    

    // Get all completion dates for a habit
    public List<LocalDate> getCompletionDates(Long habitId) {
        return habitCompletionRepository.findCompletionDatesByHabitId(habitId);
    }

    public Map<String, Object> getHabitAnalytics(Long habitId) {
        Habit habit = getHabitById(habitId);

        List<LocalDate> completions = habitCompletionRepository.findCompletionDatesByHabitId(habitId);
        completions.sort(Comparator.naturalOrder());

        // Weekly Completion Data
        Map<String, Long> weekly = completions.stream().collect(Collectors.groupingBy(
            date -> {
                WeekFields weekFields = WeekFields.of(Locale.getDefault());
                int weekNumber = date.get(weekFields.weekOfWeekBasedYear());
                return date.getYear() + "-W" + weekNumber;
            },
            Collectors.counting()
        ));

        // Monthly Completion Data
        Map<String, Long> monthly = completions.stream().collect(Collectors.groupingBy(
            date -> date.getYear() + "-" + String.format("%02d", date.getMonthValue()),
            Collectors.counting()
        ));

        Map<String, Object> stats = new HashMap<>();
        stats.put("currentStreak", habit.getCurrentStreak());
        stats.put("longestStreak", habit.getLongestStreak());
        stats.put("totalCompleted", completions.size());
        stats.put("weeklyData", weekly);
        stats.put("monthlyData", monthly);

        return stats;
    }


}
