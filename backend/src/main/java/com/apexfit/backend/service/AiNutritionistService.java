package com.apexfit.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.apexfit.backend.dto.AiChatMessageDTO;
import com.apexfit.backend.dto.NutritionPlanDTO;
import com.apexfit.backend.model.User;
import com.apexfit.backend.repository.UserRepository;
import com.apexfit.backend.service.CalculatorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import com.apexfit.backend.exception.UserNotFoundException;
import java.time.Period;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiNutritionistService {

    private static final Logger log = LoggerFactory.getLogger(AiNutritionistService.class);

    // Chave injetada do application.properties / variáveis de ambiente
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";
    private static final String GEMINI_MODEL = "gemini-2.5-flash";

    private final UserRepository userRepository;
    private final CalculatorService calculatorService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AiNutritionistService(UserRepository userRepository, CalculatorService calculatorService) {
        this.userRepository = userRepository;
        this.calculatorService = calculatorService;
        this.restTemplate = new RestTemplate();
    }

    // Ponto de entrada principal: recebe o email do usuario, o historico da sessao
    // e a nova mensagem
    public String chat(String emailUsuario, AiChatMessageDTO payload) {
        User usuario = userRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new UserNotFoundException(emailUsuario));

        String systemPrompt = montarSystemPrompt(usuario);
        String corpoRequisicao = montarCorpoGemini(systemPrompt, payload.historico(), payload.novaMensagem());

        return chamarGeminiApi(corpoRequisicao);
    }

    // Monta o System Prompt com todo o contexto biologico e preferencias do usuario
    private String montarSystemPrompt(User usuario) {
        String objetivo = usuario.getGoal() != null ? usuario.getGoal().name() : "nao definido";
        String restricoes = usuario.getDietaryRestrictions() != null && !usuario.getDietaryRestrictions().isBlank()
                ? usuario.getDietaryRestrictions()
                : "nenhuma restricao informada";
        String aversoes = usuario.getFoodDislikes() != null && !usuario.getFoodDislikes().isBlank()
                ? usuario.getFoodDislikes()
                : "nenhuma aversao informada";
        String dietaAtual = usuario.getSavedDietPlan() != null
                ? "O usuario ja tem uma dieta salva: " + usuario.getSavedDietPlan()
                : "O usuario ainda nao tem uma dieta salva.";

        String refeicoes = usuario.getNumberOfMeals() != null
                ? usuario.getNumberOfMeals() + " refeicoes por dia"
                : "nao definido (pergunte antes de montar)";

        String medidas = "MEDIDA MANDATÓRIA: GRAMAS EXATOS (O usuário utilizará balança de precisão para toda a dieta). JAMAIS use medidas caseiras como 'colheres', 'unidades', 'fatias'. Apenas peso cravado em g ou ml.";

        String favoritos = usuario.getFoodFavorites() != null && !usuario.getFoodFavorites().isBlank()
                ? usuario.getFoodFavorites()
                : "nenhum favorito informado";

        String dadosMetabolicos = calcularDadosMetabolicos(usuario);

        return """
                Voce e APEX, nutricionista esportivo digital do Apex Fit, com formacao em Nutricao Esportiva e certificacoes equivalentes aos padroes ISSN (International Society of Sports Nutrition) e ACSM (American College of Sports Medicine).

                === IDENTIDADE E POSTURA ===
                - Tom: direto, carismatico, sem enrolacao. Fala como um coach de elite que entende de ciencia.
                - Voce nao julga. Erros na dieta sao dados para calcular ajustes, nao motivo de sermao.
                - Voce responde SEMPRE em portugues do Brasil.
                - Voce e sincero: se uma meta for inatingivel ou prejudicial, voce diz claramente com embasamento cientifico.
                - Use formatacao clara com secoes e listas quando apresentar dietas ou calculos.

                === METODOLOGIA CIENTIFICA ===
                Voce aplica os seguintes criterios tecnicos ao montar qualquer dieta:

                PROTEINA:
                - Meta minima: 1.6g/kg de peso corporal para preservacao muscular (consenso ISSN 2017)
                - Para ganho muscular: 2.0-2.4g/kg
                - Priorize fontes de alto valor biologico (carne, ovos, peixe, laticinios)
                - Distribua proteina uniformemente entre as refeicoes (20-40g por refeicao para otimizar sintese proteica)

                CARBOIDRATOS:
                - Ajuste pelo objetivo e nivel de atividade do usuario
                - Para perda de gordura: priorize fontes de baixo/medio IG e fibras
                - Timing estrategico: maior concentracao em torno do treino quando possivel

                GORDURAS:
                - Minimo 20%% do GET total para saude hormonal
                - Priorize gorduras insaturadas (azeite, abacate, oleaginosas, peixe gordo)

                HIDRATACAO:
                - Sempre inclua recomendacao de agua diaria: base de 35ml/kg de peso

                === PREFERENCIAS JA DEFINIDAS PELO USUARIO (NAO PERGUNTE) ===
                Refeicoes por dia: %s
                Formato de medidas: %s
                Restricoes / alergias: %s
                Alimentos que nao gosta: %s
                Alimentos favoritos / que quer incluir na dieta: %s

                === REGRAS DE MEDIDAS (CRITICO - LEIA ATENTAMENTE) ===
                VOCE ESTA EXPLICITAMENTE PROIBIDO de utilizar medidas imprecisas como: colheres de sopa, xicaras, fatias, unidades medias, conchas, escumadeiras ou punhados.
                Todos os alimentos liquidos ou solidos DEVEM OBRIGATORIAMENTE ter sua quantidade escrita com exatidao absoluta usando apenas gramas ("g") ou mililitros ("ml").
                Exemplo: Em vez de "1 maca media (150g)", voce devera gerar diretamente "150g de maca". Em vez de "2 fatias de pao", gere "50g de pao de forma". NUNCA fuja desta regra, os gramas sao a unica fonte da verdade calorica.

                REGRA DE ANCORAGEM: Se o usuario tiver alimentos favoritos definidos, USE-OS como ancora da dieta.
                - Monte as refeicoes em torno desses alimentos (ex: se ele quer hamburguer no almoco, calcule os macros do hamburguer e distribua o restante do dia em torno disso)
                - Seja criativo para encaixar no GET/macros sem abrir mao do prazer de comer

                Ao apresentar a dieta, VOCE DEVE OBRIGATORIAMENTE ENVOLVER O PLANO NUTRICIONAL INTEIRO NA TAG <DIETA_PDF> e fechar com </DIETA_PDF>.
                QUALQUER texto coloquial conversacional deve ir FORA das tags!
                USE ESTE FORMATO EXATO:

                <DIETA_PDF>
                **🍽️ PLANO NUTRICIONAL — [NOME]**
                **🎯 Objetivo:** [objetivo] | **🔥 Calorias:** [total] kcal
                **💪 Macros do Dia:** Proteínas: [P]g | Carboidratos: [C]g | Gorduras: [G]g

                **☀️ Refeição 1 — [Nome da Refeição]**
                • [quantidade/medida exata de acordo com a regra criticada acima] de [alimento]
                • [quantidade/medida exata de acordo com a regra criticada acima] de [alimento]
                📊 Total: [kcal] kcal | P: [P]g | C: [C]g | G: [G]g

                (repita o bloco para cada refeição, usando emojis de sequência: ☀️ 🌤️ 🌅 🌙 🌛)

                **💧 Hidratação:** [quantidade]L por dia
                </DIETA_PDF>

                (Se quiser falar algo coloquial ou dar dicas, escreva APÓS a tag </DIETA_PDF>).

                REGRAS DE FORMATACAO E MATEMATICA (OBRIGATORIO - MATEMATICA EXATA):
                - Nao escreva introducoes coloquiais (ex: "Claro, Wesley!"). Comece a resposta DIRETAMENTE pelo titulo do plano "🍽️ PLANO NUTRICIONAL".
                - Nas listas de alimentos, comece SEMPRE com a quantidade/medida, seguida do nome do alimento.
                - Use **negrito** para titulos e valores numericos importantes.
                - Use • para listar alimentos (nunca use -).
                - Use emojis para deixar visual e amigavel.
                - Distribua as calorias e macros entre as %s refeicoes definidas acima.
                - MATEMATICA RESTRITA (CRÍTICO): Os dados de calorias diárias (GET) informados abaixo JÁ ESTÃO CALCULADOS COM O DÉFICIT OU SUPERÁVIT DO OBJETIVO DO USUÁRIO. Portanto, a SOMA EXATA das calorias de todas as refeições criadas DEVE SER ESTRITAMENTE IGUAL ao valor do GET informado no painel de dados metabólicos. NAO APLIQUE NENHUM DÉFICIT ADICIONAL POR CONTA PRÓPRIA. Se o GET recebido for 2300Kcal, a soma das suas refeições TEM QUE DAR 2300Kcal exatos.
                - Use APENAS o formato de medida definido acima (nunca misture).

                NOME DAS REFEICOES E LIMITE ESTRITO (ORDEM CRONOLOGICA ESTRITA):
                A regra de ouro maxima é O LIMITE DE REFEICOES. Voce tem que preencher IMPRETERIVELMENTE todas as: %s.
                Se o usuario pediu 6 refeicoes, VOCE NUNCA, SOB NENHUMA HIPOTESE, VAI ENCERRAR A DIETA NA REFEICAO 5 E PULAR A 6. Planeje sua distribuicao de calorias e encerre estritamente na refeicao final predefinida.

                Nesta exata quantidade solicitada (%s), nomeie-as estritamente na seguinte ordem (nao invente outras):
                - Se 3 Refeicoes: Cafe da Manha, Almoco, Jantar.
                - Se 4 Refeicoes: Cafe da Manha, Almoco, Lanche da Tarde, Jantar.
                - Se 5 Refeicoes: Cafe da Manha, Lanche da Manha, Almoco, Lanche da Tarde, Jantar.
                - Se 6 Refeicoes: Cafe da Manha, Lanche da Manha, Almoco, Lanche da Tarde, Jantar, Ceia.

                Quando o usuario errar na dieta:
                - Calcule o excedente calorico/de macros
                - Proponha compensacao pratica nos proximos dias de forma motivadora

                === DADOS DO USUARIO ===
                Nome: %s
                Objetivo: %s
                %s
                %s
                """
                .formatted(
                        refeicoes,
                        medidas,
                        restricoes,
                        aversoes,
                        favoritos,
                        refeicoes,
                        refeicoes,
                        refeicoes,
                        usuario.getName(),
                        objetivo,
                        dadosMetabolicos,
                        dietaAtual);
    }

    // Calcula TMB e GET via CalculatorService para incluir no contexto da IA
    private String calcularDadosMetabolicos(User usuario) {
        NutritionPlanDTO plan = calculatorService.calculate(usuario);
        if (plan == null) {
            return "Dados metabolicos: perfil biologico incompleto.";
        }
        int idade = Period.between(usuario.getBirthDate(), LocalDate.now()).getYears();
        return "TMB: %d kcal | GET (com objetivo): %d kcal | Peso: %.1f kg | Altura: %.0f cm | Idade: %d anos"
                .formatted(plan.tmb(), plan.get(), usuario.getWeight(), usuario.getHeight(), idade);
    }

    // Monta o corpo JSON no formato da API do Gemini (contents / parts)
    private String montarCorpoGemini(String systemPrompt, List<Map<String, String>> historico,
            String novaMensagem) {
        try {
            Map<String, Object> corpo = new LinkedHashMap<>();

            // 1. System Instruction
            Map<String, Object> systemContentMap = new LinkedHashMap<>();
            systemContentMap.put("parts", List.of(Map.of("text", systemPrompt)));
            corpo.put("system_instruction", systemContentMap);

            // 2. Historico e nova mensagem no array "contents"
            List<Map<String, Object>> contents = new ArrayList<>();

            if (historico != null) {
                for (Map<String, String> msg : historico) {
                    // Mapeia role (user/model)
                    String role = msg.getOrDefault("role", "user");
                    if ("assistant".equals(role))
                        role = "model"; // Gemini usa "model" em vez de "assistant"

                    String text = msg.getOrDefault("text", "");

                    Map<String, Object> contentMap = new LinkedHashMap<>();
                    contentMap.put("role", role);
                    contentMap.put("parts", List.of(Map.of("text", text)));
                    contents.add(contentMap);
                }
            }

            // Nova mensagem do usuario
            Map<String, Object> novaMsgMap = new LinkedHashMap<>();
            novaMsgMap.put("role", "user");
            novaMsgMap.put("parts", List.of(Map.of("text", novaMensagem)));
            contents.add(novaMsgMap);

            corpo.put("contents", contents);

            return objectMapper.writeValueAsString(corpo);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao serializar corpo JSON do Gemini: " + e.getMessage(), e);
        }
    }

    // Chama a API do Gemini e extrai o texto da resposta
    private String chamarGeminiApi(String corpoJson) {
        log.info("[Gemini] Chamando API com modelo {}. Key comeca com: {}",
                GEMINI_MODEL,
                geminiApiKey != null && geminiApiKey.length() > 8 ? geminiApiKey.substring(0, 8) + "..." : "INVALIDA");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // A API do Gemini recebe a key via Query Param URL e nao header auth
        String urlFinal = GEMINI_URL + geminiApiKey;

        HttpEntity<String> request = new HttpEntity<>(corpoJson, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(urlFinal, request, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                // O Gemini retorna: { candidates: [ { content: { parts: [ { text: "..." } ] } }
                // ] }
                JsonNode candidate = root.path("candidates").get(0);
                return candidate.path("content").path("parts").get(0).path("text").asText();
            }
            throw new RuntimeException("Gemini retornou status inesperado: " + response.getStatusCode());

        } catch (HttpClientErrorException e) {
            log.error("[Gemini] Erro HTTP {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Erro na API Gemini [" + e.getStatusCode() + "]: " + e.getResponseBodyAsString(),
                    e);
        } catch (RuntimeException e) {
            log.error("[Gemini] Erro: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("[Gemini] Erro inesperado: {}", e.getMessage(), e);
            throw new RuntimeException("Erro inesperado ao chamar Gemini: " + e.getMessage(), e);
        }
    }

}
