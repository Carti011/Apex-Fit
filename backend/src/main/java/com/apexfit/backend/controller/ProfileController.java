package com.apexfit.backend.controller;

import com.apexfit.backend.dto.BioProfileDTO;
import com.apexfit.backend.dto.DashboardDataDTO;
import com.apexfit.backend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDataDTO> getDashboard(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.getDashboardDataByEmail(email));
    }

    @PutMapping("/bio")
    public ResponseEntity<DashboardDataDTO> updateBioProfile(
            Authentication authentication,
            @RequestBody BioProfileDTO bioDto) {
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.updateBioProfile(email, bioDto));
    }
}
