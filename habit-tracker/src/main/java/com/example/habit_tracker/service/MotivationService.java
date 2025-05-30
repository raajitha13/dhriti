package com.example.habit_tracker.service;

import com.example.habit_tracker.model.User;
import com.example.habit_tracker.repository.HabitRepository;
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

    public String generateMotivationSummary(User user) throws Exception {
        String apiUrl = "http://localhost:8000/generate";

        try (CloseableHttpClient client = HttpClients.createDefault()) {
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

            HttpPost post = new HttpPost(apiUrl);
            post.setHeader("Content-Type", "application/json");
            post.setEntity(new StringEntity(payload.toString()));

            try (CloseableHttpResponse response = client.execute(post)) {
                return EntityUtils.toString(response.getEntity());
            }
        }
    }
}
