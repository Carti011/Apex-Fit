package com.apexfit.backend.controller;

import com.apexfit.backend.dto.BioProfileDTO;
import com.apexfit.backend.dto.DashboardDataDTO;
import com.apexfit.backend.dto.AccountUpdateDTO;
import com.apexfit.backend.service.ProfileService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileControllerTest {

    @Mock
    private ProfileService profileService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ProfileController profileController;

    @Test
    void shouldGetDashboard() {
        String email = "test@email.com";
        when(authentication.getName()).thenReturn(email);

        DashboardDataDTO mockDashboard = new DashboardDataDTO(
                "Test User", "test@email.com",
                1, 0, 100, 0, false, false, false, null, null, null);

        when(profileService.getDashboardDataByEmail(email)).thenReturn(mockDashboard);

        ResponseEntity<DashboardDataDTO> response = profileController.getDashboard(authentication);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockDashboard, response.getBody());
        verify(profileService, times(1)).getDashboardDataByEmail(email);
    }

    @Test
    void shouldUpdateBioProfile() {
        String email = "test@email.com";
        when(authentication.getName()).thenReturn(email);

        BioProfileDTO bioDto = new BioProfileDTO(
                null, 80.0, 180.0, null, null, null, null, null, null, null, null);

        DashboardDataDTO mockDashboard = new DashboardDataDTO(
                "Test User", "test@email.com",
                1, 50, 100, 0, false, false, false, bioDto, null, null);

        when(profileService.updateBioProfile(email, bioDto)).thenReturn(mockDashboard);

        ResponseEntity<DashboardDataDTO> response = profileController.updateBioProfile(authentication, bioDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockDashboard, response.getBody());
        verify(profileService, times(1)).updateBioProfile(email, bioDto);
    }

    @Test
    void shouldUpdateAccountProfile() {
        String email = "test@email.com";
        when(authentication.getName()).thenReturn(email);

        AccountUpdateDTO accountDto = new AccountUpdateDTO("New Name", "senha123", "senha456");

        DashboardDataDTO mockDashboard = new DashboardDataDTO(
                "New Name", "test@email.com",
                1, 50, 100, 0, false, false, false, null, null, null);

        when(profileService.updateAccountProfile(email, accountDto)).thenReturn(mockDashboard);

        ResponseEntity<DashboardDataDTO> response = profileController.updateAccountProfile(authentication, accountDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockDashboard, response.getBody());
        verify(profileService, times(1)).updateAccountProfile(email, accountDto);
    }
}
