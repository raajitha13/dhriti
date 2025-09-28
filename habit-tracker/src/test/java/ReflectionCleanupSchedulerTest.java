import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import com.example.habit_tracker.ReflectionCleanupScheduler;
import com.example.habit_tracker.model.Reflection;
import com.example.habit_tracker.model.User;
import com.example.habit_tracker.repository.ReflectionRepository;
import com.example.habit_tracker.repository.UserRepository;

@DataJpaTest
@Import(ReflectionCleanupScheduler.class)
public class ReflectionCleanupSchedulerTest {

    @Autowired
    private ReflectionRepository reflectionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReflectionCleanupScheduler scheduler;

    private User testUser;

    @BeforeEach
    public void setup() {
        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setPassword("dummy");
        testUser.setRole("DEV");
        userRepository.saveAndFlush(testUser);
    }

    @Test
    public void testCleanupOldReflectionsClearsInputText() {
        Reflection oldReflection = new Reflection();
        oldReflection.setInputText("Old reflection text");
        oldReflection.setCreatedAt(LocalDateTime.now().minusDays(40));
        oldReflection.setDate(LocalDateTime.now().minusDays(40).toLocalDate());
        oldReflection.setUser(testUser);
        reflectionRepository.saveAndFlush(oldReflection);

        Long oldId = oldReflection.getId();

        scheduler.cleanupOldReflections();
        // reflectionRepository.flush();

        Optional<Reflection> stillPresent = reflectionRepository.findById(oldId);
        Assertions.assertTrue(stillPresent.isPresent(), "Old reflection row should still exist");
        Assertions.assertNull(stillPresent.get().getInputText(), "InputText should be null for old reflection");
    }

    @Test
    public void testRecentReflectionsNotCleared() {
        Reflection recentReflection = new Reflection();
        recentReflection.setInputText("Recent reflection");
        recentReflection.setCreatedAt(LocalDateTime.now().minusDays(5));
        recentReflection.setDate(LocalDateTime.now().minusDays(5).toLocalDate());
        recentReflection.setUser(testUser);
        reflectionRepository.saveAndFlush(recentReflection);

        Long recentId = recentReflection.getId();

        scheduler.cleanupOldReflections();
        // reflectionRepository.flush();

        Optional<Reflection> stillPresent = reflectionRepository.findById(recentId);
        Assertions.assertTrue(stillPresent.isPresent(), "Recent reflection should still exist");
        Assertions.assertEquals("Recent reflection", stillPresent.get().getInputText(),
                "InputText of recent reflection should not be cleared");
    }
}
