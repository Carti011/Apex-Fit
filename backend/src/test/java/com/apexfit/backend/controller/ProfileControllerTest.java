package com.apexfit.backend.controller;

import com.apexfit.backend.dto.BioProfileDTO;
import com.apexfit.backend.dto.DashboardDataDTO;
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
                1, 0, 100, 0, false, false, false, null, null);

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
                null, 80.0, 180.0, null, null, null, null);

        DashboardDataDTO mockDashboard = new DashboardDataDTO(
                1, 50, 100, 0, false, false, false, bioDto, null);

        when(profileService.updateBioProfile(email, bioDto)).thenReturn(mockDashboard);

        ResponseEntity<DashboardDataDTO> response = profileController.updateBioProfile(authentication, bioDto);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockDashboard, response.getBody());
        verify(profileService, times(1)).updateBioProfile(email, bioDto);
    }
}
