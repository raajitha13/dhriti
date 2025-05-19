package com.example.habit_tracker.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", 404,
                        "error", "Not Found",
                        "message", ex.getMessage()
                ));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", 403,
                        "error", "Forbidden",
                        "message", ex.getMessage()
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", 500,
                        "error", "Internal Server Error",
                        "message", ex.getMessage()
                ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException ex) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", 409,
                        "error", "Conflict",
                        "message", ex.getMessage()
                ));
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<?> handleValidationErrors(MethodArgumentNotValidException ex) {
                Map<String, String> errors = new HashMap<>();
                ex.getBindingResult().getFieldErrors().forEach(error ->
                        errors.put(error.getField(), error.getDefaultMessage()));
                
                return ResponseEntity.badRequest().body(Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", 400,
                        "error", "Validation Error",
                        "messages", errors
                ));
        }

}

