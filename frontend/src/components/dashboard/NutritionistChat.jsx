import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Send, Bot, User, Sparkles, Download, Save, ArrowLeft } from 'lucide-react';
import { gerarPdfDieta } from '../../services/pdfBuilder';

// Renderiza texto inline com **negrito** e glow suave
const renderInline = (texto, key) => {
    if (!texto.includes('**')) return <span key={key}>{texto}</span>;
    const partes = texto.split('**');
    return (
        <span key={key}>
            {partes.map((p, j) => j % 2 === 1
                ? <strong key={j} style={{ color: '#00ff88', textShadow: '0 0 8px rgba(0, 255, 136, 0.4)', fontWeight: 700 }}>{p}</strong>
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
        <div className="mensagem-conteudo" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {linhas.map((linha, i) => {
                // --- separador: linha visual elegante
                if (linha.trim() === '---' || linha.trim() === '___' || linha.trim() === '***') {
                    return <div key={i} className="chat-divider" />;
                }
                // #### / ### / ## / # headers
                if (/^#{1,4}\s/.test(linha)) {
                    const nivel = (linha.match(/^#+/) || [''])[0].length;
                    const texto = linha.replace(/^#+\s/, '');
                    const sizes = ['1.15rem', '1.1rem', '1.05rem', '1rem'];
                    return (
                        <p key={i} style={{
                            fontWeight: 800,
                            fontSize: sizes[nivel - 1] || '1rem',
                            color: '#00ff88',
                            margin: nivel <= 2 ? '1.2rem 0 0.4rem' : '0.8rem 0 0.3rem',
                            letterSpacing: '0.02em',
                            textTransform: nivel <= 2 ? 'uppercase' : 'none'
                        }}>
                            {renderInline(texto, i)}
                        </p>
                    );
                }
                // Itens de lista (• - *)
                if (/^[•\-\*] /.test(linha)) {
                    return (
                        <div key={i} style={{ margin: '0.2rem 0 0.2rem 0.6rem', lineHeight: '1.6', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                            <span style={{ color: '#00ff88', flexShrink: 0, marginTop: '2px', fontSize: '1.1rem' }}>•</span>
                            <div style={{ flex: 1 }}>{renderInline(linha.slice(2), i)}</div>
                        </div>
                    );
                }
                // Linha vazia
                if (!linha.trim()) return null; // evita <br> extras criando vãos enormes
                // Paragrafo normal
                return <p key={i} style={{ margin: '0', lineHeight: '1.65', color: 'rgba(255, 255, 255, 0.95)' }}>{renderInline(linha, i)}</p>;
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

        // Historico sem a mensagem inicial (greeting local, nao vai para API)
        const historicoParaApi = mensagens.slice(1).map(m => ({ role: m.role, text: m.text }));

        setMensagens(prev => [...prev, { role: 'user', text: textoUsuario }]);
        setCarregando(true);
        setDietaSalva(false);

        try {
            const data = await api.chatWithNutritionist(user.token, historicoParaApi, textoUsuario);
            setMensagens(prev => [...prev, { role: 'model', text: data.resposta }]);
            setUltimaRespostaIA(data.resposta);
        } catch {
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
        let dietaTexto = dashboardData?.savedDietPlan;
        if (ultimaRespostaIA && ultimaRespostaIA.includes('<DIETA_PDF>')) {
            dietaTexto = ultimaRespostaIA;
        }
        if (!dietaTexto) return;

        const nome = user?.name || 'Atleta';
        const dataHoje = new Date().toLocaleDateString('pt-BR');
        await gerarPdfDieta(dietaTexto, nome, dataHoje);
    };

    const temTagDieta = ultimaRespostaIA.includes('<DIETA_PDF>') && ultimaRespostaIA.includes('</DIETA_PDF>');
    const podeSalvarDieta = temTagDieta && !dietaSalva;
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
                    <div key={i} className={`chat-bubble-wrapper ${msg.role === 'user' ? 'user' : 'ia'}`}>
                        <div className="chat-bubble-icon">
                            {msg.role === 'user'
                                ? <User size={16} />
                                : <Bot size={16} />}
                        </div>
                        <div className={`chat-bubble ${msg.role === 'user' ? 'bubble-user' : 'bubble-ia'}`}>
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
