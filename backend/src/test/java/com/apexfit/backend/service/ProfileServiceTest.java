package com.apexfit.backend.service;

import com.apexfit.backend.dto.BioProfileDTO;
import com.apexfit.backend.dto.DashboardDataDTO;
import com.apexfit.backend.dto.NutritionPlanDTO;
import com.apexfit.backend.model.User;
import com.apexfit.backend.model.enums.ActivityLevel;
import com.apexfit.backend.model.enums.Gender;
import com.apexfit.backend.model.enums.Goal;
import com.apexfit.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CalculatorService calculatorService;

    @Mock
    private GamificationService gamificationService;

    @InjectMocks
    private ProfileService profileService;

    private User testUser;
    private BioProfileDTO bioDto;
    private NutritionPlanDTO mockNutrition;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setEmail("test@email.com");
        testUser.setLevel(1);
        testUser.setCurrentXp(0);
        testUser.setTargetXp(100);

        bioDto = new BioProfileDTO(
                LocalDate.of(2000, 1, 1),
                80.0,
                180.0,
                Gender.MALE,
                15.0,
                ActivityLevel.ACTIVE,
                Goal.GAIN_MUSCLE);

        mockNutrition = new NutritionPlanDTO(2000, 2500, 160, 200, 80);
    }

    @Test
    void shouldUpdateBioProfileAndAwardXpForFirstTimeSetup() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(gamificationService.addXp(any(User.class), eq(50))).thenAnswer(i -> i.getArguments()[0]);
        when(calculatorService.calculate(any(User.class))).thenReturn(mockNutrition);

        DashboardDataDTO result = profileService.updateBioProfile("test@email.com", bioDto);

        assertNotNull(result);
        assertEquals(80.0, testUser.getWeight());
        verify(gamificationService, times(1)).addXp(any(User.class), eq(50));
        verify(userRepository, never()).save(any(User.class)); // save happens inside addXp
    }

    @Test
    void shouldUpdateBioProfileWithoutAwardingXpIfAlreadySetup() {
        testUser.setWeight(75.0); // Not first time
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
        when(calculatorService.calculate(any(User.class))).thenReturn(mockNutrition);

        DashboardDataDTO result = profileService.updateBioProfile("test@email.com", bioDto);

        assertNotNull(result);
        assertEquals(180.0, testUser.getHeight());
        verify(gamificationService, never()).addXp(any(User.class), anyInt());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void shouldGetDashboardDataByEmail() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(gamificationService.processDailyActivity(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
        when(calculatorService.calculate(any(User.class))).thenReturn(mockNutrition);

        DashboardDataDTO result = profileService.getDashboardDataByEmail("test@email.com");

        assertNotNull(result);
        assertEquals(1, result.level());
        assertEquals(0, result.currentXp());
        assertNotNull(result.nutritionPlan());
        verify(gamificationService, times(1)).processDailyActivity(any(User.class));
    }
}
