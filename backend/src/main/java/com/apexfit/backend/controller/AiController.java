package com.apexfit.backend.controller;

import com.apexfit.backend.dto.AiChatMessageDTO;
import com.apexfit.backend.dto.SaveDietDTO;
import com.apexfit.backend.dto.DashboardDataDTO;
import com.apexfit.backend.service.AiNutritionistService;
import com.apexfit.backend.service.ProfileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    private static final Logger log = LoggerFactory.getLogger(AiController.class);

    private final AiNutritionistService aiNutritionistService;
    private final ProfileService profileService;

    public AiController(AiNutritionistService aiNutritionistService, ProfileService profileService) {
        this.aiNutritionistService = aiNutritionistService;
        this.profileService = profileService;
    }

    // Endpoint principal de chat: recebe historico + nova mensagem e retorna resposta da IA
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(
            Authentication authentication,
            @Valid @RequestBody AiChatMessageDTO payload) {
        try {
            String email = authentication.getName();
            String resposta = aiNutritionistService.chat(email, payload);
            return ResponseEntity.ok(Map.of("resposta", resposta));
        } catch (Exception e) {
            log.error("[AiController] TIPO DO ERRO: {}", e.getClass().getName());
            log.error("[AiController] Erro ao processar chat: {}", e.getMessage(), e);
            String msg = e.getMessage() != null ? e.getMessage() : "Erro interno";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", msg));
        }
    }

    // Endpoint de streaming SSE: envia chunks de texto conforme o Gemini gera
    @PostMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter chatStream(
            Authentication authentication,
            @Valid @RequestBody AiChatMessageDTO payload) {
        SseEmitter emitter = new SseEmitter(120_000L);
        String email = authentication.getName();

        CompletableFuture.runAsync(() ->
            aiNutritionistService.chatStream(email, payload, emitter)
        ).exceptionally(ex -> {
            try {
                emitter.send(SseEmitter.event().name("error").data("Erro ao processar resposta da IA"));
                emitter.complete();
            } catch (Exception e) {
                // resposta já committed ou cliente desconectou — sem ação necessária
            }
            return null;
        });

        return emitter;
    }

    // Endpoint para salvar a dieta aprovada pelo usuario no banco
    @PutMapping("/salvar-dieta")
    public ResponseEntity<DashboardDataDTO> salvarDieta(
            Authentication authentication,
            @RequestBody SaveDietDTO body) {
        String email = authentication.getName();
        DashboardDataDTO atualizado = profileService.salvarDieta(email, body.dietaPlan());
        return ResponseEntity.ok(atualizado);
    }
}
