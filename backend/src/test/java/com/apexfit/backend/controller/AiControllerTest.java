package com.apexfit.backend.controller;

import com.apexfit.backend.dto.AiChatMessageDTO;
import com.apexfit.backend.dto.SaveDietDTO;
import com.apexfit.backend.dto.DashboardDataDTO;
import com.apexfit.backend.service.AiNutritionistService;
import com.apexfit.backend.service.ProfileService;
import com.apexfit.backend.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AiController.class)
class AiControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private AiNutritionistService aiNutritionistService;

        @MockBean
        private ProfileService profileService;

        @MockBean
        private JwtTokenProvider jwtTokenProvider;

        @Test
        @WithMockUser(username = "test@example.com")
        void chat_ReturnsResponse_WhenSuccessful() throws Exception {
                AiChatMessageDTO payload = new AiChatMessageDTO(Collections.emptyList(), "Olá, monte minha dieta");
                Mockito.when(aiNutritionistService.chat(eq("test@example.com"), any(AiChatMessageDTO.class)))
                                .thenReturn("Aqui está sua dieta...");

                mockMvc.perform(post("/api/v1/ai/chat")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(payload)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.resposta").value("Aqui está sua dieta..."));
        }

        @Test
        @WithMockUser(username = "test@example.com")
        void chat_ReturnsInternalServerError_WhenExceptionThrown() throws Exception {
                AiChatMessageDTO payload = new AiChatMessageDTO(Collections.emptyList(), "Erro forcado");
                Mockito.when(aiNutritionistService.chat(eq("test@example.com"), any(AiChatMessageDTO.class)))
                                .thenThrow(new RuntimeException("API do Gemini falhou"));

                mockMvc.perform(post("/api/v1/ai/chat")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(payload)))
                                .andExpect(status().isInternalServerError())
                                .andExpect(jsonPath("$.error").value("API do Gemini falhou"));
        }

        @Test
        @WithMockUser(username = "test@example.com")
        void chat_ReturnsBadRequest_WhenNovaMensagemIsBlank() throws Exception {
                AiChatMessageDTO payload = new AiChatMessageDTO(Collections.emptyList(), "");

                mockMvc.perform(post("/api/v1/ai/chat")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(payload)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.errors.novaMensagem").exists());
        }

        @Test
        @WithMockUser(username = "test@example.com")
        void salvarDieta_ReturnsDashboardData_WhenSuccessful() throws Exception {
                SaveDietDTO payload = new SaveDietDTO("Plano salvo com sucesso");

                DashboardDataDTO dashboardData = new DashboardDataDTO(
                                "Test User", "test@example.com",
                                1, 0, 1000, 0,
                                false, false, false,
                                null, null, "Plano salvo com sucesso");
                Mockito.when(profileService.salvarDieta("test@example.com", "Plano salvo com sucesso"))
                                .thenReturn(dashboardData);

                mockMvc.perform(put("/api/v1/ai/salvar-dieta")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(payload)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.savedDietPlan").value("Plano salvo com sucesso"));
        }
}
