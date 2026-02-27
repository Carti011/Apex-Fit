import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Send, Bot, User, Sparkles, Download, Save, ArrowLeft, ClipboardList } from 'lucide-react';
import { parseDietText } from '../../utils/dietParser';
import DietPdfTemplate from './DietPdfTemplate';

// Renderiza texto inline com **negrito** em verde
const renderInline = (texto, key) => {
    if (!texto.includes('**')) return <span key={key}>{texto}</span>;
    const partes = texto.split('**');
    return (
        <span key={key}>
            {partes.map((p, j) => j % 2 === 1
                ? <strong key={j} style={{ color: '#00ff88' }}>{p}</strong>
                : <span key={j}>{p}</span>)}
        </span>
    );
};

// Formata o texto da IA com markdown completo
const FormatarMensagem = ({ texto }) => {
    // Hide structural tags from the UI chat 
    const textoLimpo = texto.replace(/<\/?DIETA_PDF>/g, '');
    const linhas = textoLimpo.split('\n');
    return (
        <div className="mensagem-conteudo">
            {linhas.map((linha, i) => {
                // --- separador: linha visual elegante
                if (linha.trim() === '---' || linha.trim() === '___' || linha.trim() === '***') {
                    return <div key={i} className="chat-divider" />;
                }
                // #### / ### / ## / # headers
                if (/^#{1,4}\s/.test(linha)) {
                    const nivel = (linha.match(/^#+/) || [''])[0].length;
                    const texto = linha.replace(/^#+\s/, '');
                    const sizes = ['1.1rem', '1.05rem', '1rem', '0.97rem'];
                    return (
                        <p key={i} style={{
                            fontWeight: 700,
                            fontSize: sizes[nivel - 1] || '0.97rem',
                            color: '#00ff88',
                            margin: nivel <= 2 ? '1rem 0 0.3rem' : '0.6rem 0 0.2rem',
                            letterSpacing: '0.01em'
                        }}>
                            {renderInline(texto, i)}
                        </p>
                    );
                }
                // Itens de lista (• - *)
                if (/^[•\-\*] /.test(linha)) {
                    return (
                        <p key={i} style={{ margin: '0.1rem 0 0.1rem 0.8rem', lineHeight: '1.55', display: 'flex', gap: '0.4rem' }}>
                            <span style={{ color: '#00ff88', flexShrink: 0 }}>•</span>
                            {renderInline(linha.slice(2), i)}
                        </p>
                    );
                }
                // Linha vazia
                if (!linha.trim()) return <br key={i} />;
                // Paragrafo normal
                return <p key={i} style={{ margin: '0.15rem 0', lineHeight: '1.6' }}>{renderInline(linha, i)}</p>;
            })}
        </div>
    );
};

const NutritionistChat = ({ dashboardData, onVoltar, onDietaSalva }) => {
    const { user } = useAuth();
    const [mensagens, setMensagens] = useState([]);
    const [inputMsg, setInputMsg] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [ultimaRespostaIA, setUltimaRespostaIA] = useState('');
    const [dietaSalva, setDietaSalva] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const chatFimRef = useRef(null);

    // Mensagem inicial: se ja tem dieta salva, mostra direto do banco (zero tokens)
    // Se nao tem dieta, mostra greeting direto — sem as 3 perguntas (preferencias ja estao no perfil)
    useEffect(() => {
        const get = dashboardData?.nutritionPlan?.get;
        const objetivo = formatarObjetivo(dashboardData?.bioProfile?.goal);
        const nome = user?.name?.split(' ')[0] || 'atleta';
        const dietaSalva = dashboardData?.savedDietPlan;
        const refeicoes = dashboardData?.bioProfile?.numberOfMeals;

        if (dietaSalva) {
            setMensagens([{ role: 'model', text: dietaSalva }]);
        } else {
            const preferenciasStr = refeicoes
                ? `Já li suas preferências: **${refeicoes} refeições** por dia pesadas com os exatos gramas passados logo abaixo.`
                : '';
            const boasVindas = get
                ? `Fala, ${nome}! Sou o APEX, seu nutricionista digital. 🔥\n\n${preferenciasStr}\n\nSeu GET está em **${get} kcal** para o objetivo de **${objetivo}**.\n\nMe diz: tem algo específico que quer na sua dieta? Ou posso gerar a dieta de cara!`
                : `Fala, ${nome}! Sou o APEX, seu nutricionista digital. 🔥\n\nPara montar sua dieta com precisão, preencha seu **Perfil Biológico** na aba Conta. Assim consigo calcular seu GET e criar algo realmente personalizado.\n\nJá voltou? Me chama aqui!`;
            setMensagens([{ role: 'model', text: boasVindas }]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Scroll automático para o fim do chat
    useEffect(() => {
        chatFimRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensagens, carregando]);

    const formatarObjetivo = (goal) => {
        if (!goal) return 'não definido';
        const mapa = { LOSE_WEIGHT: 'Perda de Peso', GAIN_MUSCLE: 'Ganho Muscular', MAINTAIN: 'Manutenção' };
        return mapa[goal] || goal;
    };

    const enviarMensagem = async () => {
        if (!inputMsg.trim() || carregando) return;

        const textoUsuario = inputMsg.trim();
        setInputMsg('');

        // Historico sem a mensagem inicial (eh o system prompt)
        const historicoParaApi = mensagens.slice(1).map(m => ({ role: m.role, text: m.text }));

        setMensagens(prev => [...prev, { role: 'user', text: textoUsuario }]);
        setCarregando(true);
        setDietaSalva(false);

        try {
            const resposta = await api.chatWithNutritionist(user.token, historicoParaApi, textoUsuario);
            const textoResposta = resposta.resposta;
            setMensagens(prev => [...prev, { role: 'model', text: textoResposta }]);
            setUltimaRespostaIA(textoResposta);
        } catch (error) {
            setMensagens(prev => [...prev, {
                role: 'model',
                text: '⚠️ Tive um problema técnico agora. Pode tentar de novo em alguns segundos?'
            }]);
        } finally {
            setCarregando(false);
        }
    };

    const handleSalvarDieta = async () => {
        if (!ultimaRespostaIA) return;
        setSalvando(true);
        try {
            // Salva no banco de dados apenas o que foi gerado dentro das tags <DIETA_PDF>
            let dietaParaSalvar = ultimaRespostaIA;
            if (dietaParaSalvar.includes('<DIETA_PDF>') && dietaParaSalvar.includes('</DIETA_PDF>')) {
                dietaParaSalvar = dietaParaSalvar.split('<DIETA_PDF>')[1].split('</DIETA_PDF>')[0].trim();
            }

            const dadosAtualizados = await api.salvarDieta(user.token, dietaParaSalvar);
            setDietaSalva(true);
            if (onDietaSalva) onDietaSalva(dadosAtualizados);
            setMensagens(prev => [...prev, {
                role: 'model',
                text: '✅ Dieta salva com sucesso! Você pode baixar o PDF quando quiser usando o botão abaixo.'
            }]);
        } catch {
            setMensagens(prev => [...prev, { role: 'model', text: '⚠️ Erro ao salvar dieta. Tenta novamente!' }]);
        } finally {
            setSalvando(false);
        }
    };

    const handleBaixarPdf = async () => {
        const dietaTexto = dashboardData?.savedDietPlan || ultimaRespostaIA;
        if (!dietaTexto) return;

        // Importa html2pdf dinamicamente
        const html2pdf = (await import('html2pdf.js')).default;
        const nome = user?.name || 'Atleta';
        const dataHoje = new Date().toLocaleDateString('pt-BR');

        // 1. Parsing Estruturado
        const parsedData = parseDietText(dietaTexto, nome, dataHoje);

        // Função local pra transformar markdown ** em strong coloridos
        const formatBold = (texto) => {
            if (!texto) return '';
            return texto.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #00ff88; font-weight: 700;">$1</strong>');
        };

        // Header Section (Objetivos e Totais)
        let htmlHeaderLines = '';
        if (parsedData.headerLines && parsedData.headerLines.length > 0) {
            htmlHeaderLines = `<div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-left: 3px solid #38bdf8; border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">`;
            parsedData.headerLines.forEach(linha => {
                htmlHeaderLines += `<p style="margin: 0 0 4px 0; font-size: 0.85rem; line-height: 1.3; color: #e2e8f0;">${formatBold(linha)}</p>`;
            });
            htmlHeaderLines += `</div>`;
        }

        // Widgets de Refeições
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

                htmlMealsGrid += `</div>`; // Fechar card da refeição
            });
        }
        htmlMealsGrid += `</div>`; // Fechar grid

        // Montagem Matemática do Totais Widget (Matemática Legítima baseada apenas na soma das refeições reais)
        let sumKcal = 0, sumP = 0, sumC = 0, sumG = 0;

        const regexKcal = /(\d+)\s*kcal/i;
        const regexProt = /(?:P|Prote[ií]nas?)\s*:\s*(\d+)/i;
        const regexCarb = /(?:C|Carbos?|Carboidratos?)\s*:\s*(\d+)/i;
        const regexGord = /(?:G|Gorduras?)\s*:\s*(\d+)/i;

        // Somando Incondicionalmente as Refeições (Força Bruta)
        if (parsedData.meals) {
            parsedData.meals.forEach(meal => {
                if (meal.totals) {
                    const Kcal = meal.totals.match(regexKcal);
                    const Prots = meal.totals.match(regexProt);
                    const Carbs = meal.totals.match(regexCarb);
                    const Gords = meal.totals.match(regexGord);

                    if (Kcal && Kcal[1]) sumKcal += parseInt(Kcal[1], 10);
                    if (Prots && Prots[1]) sumP += parseInt(Prots[1], 10);
                    if (Carbs && Carbs[1]) sumC += parseInt(Carbs[1], 10);
                    if (Gords && Gords[1]) sumG += parseInt(Gords[1], 10);
                }
            });
        }

        // Se houver algum somatorio, constroi o widget (Bem Compacto com alinhamento horizontal)
        let htmlDailyTotals = '';
        if (sumKcal > 0) {
            htmlDailyTotals = `
                <div style="margin-bottom: 16px; background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 6px; padding: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                    <h3 style="color: #00ff88; margin: 0 0 8px 0; font-size: 0.85rem; text-align: center; border-bottom: 1px dashed rgba(0, 255, 136, 0.15); padding-bottom: 4px;">
                        📊 RESUMO DIÁRIO CALCULADO
                    </h3>
                    <div style="display: flex; justify-content: space-between; gap: 6px;">
                        <!-- KCAL -->
                        <div style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; background: rgba(255, 255, 255, 0.02); border-left: 2px solid #f97316; border-radius: 4px; padding: 6px;">
                            <span style="font-size: 1rem;">🔥</span>
                            <div style="text-align: left;">
                                <strong style="color: #f97316; font-size: 0.85rem; display: block; line-height: 1;">${sumKcal}</strong>
                                <span style="color: #94a3b8; font-size: 0.55rem; text-transform: uppercase;">Kcal</span>
                            </div>
                        </div>
                        <!-- PROTEINA -->
                        <div style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; background: rgba(255, 255, 255, 0.02); border-left: 2px solid #ef4444; border-radius: 4px; padding: 6px;">
                            <span style="font-size: 1rem;">🥩</span>
                            <div style="text-align: left;">
                                <strong style="color: #ef4444; font-size: 0.85rem; display: block; line-height: 1;">${sumP}g</strong>
                                <span style="color: #94a3b8; font-size: 0.55rem; text-transform: uppercase;">Prots</span>
                            </div>
                        </div>
                        <!-- CARBOIDRATO -->
                        <div style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; background: rgba(255, 255, 255, 0.02); border-left: 2px solid #eab308; border-radius: 4px; padding: 6px;">
                            <span style="font-size: 1rem;">🌾</span>
                            <div style="text-align: left;">
                                <strong style="color: #eab308; font-size: 0.85rem; display: block; line-height: 1;">${sumC}g</strong>
                                <span style="color: #94a3b8; font-size: 0.55rem; text-transform: uppercase;">Carbos</span>
                            </div>
                        </div>
                        <!-- GORDURAS -->
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

        // Hidratação
        let htmlHydration = '';
        if (parsedData.hydration) {
            htmlHydration = `
                <div style="margin-top: auto; padding: 12px; background: rgba(56, 189, 248, 0.05); border: 1px dashed rgba(56, 189, 248, 0.3); border-radius: 6px; text-align: center;">
                    <h4 style="color: #38bdf8; margin: 0 0 4px 0; font-size: 0.85rem;">💧 Meta de Hidratação</h4>
                    <p style="margin: 0; font-size: 0.85rem; color: #e2e8f0; font-weight: bold;">${formatBold(parsedData.hydration)}</p>
                </div>
            `;
        }

        // Montagem do Corpo Completo em HTML Estrito (Compatível garantido com html2pdf e múltiplas páginas)
        const htmlConteudo = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #020617; color: #e2e8f0; padding: 24px; box-sizing: border-box; width: 100%; display: flex; flex-direction: column;">
                <!--HEADER BRANDING-->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid rgba(0, 255, 136, 0.3); padding-bottom: 12px; margin-bottom: 16px;">
                    <div>
                        <h1 style="color: #00ff88; font-size: 1.6rem; margin: 0; letter-spacing: 2px; font-weight: 800; text-transform: uppercase;">APEX<span style="color: white;">FIT</span></h1>
                        <p style="color: #94a3b8; font-size: 0.7rem; margin: 2px 0 0; text-transform: uppercase; font-weight: 600;">Nutrição de Alta Performance</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="margin: 0 0 2px 0; font-size: 0.75rem; color: #e2e8f0;"><strong style="color: #00ff88;">Atleta:</strong> ${nome}</p>
                        <p style="margin: 0; font-size: 0.7rem; color: #94a3b8;"><strong style="color: #00ff88;">Emissão:</strong> ${dataHoje}</p>
                    </div>
                </div>

                ${htmlHeaderLines}
                ${htmlDailyTotals}
                ${htmlMealsGrid}
                ${htmlHydration}

                <!--FOOTER -->
                <div style="margin-top: 20px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 12px;">
                    <p style="color: #64748b; font-size: 0.65rem; margin: 0; letter-spacing: 1px;">GERADO POR APEX FIT IA — NUTRIÇÃO DIGITAL AVANÇADA</p>
                </div>
            </div>
        `;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = htmlConteudo;

        const opcoes = {
            margin: 0,
            filename: `apex-fit-dieta-${nome.toLowerCase().replace(/\s+/g, '-')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, backgroundColor: '#020617', useCORS: true, windowWidth: 800 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'] }
        };

        html2pdf().set(opcoes).from(wrapper).save();
    };

    const podeSalvarDieta = ultimaRespostaIA.length > 200 && !dietaSalva;
    const podeBaixarPdf = dietaSalva || dashboardData?.savedDietPlan;

    return (
        <div className="nutritionist-chat-container fade-in">
            {/* Cabecalho */}
            <div className="chat-header glass">
                <button className="chat-back-btn" onClick={onVoltar} title="Voltar">
                    <ArrowLeft size={18} />
                </button>
                <div className="chat-avatar-ia">
                    <Bot size={22} />
                </div>
                <div>
                    <h3 className="chat-title">APEX — Nutricionista Digital</h3>
                    <span className="chat-status">🟢 Online</span>
                </div>
            </div>

            {/* Area de mensagens */}
            <div className="chat-messages">
                {mensagens.map((msg, i) => (
                    <div key={i} className={`chat - bubble - wrapper ${msg.role === 'user' ? 'user' : 'ia'} `}>
                        <div className="chat-bubble-icon">
                            {msg.role === 'user'
                                ? <User size={16} />
                                : <Bot size={16} />}
                        </div>
                        <div className={`chat - bubble ${msg.role === 'user' ? 'bubble-user' : 'bubble-ia'} `}>
                            <FormatarMensagem texto={msg.text} />
                        </div>
                    </div>
                ))}

                {/* Indicador de digitando */}
                {carregando && (
                    <div className="chat-bubble-wrapper ia">
                        <div className="chat-bubble-icon"><Bot size={16} /></div>
                        <div className="chat-bubble bubble-ia typing-indicator">
                            <span /><span /><span />
                        </div>
                    </div>
                )}
                <div ref={chatFimRef} />
            </div>

            {/* Botoes de acao (Salvar Dieta / Baixar PDF) */}
            {(podeSalvarDieta || podeBaixarPdf) && (
                <div className="chat-actions">
                    {podeSalvarDieta && (
                        <button
                            className="chat-action-btn save-btn"
                            onClick={handleSalvarDieta}
                            disabled={salvando}
                        >
                            <Save size={16} />
                            {salvando ? 'Salvando...' : 'Salvar Dieta'}
                        </button>
                    )}
                    {podeBaixarPdf && (
                        <button className="chat-action-btn pdf-btn" onClick={handleBaixarPdf}>
                            <Download size={16} />
                            Baixar PDF
                        </button>
                    )}
                </div>
            )}

            {/* Input de mensagem */}
            <div className="chat-input-area glass">
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Escreva sua mensagem..."
                    value={inputMsg}
                    onChange={e => setInputMsg(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && enviarMensagem()}
                    disabled={carregando}
                />
                <button
                    className="chat-send-btn"
                    onClick={enviarMensagem}
                    disabled={carregando || !inputMsg.trim()}
                    title="Enviar"
                >
                    {carregando ? <Sparkles size={20} className="spin" /> : <Send size={20} />}
                </button>
            </div>
        </div>
    );
};

export default NutritionistChat;
