package com.example.habit_tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.example.habit_tracker")
public class HabitTrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(HabitTrackerApplication.class, args);
	}

}
