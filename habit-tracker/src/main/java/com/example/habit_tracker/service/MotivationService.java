package com.example.habit_tracker.service;

import com.example.habit_tracker.model.User;
import com.example.habit_tracker.repository.HabitRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MotivationService {

    @Autowired
    private HabitRepository habitRepository;

    private ObjectNode buildHabitPayload(User user) {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode payload = mapper.createObjectNode();
        var habits = habitRepository.findByUser(user);
        var habitsArray = mapper.createArrayNode();

        habits.forEach(habit -> {
            ObjectNode h = mapper.createObjectNode();
            h.put("name", habit.getName());
            h.put("currentStreak", habit.getCurrentStreak());
            h.put("longestStreak", habit.getLongestStreak());
            h.put("totalCompletedDays", habit.getTotalCompletedDays());
            habitsArray.add(h);
        });

        payload.set("habits", habitsArray);
        return payload;
    }

    public String generateSummary(User user) throws Exception {
        return postToFastAPI(user, "http://localhost:8000/summary", "weekly_summary");
    }

    public String getQuote(User user) throws Exception {
        return postToFastAPI(user, "http://localhost:8000/quote", "motivational_quote");
    }

    private String postToFastAPI(User user, String apiUrl, String fieldToExtract) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode payload = buildHabitPayload(user);

        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost post = new HttpPost(apiUrl);
            post.setHeader("Content-Type", "application/json");
            post.setEntity(new StringEntity(payload.toString()));

            try (CloseableHttpResponse response = client.execute(post)) {
                String responseBody = EntityUtils.toString(response.getEntity());
                JsonNode json = mapper.readTree(responseBody);
                return json.has(fieldToExtract) ? json.get(fieldToExtract).asText() : "";
            }
        }
    }
}
