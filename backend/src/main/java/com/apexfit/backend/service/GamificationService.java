package com.apexfit.backend.service;

import com.apexfit.backend.model.User;
import com.apexfit.backend.model.XpHistory;
import com.apexfit.backend.repository.UserRepository;
import com.apexfit.backend.repository.XpHistoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class GamificationService {

    private final UserRepository userRepository;
    private final XpHistoryRepository xpHistoryRepository;

    public GamificationService(UserRepository userRepository, XpHistoryRepository xpHistoryRepository) {
        this.userRepository = userRepository;
        this.xpHistoryRepository = xpHistoryRepository;
    }

    /**
     * Adds XP to a user, handles level ups, and logs the gain in XpHistory.
     */
    public User addXp(User user, int amount) {
        if (amount <= 0)
            return user;

        int newXp = user.getCurrentXp() + amount;

        // Handle potential multiple level ups
        while (newXp >= user.getTargetXp()) {
            newXp -= user.getTargetXp();
            user.setLevel(user.getLevel() + 1);
            user.setTargetXp(user.getLevel() * 100); // Level 1 -> 100, Level 2 -> 200...
        }

        user.setCurrentXp(newXp);
        user = userRepository.save(user);

        // Track Daily XP Gain
        LocalDate today = LocalDate.now();
        XpHistory history = xpHistoryRepository.findByUserAndDate(user, today)
                .orElse(new XpHistory(user, today, 0));
        history.setXpGained(history.getXpGained() + amount);
        xpHistoryRepository.save(history);

        return user;
    }

    /**
     * Processes daily activity: updates streak and grants daily login XP.
     * Call this when a user logs in or fetches their dashboard.
     */
    public User processDailyActivity(User user) {
        LocalDate today = LocalDate.now();
        LocalDate lastActivity = user.getLastActivityDate();

        boolean isNewDay = false;

        if (lastActivity == null) {
            // First time activity
            user.setCurrentStreak(1);
            isNewDay = true;
        } else {
            long daysBetween = ChronoUnit.DAYS.between(lastActivity, today);

            if (daysBetween == 1) {
                // Consecutive day, increment streak
                user.setCurrentStreak(user.getCurrentStreak() + 1);
                isNewDay = true;
            } else if (daysBetween > 1) {
                // Streak broken, reset to 1
                user.setCurrentStreak(1);
                isNewDay = true;
            }
            // If daysBetween == 0, they already logged activity today, do nothing to streak
        }

        // Daily Quest Resets
        LocalDate lastQuestReset = user.getLastGoalResetDate();
        if (lastQuestReset == null || ChronoUnit.DAYS.between(lastQuestReset, today) >= 1) {
            user.setWaterGoalMet(false);
            user.setDietGoalMet(false);
            user.setWorkoutGoalMet(false);
            user.setLastGoalResetDate(today);
        }

        if (isNewDay) {
            user.setLastActivityDate(today);
            user = addXp(user, 10); // Grant 10 XP for daily activity
        }

        return userRepository.save(user);
    }

    /**
     * Completes a daily quest and awards XP.
     */
    public User completeQuest(String email, String questType) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Ensure quests are reset today before checking completeness
        user = processDailyActivity(user);

        boolean updated = false;

        switch (questType.toUpperCase()) {
            case "WATER":
                if (!user.isWaterGoalMet()) {
                    user.setWaterGoalMet(true);
                    user = addXp(user, 20); // 20 XP for water
                    updated = true;
                }
                break;
            case "DIET":
                if (!user.isDietGoalMet()) {
                    user.setDietGoalMet(true);
                    user = addXp(user, 30); // 30 XP for diet
                    updated = true;
                }
                break;
            case "WORKOUT":
                if (!user.isWorkoutGoalMet()) {
                    user.setWorkoutGoalMet(true);
                    user = addXp(user, 50); // 50 XP for workout
                    updated = true;
                }
                break;
            default:
                throw new IllegalArgumentException("Unknown quest type: " + questType);
        }

        if (updated) {
            return userRepository.save(user);
        }
        return user;
    }

    /**
     * Retrieves the XP history for the last 7 days.
     */
    public java.util.List<com.apexfit.backend.dto.XpHistoryDTO> getWeeklyXpHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgo = today.minusDays(6); // Today + 6 previous days = 7 days

        java.util.List<XpHistory> historyList = xpHistoryRepository.findByUserAndDateBetweenOrderByDateAsc(user,
                sevenDaysAgo, today);

        // Fill missing days with 0 XP
        java.util.Map<LocalDate, Integer> historyMap = new java.util.HashMap<>();
        for (XpHistory h : historyList) {
            historyMap.put(h.getDate(), h.getXpGained());
        }

        java.util.List<com.apexfit.backend.dto.XpHistoryDTO> result = new java.util.ArrayList<>();
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM");

        for (int i = 0; i < 7; i++) {
            LocalDate date = sevenDaysAgo.plusDays(i);
            int xp = historyMap.getOrDefault(date, 0);
            result.add(new com.apexfit.backend.dto.XpHistoryDTO(date.format(formatter), xp));
        }

        return result;
    }
}
