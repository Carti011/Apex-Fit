package com.apexfit.backend.service;

import com.apexfit.backend.model.User;
import com.apexfit.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class GamificationService {

    private final UserRepository userRepository;

    public GamificationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Adds XP to a user and handles level ups.
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
        return userRepository.save(user);
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

        if (isNewDay) {
            user.setLastActivityDate(today);
            user = addXp(user, 10); // Grant 10 XP for daily activity
        }

        return userRepository.save(user);
    }
}
