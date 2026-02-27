package com.apexfit.backend.service;

import com.apexfit.backend.dto.BioProfileDTO;
import com.apexfit.backend.dto.DashboardDataDTO;
import com.apexfit.backend.dto.NutritionPlanDTO;
import com.apexfit.backend.model.User;
import com.apexfit.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.apexfit.backend.dto.AccountUpdateDTO;

@Service
public class ProfileService {

        private final UserRepository userRepository;
        private final CalculatorService calculatorService;
        private final GamificationService gamificationService;
        private final PasswordEncoder passwordEncoder;

        public ProfileService(UserRepository userRepository, CalculatorService calculatorService,
                        GamificationService gamificationService, PasswordEncoder passwordEncoder) {
                this.userRepository = userRepository;
                this.calculatorService = calculatorService;
                this.gamificationService = gamificationService;
                this.passwordEncoder = passwordEncoder;
        }

        public DashboardDataDTO updateAccountProfile(String email, AccountUpdateDTO accountDto) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                if (accountDto.getName() != null && !accountDto.getName().isBlank()) {
                        user.setName(accountDto.getName());
                }

                if (accountDto.getNewPassword() != null && !accountDto.getNewPassword().isBlank()) {
                        if (accountDto.getCurrentPassword() == null || !passwordEncoder
                                        .matches(accountDto.getCurrentPassword(), user.getPassword())) {
                                throw new RuntimeException("Senha atual incorreta.");
                        }
                        user.setPassword(passwordEncoder.encode(accountDto.getNewPassword()));
                }

                user = userRepository.save(user);

                return getDashboardData(user);
        }

        public DashboardDataDTO updateBioProfile(String email, BioProfileDTO bioDto) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                boolean isFirstTimeSetup = (user.getWeight() == null);

                user.setBirthDate(bioDto.birthDate());
                user.setWeight(bioDto.weight());
                user.setHeight(bioDto.height());
                user.setGender(bioDto.gender());
                user.setBodyFatPercentage(bioDto.bodyFatPercentage());
                user.setActivityLevel(bioDto.activityLevel());
                user.setGoal(bioDto.goal());

                // Preferencias de dieta (podem ser nulas — usuario atualiza quando quiser)
                if (bioDto.dietaryRestrictions() != null)
                        user.setDietaryRestrictions(bioDto.dietaryRestrictions());
                if (bioDto.foodDislikes() != null)
                        user.setFoodDislikes(bioDto.foodDislikes());
                if (bioDto.numberOfMeals() != null)
                        user.setNumberOfMeals(bioDto.numberOfMeals());
                if (bioDto.foodFavorites() != null)
                        user.setFoodFavorites(bioDto.foodFavorites());

                if (isFirstTimeSetup) {
                        user = gamificationService.addXp(user, 50);
                } else {
                        user = userRepository.save(user);
                }

                return getDashboardData(user);
        }

        public DashboardDataDTO getDashboardDataByEmail(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Process daily activity (Streak + Daily Login XP)
                user = gamificationService.processDailyActivity(user);

                return getDashboardData(user);
        }

        private DashboardDataDTO getDashboardData(User user) {
                BioProfileDTO bio = new BioProfileDTO(
                                user.getBirthDate(),
                                user.getWeight(),
                                user.getHeight(),
                                user.getGender(),
                                user.getBodyFatPercentage(),
                                user.getActivityLevel(),
                                user.getGoal(),
                                user.getDietaryRestrictions(),
                                user.getFoodDislikes(),
                                user.getNumberOfMeals(),
                                user.getFoodFavorites());

                NutritionPlanDTO nutrition = calculatorService.calculate(user);

                return new DashboardDataDTO(
                                user.getName(),
                                user.getEmail(),
                                user.getLevel(),
                                user.getCurrentXp(),
                                user.getTargetXp(),
                                user.getCurrentStreak(),
                                user.isWaterGoalMet(),
                                user.isDietGoalMet(),
                                user.isWorkoutGoalMet(),
                                bio,
                                nutrition,
                                user.getSavedDietPlan());
        }

        // Persiste a dieta aprovada pelo usuario no banco
        public DashboardDataDTO salvarDieta(String email, String dietaPlan) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));
                user.setSavedDietPlan(dietaPlan);
                user = userRepository.save(user);
                return getDashboardData(user);
        }
}
