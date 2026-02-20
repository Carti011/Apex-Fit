package com.apexfit.backend.dto;

public record DashboardDataDTO(
        int level,
        int currentXp,
        int targetXp,
        int currentStreak,
        BioProfileDTO bioProfile,
        NutritionPlanDTO nutritionPlan) {
}
