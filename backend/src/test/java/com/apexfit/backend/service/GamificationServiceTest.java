package com.apexfit.backend.service;

import com.apexfit.backend.dto.XpHistoryDTO;
import com.apexfit.backend.model.User;
import com.apexfit.backend.model.XpHistory;
import com.apexfit.backend.repository.UserRepository;
import com.apexfit.backend.repository.XpHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GamificationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private XpHistoryRepository xpHistoryRepository;

    @InjectMocks
    private GamificationService gamificationService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@email.com");
        testUser.setCurrentXp(0);
        testUser.setLevel(1);
        testUser.setTargetXp(100);
        testUser.setCurrentStreak(0);
        testUser.setWaterGoalMet(false);
        testUser.setDietGoalMet(false);
        testUser.setWorkoutGoalMet(false);
    }

    @Test
    void shouldAddXpAndNotLevelUp() {
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
        when(xpHistoryRepository.findByUserAndDate(any(User.class), any(LocalDate.class))).thenReturn(Optional.empty());

        User updatedUser = gamificationService.addXp(testUser, 50);

        assertEquals(50, updatedUser.getCurrentXp());
        assertEquals(1, updatedUser.getLevel());
        verify(xpHistoryRepository, times(1)).save(any(XpHistory.class));
    }

    @Test
    void shouldAddXpAndLevelUp() {
        testUser.setCurrentXp(80);
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
        when(xpHistoryRepository.findByUserAndDate(any(User.class), any(LocalDate.class))).thenReturn(Optional.empty());

        User updatedUser = gamificationService.addXp(testUser, 50);

        assertEquals(30, updatedUser.getCurrentXp()); // 80 + 50 = 130 - 100 = 30
        assertEquals(2, updatedUser.getLevel());
        assertEquals(200, updatedUser.getTargetXp());
    }

    @Test
    void shouldProcessDailyActivityForFirstTime() {
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        User updatedUser = gamificationService.processDailyActivity(testUser);

        assertEquals(1, updatedUser.getCurrentStreak());
        assertEquals(LocalDate.now(), updatedUser.getLastActivityDate());
        assertEquals(10, updatedUser.getCurrentXp()); // 10 XP for daily login
    }

    @Test
    void shouldIncrementStreakForConsecutiveDays() {
        testUser.setLastActivityDate(LocalDate.now().minusDays(1));
        testUser.setCurrentStreak(5);
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        User updatedUser = gamificationService.processDailyActivity(testUser);

        assertEquals(6, updatedUser.getCurrentStreak());
        assertEquals(LocalDate.now(), updatedUser.getLastActivityDate());
    }

    @Test
    void shouldResetStreakIfMissedDay() {
        testUser.setLastActivityDate(LocalDate.now().minusDays(2));
        testUser.setCurrentStreak(5);
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        User updatedUser = gamificationService.processDailyActivity(testUser);

        assertEquals(1, updatedUser.getCurrentStreak());
        assertEquals(LocalDate.now(), updatedUser.getLastActivityDate());
    }

    @Test
    void shouldCompleteWaterQuest() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        User updatedUser = gamificationService.completeQuest("test@email.com", "WATER");

        assertTrue(updatedUser.isWaterGoalMet());
        assertEquals(30, updatedUser.getCurrentXp()); // 10 (daily login if first time) + 20 (water)
    }

    @Test
    void shouldCompleteWorkoutQuestAndThrowOnUnknown() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        gamificationService.completeQuest("test@email.com", "WORKOUT");
        assertTrue(testUser.isWorkoutGoalMet());
        
        assertThrows(IllegalArgumentException.class, () -> gamificationService.completeQuest("test@email.com", "INVALID"));
    }

    @Test
    void shouldGetWeeklyXpHistory() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        
        LocalDate today = LocalDate.now();
        LocalDate twoDaysAgo = today.minusDays(2);
        
        XpHistory history1 = new XpHistory(testUser, twoDaysAgo, 150);
        XpHistory history2 = new XpHistory(testUser, today, 50);

        when(xpHistoryRepository.findFirstByUserOrderByDateAsc(testUser)).thenReturn(Optional.of(history1));
        when(xpHistoryRepository.findByUserAndDateBetweenOrderByDateAsc(testUser, twoDaysAgo, today))
            .thenReturn(Arrays.asList(history1, history2));

        List<XpHistoryDTO> result = gamificationService.getWeeklyXpHistory("test@email.com");

        assertEquals(3, result.size()); // twoDaysAgo, yesterday, today
        assertEquals(150, result.get(0).getXp());
        assertEquals(0, result.get(1).getXp());
        assertEquals(50, result.get(2).getXp());
    }
}
