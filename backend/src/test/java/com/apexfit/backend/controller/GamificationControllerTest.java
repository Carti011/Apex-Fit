package com.apexfit.backend.controller;

import com.apexfit.backend.dto.BioProfileDTO;
import com.apexfit.backend.dto.DashboardDataDTO;
import com.apexfit.backend.dto.XpHistoryDTO;
import com.apexfit.backend.model.enums.ActivityLevel;
import com.apexfit.backend.model.enums.Goal;
import com.apexfit.backend.service.GamificationService;
import com.apexfit.backend.service.ProfileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GamificationControllerTest {

    @Mock
    private GamificationService gamificationService;

    @Mock
    private ProfileService profileService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private GamificationController gamificationController;

    private DashboardDataDTO mockDashboard;

    @BeforeEach
    void setUp() {
        BioProfileDTO bio = new BioProfileDTO(
                LocalDate.now().minusYears(25), 80.0, 180.0, com.apexfit.backend.model.enums.Gender.MALE,
                15.0, ActivityLevel.ACTIVE, Goal.GAIN_MUSCLE);

        mockDashboard = new DashboardDataDTO(
                2, 50, 200, 5, true, false, false,
                bio,
                null);
    }

    @Test
    void shouldCompleteQuestAndReturnUpdatedDashboard() {
        String email = "test@email.com";
        String questType = "WATER";

        when(authentication.getName()).thenReturn(email);
        doAnswer(i -> null).when(gamificationService).completeQuest(email, questType);
        when(profileService.getDashboardDataByEmail(email)).thenReturn(mockDashboard);

        ResponseEntity<DashboardDataDTO> response = gamificationController.completeQuest(authentication, questType);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockDashboard, response.getBody());
        verify(gamificationService, times(1)).completeQuest(email, questType);
        verify(profileService, times(1)).getDashboardDataByEmail(email);
    }

    @Test
    void shouldGetWeeklyHistory() {
        String email = "test@email.com";
        when(authentication.getName()).thenReturn(email);

        List<XpHistoryDTO> mockHistory = Arrays.asList(
                new XpHistoryDTO(LocalDate.now().minusDays(1).toString(), 50),
                new XpHistoryDTO(LocalDate.now().toString(), 100));

        when(gamificationService.getWeeklyXpHistory(email)).thenReturn(mockHistory);

        ResponseEntity<List<XpHistoryDTO>> response = gamificationController.getWeeklyHistory(authentication);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        assertEquals(100, response.getBody().get(1).getXp());
        verify(gamificationService, times(1)).getWeeklyXpHistory(email);
    }
}
