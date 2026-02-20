package com.apexfit.backend.controller;

import com.apexfit.backend.dto.DashboardDataDTO;
import com.apexfit.backend.service.GamificationService;
import com.apexfit.backend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/gamification")
public class GamificationController {

    private final GamificationService gamificationService;
    private final ProfileService profileService; // Used to return the updated DashboardData

    public GamificationController(GamificationService gamificationService, ProfileService profileService) {
        this.gamificationService = gamificationService;
        this.profileService = profileService;
    }

    @PostMapping("/quests/complete")
    public ResponseEntity<DashboardDataDTO> completeQuest(Authentication authentication,
            @RequestParam String questType) {
        // Find user, complete quest, save database inside service
        gamificationService.completeQuest(authentication.getName(), questType.toUpperCase());

        // Return updated dashboard data so frontend knows new XP and quest status
        DashboardDataDTO updatedData = profileService.getDashboardDataByEmail(authentication.getName());
        return ResponseEntity.ok(updatedData);
    }

    @org.springframework.web.bind.annotation.GetMapping("/history")
    public ResponseEntity<java.util.List<com.apexfit.backend.dto.XpHistoryDTO>> getWeeklyHistory(
            Authentication authentication) {
        java.util.List<com.apexfit.backend.dto.XpHistoryDTO> history = gamificationService
                .getWeeklyXpHistory(authentication.getName());
        return ResponseEntity.ok(history);
    }
}
