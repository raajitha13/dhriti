package com.example.habit_tracker.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "reflection_sample")
public class ReflectionSample {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String rawInput;

    @Column(columnDefinition = "TEXT")
    private String analysis;  // full JSON of pipeline output

    @Column(columnDefinition = "TEXT")
    private String highlights; // optional, or you can store as JSON array

    private String insightsVersion;

    private LocalDateTime collectedAt;

    public ReflectionSample() {}

    public ReflectionSample(String rawInput, LocalDateTime collectedAt, String analysis, String highlights, String insightsVersion) {
        this.rawInput = rawInput;
        this.analysis = analysis;
        this.highlights = highlights;
        this.insightsVersion = insightsVersion;
        this.collectedAt = collectedAt;
    }
}
