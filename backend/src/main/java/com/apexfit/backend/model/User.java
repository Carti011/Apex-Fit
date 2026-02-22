package com.apexfit.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.Objects;
import java.util.List;
import java.util.ArrayList;

import com.apexfit.backend.model.enums.ActivityLevel;
import com.apexfit.backend.model.enums.Gender;
import com.apexfit.backend.model.enums.Goal;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Email
    @NotBlank
    @Column(unique = true)
    private String email;

    @NotBlank
    private String password;

    // Gamification Fields
    private int level = 1;
    private int currentXp = 0;
    private int targetXp = 100;
    private int currentStreak = 0;
    private LocalDate lastActivityDate;

    // Relacionamentos Gamificacao e Social
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "league_id")
    private League league;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "squad_id")
    private Squad squad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academy_id")
    private Academy academy;

    // Daily Quests Fields
    private boolean waterGoalMet = false;
    private boolean dietGoalMet = false;
    private boolean workoutGoalMet = false;
    private LocalDate lastGoalResetDate;

    // Histórico de Gamificacão (Cascade Deleção)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<XpHistory> xpHistories = new ArrayList<>();

    // Bio Fields
    private LocalDate birthDate;
    private Double weight; // kg
    private Double height; // cm

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private Double bodyFatPercentage; // BF% (Optional)

    @Enumerated(EnumType.STRING)
    private ActivityLevel activityLevel;

    @Enumerated(EnumType.STRING)
    private Goal goal;

    public User() {
    }

    public User(Long id, String name, String email, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getCurrentXp() {
        return currentXp;
    }

    public void setCurrentXp(int currentXp) {
        this.currentXp = currentXp;
    }

    public int getTargetXp() {
        return targetXp;
    }

    public void setTargetXp(int targetXp) {
        this.targetXp = targetXp;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }

    public LocalDate getLastActivityDate() {
        return lastActivityDate;
    }

    public void setLastActivityDate(LocalDate lastActivityDate) {
        this.lastActivityDate = lastActivityDate;
    }

    public League getLeague() {
        return league;
    }

    public void setLeague(League league) {
        this.league = league;
    }

    public Squad getSquad() {
        return squad;
    }

    public void setSquad(Squad squad) {
        this.squad = squad;
    }

    public Academy getAcademy() {
        return academy;
    }

    public void setAcademy(Academy academy) {
        this.academy = academy;
    }

    public boolean isWaterGoalMet() {
        return waterGoalMet;
    }

    public void setWaterGoalMet(boolean waterGoalMet) {
        this.waterGoalMet = waterGoalMet;
    }

    public boolean isDietGoalMet() {
        return dietGoalMet;
    }

    public void setDietGoalMet(boolean dietGoalMet) {
        this.dietGoalMet = dietGoalMet;
    }

    public boolean isWorkoutGoalMet() {
        return workoutGoalMet;
    }

    public void setWorkoutGoalMet(boolean workoutGoalMet) {
        this.workoutGoalMet = workoutGoalMet;
    }

    public LocalDate getLastGoalResetDate() {
        return lastGoalResetDate;
    }

    public void setLastGoalResetDate(LocalDate lastGoalResetDate) {
        this.lastGoalResetDate = lastGoalResetDate;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Double getBodyFatPercentage() {
        return bodyFatPercentage;
    }

    public void setBodyFatPercentage(Double bodyFatPercentage) {
        this.bodyFatPercentage = bodyFatPercentage;
    }

    public ActivityLevel getActivityLevel() {
        return activityLevel;
    }

    public void setActivityLevel(ActivityLevel activityLevel) {
        this.activityLevel = activityLevel;
    }

    public Goal getGoal() {
        return goal;
    }

    public void setGoal(Goal goal) {
        this.goal = goal;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='[PROTECTED]'" +
                '}';
    }
}
