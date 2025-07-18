package com.example.habit_tracker.service;

import com.example.habit_tracker.model.Habit;
import com.example.habit_tracker.model.HabitCompletion;
import com.example.habit_tracker.model.HabitWithCompletionsDto;
import com.example.habit_tracker.model.User;
import com.example.habit_tracker.repository.HabitCompletionRepository;
import com.example.habit_tracker.repository.HabitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.Collections;
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

        String currentName = habit.getName();
        String newName = updatedHabit.getName();
        Long userId = habit.getUser().getId();

        if (currentName.equalsIgnoreCase(newName)) {
            throw new IllegalArgumentException("Yo! The habit is already called '" + newName + "'. Nothing to update here. 😄");
        }

        boolean exists = habitRepository.existsByNameAndUserId(newName, userId);
        if (exists) {
            throw new IllegalArgumentException("Oops! You've already got a habit named '" + newName + "'. Try something cooler! 😅");
        }

        habit.setName(newName);
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

        if (completionDates.isEmpty()) {
            habit.setCurrentStreak(0);
            habit.setLongestStreak(0);
            habit.setTotalCompletedDays(0);
            habit.setLastCompletedDate(null);
            return;
        }

        // Sort dates in ascending order
        completionDates.sort(Comparator.naturalOrder());

        // === Longest Streak Calculation ===
        int longestStreak = 1;
        int tempStreak = 1;
        for (int i = 1; i < completionDates.size(); i++) {
            if (completionDates.get(i).equals(completionDates.get(i - 1).plusDays(1))) {
                tempStreak++;
            } else {
                tempStreak = 1;
            }
            longestStreak = Math.max(longestStreak, tempStreak);
        }

        // === Current Streak Calculation ===
        Collections.reverse(completionDates); // descending
        LocalDate streakCursor = LocalDate.now();
        int currentStreak = 0;
        for (LocalDate date : completionDates) {
            if (date.equals(streakCursor) || date.equals(streakCursor.minusDays(1))) {
                currentStreak++;
                streakCursor = date;
            } else {
                break;
            }
        }

        // === Set Habit Fields ===
        habit.setTotalCompletedDays(completionDates.size());
        habit.setLongestStreak(longestStreak);
        habit.setCurrentStreak(currentStreak);
        habit.setLastCompletedDate(Collections.max(completionDates));
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

    public List<HabitWithCompletionsDto> getHabitsWithCompletionsByUser(User user) {
        List<Habit> habits = habitRepository.findByUser(user);

        return habits.stream().map(habit -> {
            List<LocalDate> completions = habitCompletionRepository.findCompletionDatesByHabitId(habit.getId());

            HabitWithCompletionsDto dto = new HabitWithCompletionsDto();
            dto.setId(habit.getId());
            dto.setName(habit.getName());
            dto.setCurrentStreak(habit.getCurrentStreak());
            dto.setLongestStreak(habit.getLongestStreak());
            dto.setTotalCompletedDays(habit.getTotalCompletedDays());
            dto.setLastCompletedDate(habit.getLastCompletedDate());
            dto.setCompletedDates(completions);
            dto.setUserId(habit.getUser().getId());

            return dto;
        }).collect(Collectors.toList());
    }



}
