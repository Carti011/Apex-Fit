package com.apexfit.backend.dto;

import java.util.List;
import java.util.Map;

// Payload recebido pelo frontend ao enviar uma mensagem para o Agente Nutricionista
public record AiChatMessageDTO(
        List<Map<String, String>> historico, // mensagens anteriores da sessao (role + text)
        String novaMensagem // nova mensagem enviada pelo usuario
) {
}
