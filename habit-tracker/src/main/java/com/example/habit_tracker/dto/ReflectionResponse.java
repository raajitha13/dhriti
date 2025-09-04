package com.example.habit_tracker.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReflectionResponse {
    private Long reflectionId;      // use this for tiles
    private LocalDate date;
    private String highlights;
    private String analysis;
    private LocalDateTime reflectionCreatedAt;

    public ReflectionResponse(Long reflectionId, LocalDate date, String highlights, String analysis, LocalDateTime reflectionCreatedAt) {
        this.reflectionId = reflectionId;
        this.date = date;
        this.highlights = highlights;
        this.analysis = analysis;
        this.reflectionCreatedAt = reflectionCreatedAt;
    }

    public Long getReflectionId() {
        return reflectionId;
    }

    public void setReflectionId(Long reflectionId) {
        this.reflectionId = reflectionId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getAnalysis() {
        return analysis;
    }

    public void setAnalysis(String analysis) {
        this.analysis = analysis;
    }

    public String getHighlights() {
        return highlights;
    }

    public void setHighlights(String highlights) {
        this.highlights = highlights;
    }

    public LocalDateTime getReflectionCreatedAt() {
        return reflectionCreatedAt;
    }

    public void setReflectionCreatedAt(LocalDateTime reflectionCreatedAt) {
        this.reflectionCreatedAt = reflectionCreatedAt;
    }
    
}
