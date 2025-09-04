package com.example.habit_tracker.exception;

public class AlreadyExistsException extends RuntimeException {
    public AlreadyExistsException(String entityName) {
        super(entityName + " already exists");
    }
}

