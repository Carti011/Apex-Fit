import { describe, it, expect } from 'vitest';
import { parseDietText } from './dietParser';

describe('parseDietText', () => {
    it('usa valores padrão quando userName e date não são fornecidos', () => {
        const result = parseDietText('', undefined, undefined);
        expect(result.athleteName).toBe('Atleta');
        expect(result.emissionDate).toBeTruthy();
        expect(result.meals).toEqual([]);
        expect(result.headerLines).toEqual([]);
        expect(result.hydration).toBe('');
    });

    it('usa userName e date fornecidos', () => {
        const result = parseDietText('', 'João', '28/02/2026');
        expect(result.athleteName).toBe('João');
        expect(result.emissionDate).toBe('28/02/2026');
    });

    it('extrai conteúdo dentro da tag <DIETA_PDF> ignorando texto fora', () => {
        const texto = 'Texto introdutório da IA que não deve aparecer.\n<DIETA_PDF>\n## Refeição 1\n- Frango 200g\n</DIETA_PDF>\nTexto final ignorado.';
        const result = parseDietText(texto, 'João', '01/01/2026');
        expect(result.meals.length).toBe(1);
        expect(result.meals[0].title).toContain('Refeição 1');
        // Texto fora da tag não deve estar em headerLines
        expect(result.headerLines.join('')).not.toContain('introdutório');
    });

    it('identifica itens de refeição com bullets de hífen', () => {
        const texto = '<DIETA_PDF>\n## Refeição 1\n- Frango 200g\n- Arroz 100g\n</DIETA_PDF>';
        const result = parseDietText(texto, 'João', '01/01/2026');
        expect(result.meals[0].items).toContain('Frango 200g');
        expect(result.meals[0].items).toContain('Arroz 100g');
    });

    it('identifica itens com bullet de asterisco', () => {
        const texto = '<DIETA_PDF>\n## Refeição 1\n* Ovo 3 unidades\n</DIETA_PDF>';
        const result = parseDietText(texto, 'João', '01/01/2026');
        expect(result.meals[0].items).toContain('Ovo 3 unidades');
    });

    it('identifica totais da refeição por "Total:"', () => {
        const texto = '<DIETA_PDF>\n## Refeição 1\n- Frango 200g\nTotal: 350kcal | P: 40 | C: 10 | G: 8\n</DIETA_PDF>';
        const result = parseDietText(texto, 'João', '01/01/2026');
        expect(result.meals[0].totals).toContain('Total');
        expect(result.meals[0].totals).toContain('350kcal');
    });

    it('identifica totais da refeição por emoji 📊', () => {
        const texto = '<DIETA_PDF>\n## Refeição 1\n- Frango 200g\n📊 Total: 350kcal\n</DIETA_PDF>';
        const result = parseDietText(texto, 'João', '01/01/2026');
        expect(result.meals[0].totals).toContain('Total');
    });

    it('identifica hidratação separadamente', () => {
        const texto = '<DIETA_PDF>\n## Refeição 1\n- Frango 200g\n## Hidratação\nBeba 3L de água por dia\n</DIETA_PDF>';
        const result = parseDietText(texto, 'João', '01/01/2026');
        expect(result.hydration).toBeTruthy();
        expect(result.hydration).toContain('Hidratação');
    });

    it('retorna múltiplas refeições na ordem correta', () => {
        const texto = `<DIETA_PDF>
## Refeição 1 - Café da manhã
- Ovos mexidos 3 unidades
- Pão integral 2 fatias
📊 Total: 350kcal | P: 20 | C: 30 | G: 12
## Refeição 2 - Almoço
- Frango grelhado 200g
- Arroz integral 100g
📊 Total: 500kcal | P: 45 | C: 50 | G: 10
</DIETA_PDF>`;
        const result = parseDietText(texto, 'João', '01/01/2026');
        expect(result.meals.length).toBe(2);
        expect(result.meals[0].title).toContain('Café');
        expect(result.meals[1].title).toContain('Almoço');
    });

    it('headerLines captura texto antes das refeições', () => {
        const texto = `<DIETA_PDF>
**Objetivo:** Ganho de massa muscular
**Calorias totais:** 2500kcal
## Refeição 1
- Ovos
</DIETA_PDF>`;
        const result = parseDietText(texto, 'João', '01/01/2026');
        expect(result.headerLines.length).toBeGreaterThan(0);
        expect(result.headerLines.join(' ')).toContain('Objetivo');
    });

    it('remove asteriscos do título da refeição', () => {
        const texto = '<DIETA_PDF>\n**Refeição 1 - Café**\n- Ovo\n</DIETA_PDF>';
        const result = parseDietText(texto, 'João', '01/01/2026');
        expect(result.meals[0].title).not.toContain('**');
    });
});
