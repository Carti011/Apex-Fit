import { parseDietText } from '../utils/dietParser';

// Converte **negrito** em <strong> colorido para o HTML do PDF
const formatBold = (texto) => {
    if (!texto) return '';
    return texto.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #00ff88; font-weight: 700;">$1</strong>');
};

/**
 * Gera e baixa o PDF da dieta do usuário.
 * @param {string} dietaTexto - Texto bruto da dieta (pode conter tags <DIETA_PDF>)
 * @param {string} nome       - Nome do atleta
 * @param {string} dataHoje   - Data de emissão formatada (ex: "28/02/2026")
 */
export async function gerarPdfDieta(dietaTexto, nome, dataHoje) {
    const html2pdf = (await import('html2pdf.js')).default;
    const parsedData = parseDietText(dietaTexto, nome, dataHoje);

    // Seção de cabeçalho (objetivos e totais textuais)
    let htmlHeaderLines = '';
    if (parsedData.headerLines && parsedData.headerLines.length > 0) {
        htmlHeaderLines = `<div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-left: 3px solid #38bdf8; border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">`;
        parsedData.headerLines.forEach(linha => {
            htmlHeaderLines += `<p style="margin: 0 0 4px 0; font-size: 0.85rem; line-height: 1.3; color: #e2e8f0;">${formatBold(linha)}</p>`;
        });
        htmlHeaderLines += `</div>`;
    }

    // Grid de cards de refeições
    let htmlMealsGrid = `<div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: stretch; justify-content: space-between;">`;
    if (parsedData.meals) {
        parsedData.meals.forEach(meal => {
            htmlMealsGrid += `
                <div style="page-break-inside: avoid; page-break-after: auto; width: calc(50% - 6px); background: #0f172a; border: 1px solid rgba(0, 255, 136, 0.15); border-top: 2px solid #00ff88; border-radius: 8px; padding: 10px 12px; box-sizing: border-box; box-shadow: 0 3px 8px rgba(0,0,0,0.2); margin-bottom: 14px;">
                    <h3 style="color: #00ff88; margin: 0 0 8px 0; font-size: 0.95rem; border-bottom: 1px dashed rgba(0, 255, 136, 0.2); padding-bottom: 4px;">
                        ${formatBold(meal.title)}
                    </h3>
                    <div style="margin-bottom: 8px;">
            `;

            if (meal.items) {
                meal.items.forEach(item => {
                    htmlMealsGrid += `
                        <div style="display: flex; align-items: flex-start; margin-bottom: 4px; font-size: 0.75rem; color: #cbd5e1; line-height: 1.2;">
                            <span style="color: #00ff88; margin-right: 4px; font-size: 0.9rem; line-height: 1;">•</span>
                            <span>${formatBold(item)}</span>
                        </div>
                    `;
                });
            }

            htmlMealsGrid += `</div>`;

            if (meal.totals) {
                htmlMealsGrid += `
                    <div style="margin-top: auto; padding-top: 6px; border-top: 1px solid rgba(255, 255, 255, 0.05); font-weight: 600; color: #38bdf8; font-size: 0.75rem;">
                        ${formatBold(meal.totals)}
                    </div>
                `;
            }

            htmlMealsGrid += `</div>`;
        });
    }
    htmlMealsGrid += `</div>`;

    // Cálculo dos totais diários somando as refeições
    let sumKcal = 0, sumP = 0, sumC = 0, sumG = 0;
    const regexKcal = /(\d+)\s*kcal/i;
    const regexProt = /(?:P|Prote[ií]nas?)\s*:\s*(\d+)/i;
    const regexCarb = /(?:C|Carbos?|Carboidratos?)\s*:\s*(\d+)/i;
    const regexGord = /(?:G|Gorduras?)\s*:\s*(\d+)/i;

    if (parsedData.meals) {
        parsedData.meals.forEach(meal => {
            if (meal.totals) {
                const Kcal = meal.totals.match(regexKcal);
                const Prots = meal.totals.match(regexProt);
                const Carbs = meal.totals.match(regexCarb);
                const Gords = meal.totals.match(regexGord);
                if (Kcal) sumKcal += parseInt(Kcal[1], 10);
                if (Prots) sumP += parseInt(Prots[1], 10);
                if (Carbs) sumC += parseInt(Carbs[1], 10);
                if (Gords) sumG += parseInt(Gords[1], 10);
            }
        });
    }

    // Widget de resumo diário (só renderiza se houver dados)
    let htmlDailyTotals = '';
    if (sumKcal > 0) {
        htmlDailyTotals = `
            <div style="margin-bottom: 24px; background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 6px; padding: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                <h3 style="color: #00ff88; margin: 0 0 8px 0; font-size: 0.85rem; text-align: center; border-bottom: 1px dashed rgba(0, 255, 136, 0.15); padding-bottom: 4px;">
                    📊 RESUMO DIÁRIO CALCULADO
                </h3>
                <div style="display: flex; justify-content: space-between; gap: 6px;">
                    <div style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; background: rgba(255, 255, 255, 0.02); border-left: 2px solid #f97316; border-radius: 4px; padding: 6px;">
                        <span style="font-size: 1rem;">🔥</span>
                        <div style="text-align: left;">
                            <strong style="color: #f97316; font-size: 0.85rem; display: block; line-height: 1;">${sumKcal}</strong>
                            <span style="color: #94a3b8; font-size: 0.55rem; text-transform: uppercase;">Kcal</span>
                        </div>
                    </div>
                    <div style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; background: rgba(255, 255, 255, 0.02); border-left: 2px solid #ef4444; border-radius: 4px; padding: 6px;">
                        <span style="font-size: 1rem;">🥩</span>
                        <div style="text-align: left;">
                            <strong style="color: #ef4444; font-size: 0.85rem; display: block; line-height: 1;">${sumP}g</strong>
                            <span style="color: #94a3b8; font-size: 0.55rem; text-transform: uppercase;">Prots</span>
                        </div>
                    </div>
                    <div style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; background: rgba(255, 255, 255, 0.02); border-left: 2px solid #eab308; border-radius: 4px; padding: 6px;">
                        <span style="font-size: 1rem;">🌾</span>
                        <div style="text-align: left;">
                            <strong style="color: #eab308; font-size: 0.85rem; display: block; line-height: 1;">${sumC}g</strong>
                            <span style="color: #94a3b8; font-size: 0.55rem; text-transform: uppercase;">Carbos</span>
                        </div>
                    </div>
                    <div style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; background: rgba(255, 255, 255, 0.02); border-left: 2px solid #14b8a6; border-radius: 4px; padding: 6px;">
                        <span style="font-size: 1rem;">🥑</span>
                        <div style="text-align: left;">
                            <strong style="color: #14b8a6; font-size: 0.85rem; display: block; line-height: 1;">${sumG}g</strong>
                            <span style="color: #94a3b8; font-size: 0.55rem; text-transform: uppercase;">Gords</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Seção de hidratação
    let htmlHydration = '';
    if (parsedData.hydration) {
        htmlHydration = `
            <div style="margin-top: 24px; padding: 12px; background: rgba(56, 189, 248, 0.05); border: 1px dashed rgba(56, 189, 248, 0.3); border-radius: 6px; text-align: center;">
                <h4 style="color: #38bdf8; margin: 0 0 4px 0; font-size: 0.85rem;">💧 Meta de Hidratação</h4>
                <p style="margin: 0; font-size: 0.85rem; color: #e2e8f0; font-weight: bold;">${formatBold(parsedData.hydration)}</p>
            </div>
        `;
    }

    // Montagem do HTML final
    const htmlConteudo = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #020617; color: #e2e8f0; padding: 32px 24px; box-sizing: border-box; width: 100%; min-height: 1100px; display: flex; flex-direction: column;">
            <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid rgba(0, 255, 136, 0.3); padding-bottom: 12px; margin-bottom: 16px;">
                    <div>
                        <h1 style="color: #00ff88; font-size: 1.8rem; margin: 0; letter-spacing: 2px; font-weight: 800; text-transform: uppercase;">APEX<span style="color: white;">FIT</span></h1>
                        <p style="color: #94a3b8; font-size: 0.75rem; margin: 2px 0 0; text-transform: uppercase; font-weight: 600;">Nutrição de Alta Performance</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="margin: 0 0 2px 0; font-size: 0.8rem; color: #e2e8f0;"><strong style="color: #00ff88;">Atleta:</strong> ${nome}</p>
                        <p style="margin: 0; font-size: 0.75rem; color: #94a3b8;"><strong style="color: #00ff88;">Emissão:</strong> ${dataHoje}</p>
                    </div>
                </div>
                ${htmlHeaderLines}
                ${htmlDailyTotals}
            </div>
            <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: space-around;">
                ${htmlMealsGrid}
            </div>
            <div style="margin-top: auto;">
                ${htmlHydration}
                <div style="margin-top: 24px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 16px;">
                    <p style="color: #64748b; font-size: 0.7rem; margin: 0; letter-spacing: 1px;">GERADO POR APEX FIT IA — NUTRIÇÃO DIGITAL AVANÇADA</p>
                </div>
            </div>
        </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = htmlConteudo;

    const opcoes = {
        margin: 0,
        filename: `apex-fit-dieta-${nome.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 2, backgroundColor: '#020617', useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opcoes).from(wrapper).save();
}
