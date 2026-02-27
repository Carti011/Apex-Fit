package com.apexfit.backend.dto;

public record DashboardDataDTO(
                String name,
                String email,
                int level,
                int currentXp,
                int targetXp,
                int currentStreak,
                boolean waterGoalMet,
                boolean dietGoalMet,
                boolean workoutGoalMet,
                BioProfileDTO bioProfile,
                NutritionPlanDTO nutritionPlan,
                String savedDietPlan) {
}
