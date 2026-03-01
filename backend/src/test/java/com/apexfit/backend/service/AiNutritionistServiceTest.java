package com.apexfit.backend.service;

import com.apexfit.backend.dto.AiChatMessageDTO;
import com.apexfit.backend.model.User;
import com.apexfit.backend.model.enums.ActivityLevel;
import com.apexfit.backend.model.enums.Gender;
import com.apexfit.backend.model.enums.Goal;
import com.apexfit.backend.dto.NutritionPlanDTO;
import com.apexfit.backend.exception.UserNotFoundException;
import com.apexfit.backend.repository.UserRepository;
import com.apexfit.backend.service.CalculatorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

@ExtendWith(MockitoExtension.class)
class AiNutritionistServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CalculatorService calculatorService;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private AiNutritionistService aiNutritionistService;

    @BeforeEach
    void setUp() {
        // Injetando variaveis que seriam carregadas pelo @Value e o mock do
        // RestTemplate
        ReflectionTestUtils.setField(aiNutritionistService, "geminiApiKey", "dummy-api-key");
        ReflectionTestUtils.setField(aiNutritionistService, "restTemplate", restTemplate);
    }

    @Test
    void chat_ReturnsGeminiResponse_WhenSuccess() throws Exception {
        // Arrange
        User user = new User();
        user.setEmail("test@example.com");
        user.setName("John Doe");
        user.setGoal(Goal.LOSE_WEIGHT);
        user.setBirthDate(LocalDate.now().minusYears(30));
        user.setWeight(85.0);
        user.setHeight(180.0);
        user.setGender(Gender.MALE);
        user.setActivityLevel(ActivityLevel.MODERATE); // fator 1.55

        Mockito.when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        Mockito.when(calculatorService.calculate(any(User.class)))
                .thenReturn(new NutritionPlanDTO(1600, 2000, 160, 200, 70));

        String mockResponseJson = "{\"candidates\":[{\"content\":{\"parts\":[{\"text\":\"Sua dieta está pronta!\"}]}}]}";
        ResponseEntity<String> responseEntity = new ResponseEntity<>(mockResponseJson, HttpStatus.OK);

        Mockito.when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
                .thenReturn(responseEntity);

        AiChatMessageDTO payload = new AiChatMessageDTO(Collections.emptyList(), "Gere minh dieta");

        // Act
        String response = aiNutritionistService.chat("test@example.com", payload);

        // Assert
        assertEquals("Sua dieta está pronta!", response);
    }

    @Test
    void chat_ThrowsException_WhenUserNotFound() {
        // Arrange
        Mockito.when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        AiChatMessageDTO payload = new AiChatMessageDTO(Collections.emptyList(), "Oi");

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> {
            aiNutritionistService.chat("test@example.com", payload);
        });
    }

    @Test
    void chat_ThrowsException_WhenGeminiReturnsError() {
        // Arrange
        User user = new User();
        user.setEmail("test@example.com");
        Mockito.when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        Mockito.when(restTemplate.postForEntity(anyString(), any(), eq(String.class)))
                .thenThrow(new RuntimeException("Simulando erro na rede"));

        AiChatMessageDTO payload = new AiChatMessageDTO(Collections.emptyList(), "Oi");

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            aiNutritionistService.chat("test@example.com", payload);
        });
    }

    // Método helper para corrigir o eq() se não importado corretamente acima
    private <T> Class<T> eq(Class<T> value) {
        return org.mockito.ArgumentMatchers.eq(value);
    }
}
