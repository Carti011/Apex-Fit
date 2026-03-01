import { parseDietText } from '../utils/dietParser';

// Formata **negrito** em HTML colorido
const fmt = (t) => {
    if (!t) return '';
    return t.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#00ff88;font-weight:700;">$1</strong>');
};

// Divisor visual de seção: LABEL ────────────────────→
const divSection = (label, cor = '#00ff88', rgbaFade = 'rgba(0,255,136,0.22)') => `
    <div style="display:flex;align-items:center;gap:10px;margin:13px 0 7px 0;">
        <span style="font-size:0.58rem;font-weight:800;letter-spacing:2.5px;color:${cor};text-transform:uppercase;white-space:nowrap;">${label}</span>
        <div style="height:1px;flex:1;background:linear-gradient(90deg,${rgbaFade},transparent);"></div>
    </div>
`;

// Card de refeição individual
const renderCardRefeicao = (meal, num) => {
    const itens = meal.items
        ? meal.items.map(item => `
            <div style="display:flex;align-items:flex-start;margin-bottom:3px;font-size:0.7rem;color:#cbd5e1;line-height:1.3;">
                <span style="color:#00ff88;margin-right:4px;font-size:0.76rem;line-height:1.3;flex-shrink:0;">›</span>
                <span>${fmt(item)}</span>
            </div>`).join('')
        : '';

    const totalTexto = meal.totals ? meal.totals.replace(/^[\u{1F4CA}\s]+/u, '').trim() : '';
    const total = totalTexto ? `
        <div style="margin-top:7px;padding:4px 8px;background:rgba(0,255,136,0.06);border:1px solid rgba(0,255,136,0.14);border-radius:6px;font-size:0.67rem;color:#38bdf8;font-weight:600;letter-spacing:0.3px;text-align:center;">
            📊 ${totalTexto}
        </div>` : '';

    return `
        <div style="page-break-inside:avoid;width:calc(50% - 5px);background:#080f1e;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:9px;box-sizing:border-box;margin-bottom:7px;display:flex;flex-direction:column;">
            <div style="display:flex;align-items:center;gap:7px;margin-bottom:7px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.05);">
                <div style="width:20px;height:20px;border-radius:50%;background:rgba(0,255,136,0.12);border:1px solid rgba(0,255,136,0.3);display:flex;align-items:center;justify-content:center;font-size:0.62rem;color:#00ff88;font-weight:800;flex-shrink:0;">${num}</div>
                <h3 style="color:#f1f5f9;margin:0;font-size:0.8rem;font-weight:700;line-height:1.2;">${fmt(meal.title)}</h3>
            </div>
            <div style="flex:1;">${itens}</div>
            ${total}
        </div>`;
};

/**
 * Gera e baixa o PDF da dieta do usuário.
 * @param {string} dietaTexto - Texto bruto da dieta (pode conter tags <DIETA_PDF>)
 * @param {string} nome       - Nome do atleta
 * @param {string} dataHoje   - Data de emissão formatada (ex: "28/02/2026")
 */
export async function gerarPdfDieta(dietaTexto, nome, dataHoje) {
    const html2pdf = (await import('html2pdf.js')).default;
    const d = parseDietText(dietaTexto, nome, dataHoje);

    // ── Cabeçalho ──────────────────────────────────────────────
    const htmlHeader = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:11px;margin-bottom:2px;border-bottom:1px solid rgba(0,255,136,0.18);">
            <div>
                <h1 style="color:#00ff88;font-size:1.65rem;margin:0;letter-spacing:3px;font-weight:900;text-transform:uppercase;line-height:1;">APEX<span style="color:white;">FIT</span></h1>
                <p style="color:#475569;font-size:0.58rem;margin:4px 0 0;text-transform:uppercase;letter-spacing:2.5px;font-weight:600;">Nutrição de Alta Performance</p>
            </div>
            <div style="text-align:right;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:9px;padding:7px 12px;">
                <p style="margin:0 0 3px 0;font-size:0.75rem;color:#f1f5f9;">
                    <span style="color:#94a3b8;font-size:0.62rem;text-transform:uppercase;letter-spacing:1px;">Atleta </span>
                    <strong style="color:#00ff88;">${nome}</strong>
                </p>
                <p style="margin:0;font-size:0.65rem;color:#64748b;letter-spacing:0.5px;">
                    <span style="text-transform:uppercase;letter-spacing:1px;">Emissão </span>${dataHoje}
                </p>
            </div>
        </div>
    `;

    // ── Protocolo Nutricional (header lines da IA) ──────────────
    let htmlProtocolo = '';
    if (d.headerLines && d.headerLines.length > 0) {
        const linhas = d.headerLines
            .filter(l => l.trim())
            .map(l => `<p style="margin:0 0 5px 0;font-size:0.8rem;line-height:1.45;color:#cbd5e1;">${fmt(l)}</p>`)
            .join('');
        htmlProtocolo = `
            ${divSection('Protocolo Nutricional', '#38bdf8', 'rgba(56,189,248,0.22)')}
            <div style="background:rgba(56,189,248,0.04);border:1px solid rgba(56,189,248,0.12);border-left:3px solid #38bdf8;border-radius:8px;padding:12px 15px;">
                ${linhas}
            </div>
        `;
    }

    // ── Resumo diário (soma das refeições) ──────────────────────
    let sumKcal = 0, sumP = 0, sumC = 0, sumG = 0;
    if (d.meals) {
        d.meals.forEach(meal => {
            if (!meal.totals) return;
            const mKcal = meal.totals.match(/(\d+)\s*kcal/i);
            const mProt = meal.totals.match(/(?:P|Prote[ií]nas?)\s*:\s*(\d+)/i);
            const mCarb = meal.totals.match(/(?:C|Carbos?|Carboidratos?)\s*:\s*(\d+)/i);
            const mGord = meal.totals.match(/(?:G|Gorduras?)\s*:\s*(\d+)/i);
            if (mKcal) sumKcal += parseInt(mKcal[1], 10);
            if (mProt)  sumP    += parseInt(mProt[1], 10);
            if (mCarb)  sumC    += parseInt(mCarb[1], 10);
            if (mGord)  sumG    += parseInt(mGord[1], 10);
        });
    }

    let htmlResumo = '';
    if (sumKcal > 0) {
        const macros = [
            { valor: sumKcal, unidade: 'kcal', label: 'Calorias', emoji: '🔥', cor: '#f97316', bg: 'rgba(249,115,22,0.07)' },
            { valor: `${sumP}g`, unidade: '', label: 'Proteínas', emoji: '🥩', cor: '#ef4444', bg: 'rgba(239,68,68,0.07)' },
            { valor: `${sumC}g`, unidade: '', label: 'Carboidratos', emoji: '🌾', cor: '#eab308', bg: 'rgba(234,179,8,0.07)' },
            { valor: `${sumG}g`, unidade: '', label: 'Gorduras', emoji: '🥑', cor: '#14b8a6', bg: 'rgba(20,184,166,0.07)' },
        ];

        const widgets = macros.map(m => `
            <div style="flex:1;background:${m.bg};border:1px solid rgba(255,255,255,0.05);border-top:3px solid ${m.cor};border-radius:9px;padding:8px 6px;text-align:center;box-sizing:border-box;">
                <div style="font-size:1rem;margin-bottom:4px;">${m.emoji}</div>
                <div style="font-size:0.95rem;font-weight:800;color:${m.cor};line-height:1;margin-bottom:3px;">${m.valor}</div>
                <div style="font-size:0.55rem;color:#64748b;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">${m.label}</div>
            </div>`).join('');

        htmlResumo = `
            ${divSection('Resumo Diário')}
            <div style="display:flex;gap:8px;">${widgets}</div>
        `;
    }

    // ── Grid de refeições ───────────────────────────────────────
    let htmlRefeicoes = '';
    if (d.meals && d.meals.length > 0) {
        const rows = [];
        for (let i = 0; i < d.meals.length; i += 2) {
            const card1 = renderCardRefeicao(d.meals[i], i + 1);
            const card2 = i + 1 < d.meals.length
                ? renderCardRefeicao(d.meals[i + 1], i + 2)
                : '<div style="width:calc(50% - 5px);"></div>';
            rows.push(`<div style="display:flex;gap:10px;align-items:flex-start;">${card1}${card2}</div>`);
        }
        htmlRefeicoes = `
            ${divSection('Plano de Refeições')}
            ${rows.join('')}
        `;
    }

    // ── Hidratação ──────────────────────────────────────────────
    let htmlHidratacao = '';
    if (d.hydration) {
        htmlHidratacao = `
            ${divSection('Hidratação', '#38bdf8', 'rgba(56,189,248,0.22)')}
            <div style="display:flex;align-items:center;gap:10px;background:rgba(56,189,248,0.04);border:1px solid rgba(56,189,248,0.14);border-radius:9px;padding:8px 13px;">
                <span style="font-size:1.2rem;flex-shrink:0;">💧</span>
                <p style="margin:0;font-size:0.8rem;color:#e2e8f0;font-weight:600;">${fmt(d.hydration)}</p>
            </div>
        `;
    }

    // ── Footer ──────────────────────────────────────────────────
    const htmlFooter = `
        <div style="margin-top:14px;">
            <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);margin-bottom:8px;"></div>
            <p style="color:#1e293b;font-size:0.6rem;margin:0;letter-spacing:2px;text-align:center;text-transform:uppercase;font-weight:600;">Gerado por Apex Fit IA — Nutrição Digital Avançada</p>
        </div>
    `;

    // ── Wrapper principal ───────────────────────────────────────
    const htmlFinal = `
        <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#020617;color:#e2e8f0;box-sizing:border-box;width:100%;">
            <!-- Barra gradiente topo: full-width -->
            <div style="height:4px;background:linear-gradient(90deg,#00ff88 0%,#38bdf8 55%,#a78bfa 100%);"></div>
            <!-- Conteúdo com padding -->
            <div style="padding:16px 24px 14px;box-sizing:border-box;">
                ${htmlHeader}
                ${htmlProtocolo}
                ${htmlResumo}
                ${htmlRefeicoes}
                ${htmlHidratacao}
                ${htmlFooter}
            </div>
        </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = htmlFinal;

    const opcoes = {
        margin: 0,
        filename: `apex-fit-dieta-${nome.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 2, backgroundColor: '#020617', useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opcoes).from(wrapper).save();
}
