package com.apexfit.backend.dto;

public record DashboardDataDTO(
                int level,
                int currentXp,
                int targetXp,
                int currentStreak,
                boolean waterGoalMet,
                boolean dietGoalMet,
                boolean workoutGoalMet,
                BioProfileDTO bioProfile,
                NutritionPlanDTO nutritionPlan) {
}
