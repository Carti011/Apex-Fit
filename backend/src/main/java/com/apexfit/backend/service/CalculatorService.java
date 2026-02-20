package com.apexfit.backend.service;

import com.apexfit.backend.model.User;
import com.apexfit.backend.dto.NutritionPlanDTO;
import com.apexfit.backend.model.enums.Gender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;

@Service
public class CalculatorService {

    public NutritionPlanDTO calculate(User user) {
        // If the user hasn't filled in the required bio profile details, we can't
        // calculate
        if (user.getWeight() == null || user.getHeight() == null || user.getBirthDate() == null
                || user.getGender() == null || user.getActivityLevel() == null) {
            return null;
        }

        int age = Period.between(user.getBirthDate(), LocalDate.now()).getYears();
        double weight = user.getWeight();
        double height = user.getHeight();

        double tmb;

        // Use Katch-McArdle if BF% is present and greater than 0
        if (user.getBodyFatPercentage() != null && user.getBodyFatPercentage() > 0) {
            double leanBodyMass = weight * (1 - (user.getBodyFatPercentage() / 100.0));
            tmb = 370 + (21.6 * leanBodyMass);
        } else {
            // Default to Mifflin-St Jeor
            if (user.getGender() == Gender.MALE) {
                tmb = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            } else {
                tmb = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            }
        }

        // Calculate Total Daily Energy Expenditure (GET)
        double get = tmb * user.getActivityLevel().getFactor();

        // Adjust GET based on user's goal
        if (user.getGoal() != null) {
            switch (user.getGoal()) {
                case LOSE_WEIGHT -> get -= 500; // Deficit
                case GAIN_MUSCLE -> get += 250; // Surplus
                case MAINTAIN -> {
                } // Baseline
            }
        }

        // Macro calculation (Simple estimate: 2g protein/kg, 1g fat/kg, rest carbs)
        int protein = (int) (weight * 2.0);
        int fats = (int) (weight * 1.0);

        // 1g protein = 4 kcal, 1g fat = 9 kcal, 1g carbs = 4 kcal
        double caloriesFromProteinsAndFats = (protein * 4) + (fats * 9);
        double remainingCalories = get - caloriesFromProteinsAndFats;
        int carbs = Math.max(0, (int) (remainingCalories / 4));

        return new NutritionPlanDTO((int) tmb, (int) get, protein, carbs, fats);
    }
}
