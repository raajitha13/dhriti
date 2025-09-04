package com.example.habit_tracker.service;

import com.example.habit_tracker.model.Reflection;
import com.example.habit_tracker.model.ReflectionInsights;
import com.example.habit_tracker.model.ReflectionSample;
import com.example.habit_tracker.model.User;
import com.example.habit_tracker.repository.ReflectionInsightsRepository;
import com.example.habit_tracker.repository.ReflectionRepository;
import com.example.habit_tracker.repository.ReflectionSampleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class ReflectionService {

    private final ReflectionRepository reflectionRepository;
    private final ReflectionInsightsRepository insightsRepository;
    private final ReflectionSampleRepository reflectionSampleRepository;
    private final ReflectionInsightsService insightsService;

    public ReflectionService(ReflectionRepository reflectionRepository,
                             ReflectionInsightsRepository insightsRepository,
                             ReflectionSampleRepository reflectionSampleRepository,
                             ReflectionInsightsService insightsService) {
        this.reflectionRepository = reflectionRepository;
        this.insightsRepository = insightsRepository;
        this.reflectionSampleRepository = reflectionSampleRepository;
        this.insightsService = insightsService;
    }

    /**
     * Creates a new reflection and generates insights.
     * Returns the Reflection entity so controller can build DTO.
     */
    @Transactional
    public Reflection createReflection(User user, String inputText) {
        // 1. Save Reflection
        Reflection reflection = new Reflection();
        reflection.setUser(user);
        reflection.setInputText(inputText); // short-lived
        reflection.setDate(LocalDate.now());
        reflection.setCreatedAt(LocalDateTime.now());
        reflectionRepository.save(reflection);

        // 2. Run pipeline
        String analysis = insightsService.analyze(inputText);
        String highlights = serializeHighlights(insightsService.extractHighlights(inputText));
        String version = "1.0";

        // 3. Save ReflectionInsights (latest snapshot)
        addInsights(reflection, analysis, highlights, version);

        // 4. Save ReflectionSample (immutable audit log)
        ReflectionSample sample = new ReflectionSample(inputText, LocalDateTime.now(),  analysis, String.join(",", highlights), version);
        reflectionSampleRepository.save(sample);

        return reflection;
    }


    /**
     * Adds ReflectionInsights to a given reflection.
     */
    public ReflectionInsights addInsights(Reflection reflection,
                                          String analysisJson,
                                          String highlights,
                                          String version) {
        ReflectionInsights insights = new ReflectionInsights();
        insights.setReflection(reflection);
        insights.setAnalysis(analysisJson);
        insights.setHighlights(highlights);
        insights.setInsightsVersion(version);
        insights.setCreatedAt(LocalDateTime.now());
        return insightsRepository.save(insights);
    }

    public Reflection updateReflection(Reflection reflection, String newText) {
        // enforce edit window (e.g. 14 days)
        if (reflection.getDate().isBefore(LocalDate.now().minusDays(14))) {
            throw new IllegalArgumentException("Cannot edit reflections older than 14 days");
        }

        reflection.setInputText(newText);
        reflection.setCreatedAt(LocalDateTime.now());
        reflectionRepository.save(reflection);

        // remove old insights (keep only one per reflection)
        insightsRepository.deleteByReflection(reflection);

        // regenerate new insights
        String analysis = insightsService.analyze(newText);
        String highlights = serializeHighlights(insightsService.extractHighlights(newText));
        String version = "1.0";

        // 3. Save ReflectionInsights (latest snapshot)
        addInsights(reflection, analysis, highlights, version);

        // 4. Save ReflectionSample (immutable audit log)
        ReflectionSample sample = new ReflectionSample(newText, LocalDateTime.now(),  analysis, String.join(",", highlights), version);
        reflectionSampleRepository.save(sample);

        return reflection;
    }



    /**
     * Fetch all reflections for a user.
     */
    public List<Reflection> getReflectionsForUser(User user) {
        return reflectionRepository.findByUser(user);
    }

    /**
     * Fetch the latest insights for a reflection.
     */
    public ReflectionInsights getInsightsForReflection(Reflection reflection) {
        return insightsRepository.findInsightByReflection(reflection);
    }

    //getReflectionByUserAndDate
    public Reflection getReflectionByUserAndDate(User user, LocalDate date) {
        return reflectionRepository.findReflectionByUserAndDate(user, date);
    }

    public List<Reflection> getReflectionsForUserAndRange(User user, LocalDate from, LocalDate to) {
        return reflectionRepository.findByUserAndDateBetweenOrderByDateDesc(user, from, to);
    }

    //getReflectionById
    public Reflection getReflectionById(Long id) {
        return reflectionRepository.findReflectionById(id);
    }

    List<String> parseHighlights(String raw) {
    return raw == null ? List.of() : Arrays.asList(raw.split("\\|")); 
    }

    String serializeHighlights(List<String> list) {
        return list == null ? null : String.join("|", list);
    }


}
