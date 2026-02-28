/**
 * Utilitário para transformar o texto bruto da IA em um objeto estruturado (JSON)
 * para facilitar a renderização no PDF sem depender de HTML concatenado.
 */
export const parseDietText = (textoBruto, userName, date) => {
    // 1. Extrair APENAS a dieta contida na tag <DIETA_PDF> (se existir)
    let textoFormatado = textoBruto;
    if (textoFormatado.includes('<DIETA_PDF>') && textoFormatado.includes('</DIETA_PDF>')) {
        textoFormatado = textoFormatado.split('<DIETA_PDF>')[1].split('</DIETA_PDF>')[0].trim();
    } else {
        // Lógica de fallback para textos antigos (sem a tag)
        const matchStart = textoFormatado.match(/\n(?:🍽️\s*PLANO|Dieta Atualizada|Objetivos?:|Calorias e Macros|#{1,4}\s*(?:Refeição|☀️)|\*\*\s*(?:Refeição|☀️)|💪)/m)
            || textoFormatado.match(/^(?:🍽️\s*PLANO|Dieta Atualizada|Objetivos?:|Calorias e Macros|#{1,4}\s*(?:Refeição|☀️)|\*\*\s*(?:Refeição|☀️)|💪)/m);
        if (matchStart) {
            textoFormatado = textoFormatado.substring(matchStart.index);
        }

        // O corte final (matchEnd) foi deletado porque amputava as sextas refeições se a IA
        // fizesse uma despedida grudada.
    }

    const jsonResult = {
        athleteName: userName || 'Atleta',
        emissionDate: date || new Date().toLocaleDateString('pt-BR'),
        headerLines: [],
        meals: [],
        hydration: '',
    };

    const linhas = textoFormatado.split('\n');
    let inMealsSection = false;
    let currentMeal = null;

    // Regra regex para identificar início de refeição (Blindada contra Emojis Desconhecidos)
    const isHeaderRegex = /^(?:<strong.*?>|\*\*)?(?:[^a-z0-9A-ZÀ-ÿ\n]*)(?:\d+[\.º-]?\s*)?(?:[^a-z0-9A-ZÀ-ÿ\n]*)(?:Refeição|Caixa|Ceia|Lanche|Hidratação|Café\s*da\s*manhã|Almoço|Jantar)/i;

    for (let i = 0; i < linhas.length; i++) {
        let linhaRaw = linhas[i].trim();
        if (!linhaRaw || linhaRaw.match(/^(---|___|\*\*\*)$/)) continue;

        // Limpar hashes do markdown para títulos
        let linhaLimpa = linhaRaw.replace(/^#{1,4}\s*/, '');

        // Tratar bullets e negritos pra simplificar no componente futuro
        // Ex: **100g** de frango => vamos manter os asteriscos e tratar no componente
        // se o componente preferir tratar. Por hora, removeremos APENAS os asteriscos de titulos de refeição
        // para isolar o nome real.

        if (linhaLimpa.toLowerCase().includes('hidratação')) {
            jsonResult.hydration = linhaLimpa.replace(/\*\*/g, '').replace(/💧\s*/, '').trim();
            continue;
        }

        if (isHeaderRegex.test(linhaRaw) || /^#{2,4}\s/.test(linhaRaw) || /^\*\*(?:\d+[\.º-]?\s*)?(?:Refeição\s*\d*).*\*\*/i.test(linhaRaw)) {
            inMealsSection = true;

            // Salva refeição anterior
            if (currentMeal) {
                jsonResult.meals.push(currentMeal);
            }

            // Inicia nova
            currentMeal = {
                title: linhaLimpa.replace(/\*\*/g, ''), // Tira negrito
                items: [],
                totals: ''
            };
        } else {
            if (inMealsSection && currentMeal) {
                if (linhaLimpa.includes('Total:') || linhaLimpa.includes('📊')) {
                    currentMeal.totals = linhaLimpa.replace(/\*\*/g, '');
                } else if (linhaLimpa.startsWith('•') || linhaLimpa.startsWith('-') || linhaLimpa.startsWith('*')) {
                    // Item normal da lista
                    currentMeal.items.push(linhaLimpa.replace(/^[•\-\*]\s*/, ''));
                } else {
                    // Texto solto no meio da refeição (às vezes a IA põe)
                    currentMeal.items.push(linhaLimpa);
                }
            } else {
                // Header Lines (Objetivos, Calorias totais)
                jsonResult.headerLines.push(linhaRaw); // Mantemos a linha como a IA mandou (com ou sem **)
            }
        }
    }

    // Push final
    if (currentMeal) {
        jsonResult.meals.push(currentMeal);
    }

    return jsonResult;
};
