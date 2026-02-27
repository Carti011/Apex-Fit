package com.apexfit.backend.dto;

import com.apexfit.backend.model.enums.ActivityLevel;
import com.apexfit.backend.model.enums.Gender;
import com.apexfit.backend.model.enums.Goal;

import java.time.LocalDate;

public record BioProfileDTO(
                LocalDate birthDate,
                Double weight,
                Double height,
                Gender gender,
                Double bodyFatPercentage,
                ActivityLevel activityLevel,
                Goal goal,
                String dietaryRestrictions,
                String foodDislikes,
                Integer numberOfMeals,
                String foodFavorites) {
}
