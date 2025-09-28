package com.example.habit_tracker;

import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.habit_tracker.repository.ReflectionRepository;

import java.time.LocalDateTime;

@Component
public class ReflectionCleanupScheduler {

    private final ReflectionRepository reflectionRepository;

    public ReflectionCleanupScheduler(ReflectionRepository reflectionRepository) {
        this.reflectionRepository = reflectionRepository;
    }

    @Scheduled(cron = "0 0 2 * * ?") // daily at 2 AM
    @Transactional
    public void cleanupOldReflections() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(30);
        reflectionRepository.clearOldReflectionInput(cutoff);
    }
}



