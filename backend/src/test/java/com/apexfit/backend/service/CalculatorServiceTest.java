package com.apexfit.backend.service;

import com.apexfit.backend.dto.NutritionPlanDTO;
import com.apexfit.backend.model.User;
import com.apexfit.backend.model.enums.ActivityLevel;
import com.apexfit.backend.model.enums.Gender;
import com.apexfit.backend.model.enums.Goal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class CalculatorServiceTest {

    private CalculatorService calculatorService;

    @BeforeEach
    void setUp() {
        calculatorService = new CalculatorService();
    }

    @Test
    void calculate_ReturnsNull_WhenBioFieldsMissing() {
        User user = new User();
        user.setWeight(75.0);
        // Missing height, birthDate, etc

        NutritionPlanDTO plan = calculatorService.calculate(user);
        assertNull(plan);
    }

    @Test
    void calculate_UsesMifflin_WhenNoBodyFat() {
        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(25)); // 25 years old
        user.setWeight(80.0);
        user.setHeight(180.0);
        user.setGender(Gender.MALE);
        user.setActivityLevel(ActivityLevel.SEDENTARY); // factor: 1.2
        user.setGoal(Goal.MAINTAIN);

        // Mifflin (Male): (10 * 80) + (6.25 * 180) - (5 * 25) + 5
        // 800 + 1125 - 125 + 5 = 1805

        NutritionPlanDTO plan = calculatorService.calculate(user);

        assertNotNull(plan);
        assertEquals(1805, plan.tmb());
        // GET: 1805 * 1.2 = 2166
        assertEquals(2166, plan.get());
    }

    @Test
    void calculate_UsesKatchMcArdle_WhenBodyFatPresent() {
        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(25));
        user.setWeight(80.0);
        user.setHeight(180.0);
        user.setGender(Gender.MALE);
        user.setBodyFatPercentage(15.0); // Lean Mass = 80 * 0.85 = 68kg
        user.setActivityLevel(ActivityLevel.SEDENTARY); // factor: 1.2
        user.setGoal(Goal.MAINTAIN);

        // Katch-McArdle: 370 + (21.6 * 68) = 370 + 1468.8 = 1838.8 (approx 1838 as int
        // cast)

        NutritionPlanDTO plan = calculatorService.calculate(user);

        assertNotNull(plan);
        assertEquals(1838, plan.tmb());
        // GET = 1838.8 * 1.2 = 2206.56
        assertEquals(2206, plan.get());
    }

    @Test
    void calculate_AdjustsMacros_ByGoalLoseWeight() {
        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(25));
        user.setWeight(80.0);
        user.setHeight(180.0);
        user.setGender(Gender.MALE);
        user.setActivityLevel(ActivityLevel.SEDENTARY);
        user.setGoal(Goal.LOSE_WEIGHT); // GET - 500

        // GET base was 2166. New GET: 1666
        // Protein (2g/kg): 160g (640 kcal)
        // Fats (1g/kg): 80g (720 kcal)
        // Remainder: 1666 - 1360 = 306 kcal / 4 = 76g Carbs

        NutritionPlanDTO plan = calculatorService.calculate(user);

        assertEquals(1666, plan.get());
        assertEquals(160, plan.protein());
        assertEquals(80, plan.fats());
        assertEquals(76, plan.carbs());
    }

    @Test
    void calculate_UsesMifflinFemale_AndAdjustsForGainMuscle() {
        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(30)); // 30 years old
        user.setWeight(60.0);
        user.setHeight(165.0);
        user.setGender(Gender.FEMALE);
        user.setActivityLevel(ActivityLevel.LIGHT); // factor: 1.375
        user.setGoal(Goal.GAIN_MUSCLE); // GET + 250

        // Mifflin (Female): (10 * 60) + (6.25 * 165) - (5 * 30) - 161
        // 600 + 1031.25 - 150 - 161 = 1320.25 -> 1320
        // GET: 1320.25 * 1.375 = 1815.34
        // Adjust GAIN_MUSCLE: 1815.34 + 250 = 2065.34 -> 2065

        NutritionPlanDTO plan = calculatorService.calculate(user);

        assertNotNull(plan);
        assertEquals(1320, plan.tmb());
        assertEquals(2065, plan.get());

        // Macros:
        // Protein (2g/kg): 120g (480 kcal)
        // Fats (1g/kg): 60g (540 kcal)
        // Remainder: 2065 - (480 + 540) = 2065 - 1020 = 1045 kcal / 4 = 261.25g Carbs
        assertEquals(120, plan.protein());
        assertEquals(60, plan.fats());
        assertEquals(261, plan.carbs());
    }
}
