import { useState } from 'react';
import { Apple, Battery, Flame, FileText, Settings2, ChevronDown, ChevronUp, Save } from 'lucide-react';
import NutritionistChat from './NutritionistChat';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const NutritionPlan = ({ nutrition, dashboardData, onDietaSalva, onChatOpen, onChatClose }) => {
    const { user } = useAuth();
    const [mostrarChat, setMostrarChat] = useState(false);
    const [prefAberto, setPrefAberto] = useState(false);
    const [salvandoPref, setSalvandoPref] = useState(false);
    const [feedbackPref, setFeedbackPref] = useState('');

    // Preferências vindas do perfil (já salvas no banco)
    const bioProfile = dashboardData?.bioProfile;
    const [prefs, setPrefs] = useState({
        dietaryRestrictions: bioProfile?.dietaryRestrictions || '',
        foodDislikes: bioProfile?.foodDislikes || '',
        foodFavorites: bioProfile?.foodFavorites || '',
        numberOfMeals: bioProfile?.numberOfMeals || ''
    });

    const setPref = (field, value) => setPrefs(prev => ({ ...prev, [field]: value }));

    // O chat só aparece se numberOfMeals estiver preenchido
    const prefsCompletas = !!prefs.numberOfMeals;

    const salvarPrefs = async (e) => {
        e.preventDefault();
        setSalvandoPref(true);
        setFeedbackPref('');
        try {
            const payload = {
                // Campos biométricos obrigatórios (mantém o que já existe)
                birthDate: bioProfile?.birthDate || null,
                weight: bioProfile?.weight || null,
                height: bioProfile?.height || null,
                gender: bioProfile?.gender || null,
                bodyFatPercentage: bioProfile?.bodyFatPercentage || null,
                activityLevel: bioProfile?.activityLevel || null,
                goal: bioProfile?.goal || null,
                // Preferências de dieta (novos campos)
                dietaryRestrictions: prefs.dietaryRestrictions,
                foodDislikes: prefs.foodDislikes,
                foodFavorites: prefs.foodFavorites,
                numberOfMeals: prefs.numberOfMeals ? parseInt(prefs.numberOfMeals) : null
            };
            const dadosAtualizados = await api.updateBioProfile(user.token, payload);
            if (onDietaSalva) onDietaSalva(dadosAtualizados);
            setFeedbackPref('✅ Preferências salvas!');
            setPrefAberto(false); // recolhe o painel após salvar
            setTimeout(() => setFeedbackPref(''), 3000);
        } catch {
            setFeedbackPref('⚠️ Erro ao salvar.');
        } finally {
            setSalvandoPref(false);
        }
    };

    const abrirChat = () => {
        setMostrarChat(true);
        if (onChatOpen) onChatOpen();
    };

    const fecharChat = () => {
        setMostrarChat(false);
        if (onChatClose) onChatClose();
    };

    if (!nutrition) {
        return (
            <div className="fade-in glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <h3>⚠️ Perfil Incompleto</h3>
                <p>Preencha seus dados na aba <b>Conta</b> para gerarmos seu cálculo metabólico e nutricional.</p>
            </div>
        );
    }

    if (mostrarChat) {
        return (
            <NutritionistChat
                dashboardData={dashboardData}
                onVoltar={fecharChat}
                onDietaSalva={(dados) => {
                    if (onDietaSalva) onDietaSalva(dados);
                }}
            />
        );
    }

    return (
        <div className="fade-in">
            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                Plano Nutricional <span className="highlight">Inteligente</span>
            </h2>

            {/* Cards de TMB e GET */}
            <div className="grid-features" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', marginBottom: '2rem' }}>
                <div className="stat-card glass">
                    <div className="stat-header">
                        <span className="stat-label">Taxa Metabólica Basal</span>
                        <Battery size={20} className="highlight" />
                    </div>
                    <div className="stat-value">{nutrition.tmb} <span className="stat-unit">kcal</span></div>
                    <div className="stat-sub">Gasto em repouso</div>
                </div>

                <div className="stat-card glass">
                    <div className="stat-header">
                        <span className="stat-label">Gasto Total (GET)</span>
                        <Flame size={20} className="highlight" />
                    </div>
                    <div className="stat-value">{nutrition.get} <span className="stat-unit">kcal</span></div>
                    <div className="stat-sub">Para o seu objetivo</div>
                </div>
            </div>

            {/* Macros */}
            <div className="glass" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Apple size={20} className="highlight" />
                    Macros Sugeridos
                </h3>
                <div className="macros-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                    <div className="macro-item">
                        <div className="macro-val" style={{ color: '#00ff88', fontSize: '1.25rem', fontWeight: 'bold' }}>{nutrition.protein}g</div>
                        <div className="macro-label" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Proteína</div>
                    </div>
                    <div className="macro-item">
                        <div className="macro-val" style={{ color: '#00ff88', fontSize: '1.25rem', fontWeight: 'bold' }}>{nutrition.carbs}g</div>
                        <div className="macro-label" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Carbo</div>
                    </div>
                    <div className="macro-item">
                        <div className="macro-val" style={{ color: '#00ff88', fontSize: '1.25rem', fontWeight: 'bold' }}>{nutrition.fats}g</div>
                        <div className="macro-label" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Gordura</div>
                    </div>
                </div>
            </div>

            {/* ========================= */}
            {/* Formulario de Preferencias */}
            {/* ========================= */}
            <div className="glass" style={{ marginBottom: '1.5rem', borderColor: prefsCompletas ? 'rgba(0,255,136,0.2)' : 'rgba(255,200,0,0.2)' }}>
                <button
                    className="diet-pref-toggle"
                    onClick={() => setPrefAberto(v => !v)}
                    type="button"
                >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Settings2 size={18} style={{ color: prefsCompletas ? '#00ff88' : '#fbbf24' }} />
                        <span>Preferências da sua Dieta</span>
                        {!prefsCompletas && <span className="pref-badge">Necessário</span>}
                        {prefsCompletas && <span className="pref-badge ok">✓ Preenchido</span>}
                    </span>
                    {prefAberto ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {prefAberto && (
                    <form className="diet-pref-form" onSubmit={salvarPrefs}>
                        <p className="diet-pref-desc">
                            Essas preferências são salvas no seu perfil e informam o APEX antes de montar qualquer dieta.
                            Sem elas, o chat não estará disponível.
                        </p>

                        {/* Numero de refeicoes */}
                        <div className="diet-pref-group">
                            <label>🍽️ Refeições por dia</label>
                            <div className="diet-pref-pills">
                                {[3, 4, 5, 6].map(n => (
                                    <button
                                        key={n}
                                        type="button"
                                        className={`diet-pill${prefs.numberOfMeals == n ? ' selected' : ''}`}
                                        onClick={() => setPref('numberOfMeals', n)}
                                    >
                                        {n}x
                                    </button>
                                ))}
                            </div>
                        </div>


                        {/* Restricoes */}
                        <div className="diet-pref-group">
                            <label>🚫 Restrições / alergias <span className="pref-opt">(opcional)</span></label>
                            <textarea
                                className="diet-pref-textarea"
                                placeholder="Ex: sou intolerante a lactose, alérgico a amendoim..."
                                value={prefs.dietaryRestrictions}
                                onChange={e => setPref('dietaryRestrictions', e.target.value)}
                                rows={2}
                            />
                        </div>

                        {/* Aversoes */}
                        <div className="diet-pref-group">
                            <label>😣 Alimentos que não gosta <span className="pref-opt">(opcional)</span></label>
                            <textarea
                                className="diet-pref-textarea"
                                placeholder="Ex: não gosto de fígado, brócolis, peixe..."
                                value={prefs.foodDislikes}
                                onChange={e => setPref('foodDislikes', e.target.value)}
                                rows={2}
                            />
                        </div>

                        {/* Favoritos / ancora */}
                        <div className="diet-pref-group">
                            <label>❤️ Alimentos que ama / quer incluir <span className="pref-opt">(opcional)</span></label>
                            <textarea
                                className="diet-pref-textarea"
                                placeholder="Ex: hambúrguer no almoço todo dia, ovos mexidos no café, sorvete à noite..."
                                value={prefs.foodFavorites}
                                onChange={e => setPref('foodFavorites', e.target.value)}
                                rows={2}
                            />
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
                                💡 O APEX vai montar a dieta em volta desses alimentos — encaixando os macros sem abrir mão do que você ama.
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                            <button
                                type="submit"
                                className="apex-cta-btn"
                                disabled={salvandoPref || !prefs.numberOfMeals}
                            >
                                <Save size={16} />
                                {salvandoPref ? 'Salvando...' : 'Salvar Preferências'}
                            </button>
                            {feedbackPref && <span style={{ fontSize: '0.9rem', color: feedbackPref.startsWith('✅') ? '#00ff88' : '#ff4d4d' }}>{feedbackPref}</span>}
                        </div>
                    </form>
                )}
            </div>

            {/* ========================= */}
            {/* CTA do APEX               */}
            {/* (só aparece se prefs ok)  */}
            {/* ========================= */}
            {prefsCompletas ? (
                dashboardData?.savedDietPlan ? (
                    <div className="glass" style={{ padding: '1.5rem', borderColor: 'rgba(0,255,136,0.2)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#00ff88' }}>
                            <FileText size={18} />
                            Sua Última Dieta Personalizada
                        </h3>
                        <button className="apex-cta-btn" onClick={abrirChat}>
                            <span className="apex-cta-btn-emoji">💬</span>
                            Atualizar com o APEX
                        </button>
                    </div>
                ) : (
                    <div className="glass cta-nutricionista" style={{ padding: '2rem', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>Quer uma dieta 100% personalizada?</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                            O <strong style={{ color: '#00ff88' }}>APEX</strong>, seu nutricionista digital, já conhece suas preferências
                            e vai montar a dieta ideal sem te encher de perguntas.
                        </p>
                        <button className="apex-cta-btn large" onClick={abrirChat}>
                            <span className="apex-cta-btn-emoji">💬</span>
                            Consultar o APEX
                        </button>
                    </div>
                )
            ) : (
                /* Prévia bloqueada */
                <div className="glass" style={{ padding: '2rem', textAlign: 'center', borderColor: 'rgba(251,191,36,0.2)', opacity: 0.6 }}>
                    <p style={{ color: '#fbbf24', fontSize: '0.95rem', margin: 0 }}>
                        ⚠️ Preencha suas <strong>Preferências de Dieta</strong> acima para liberar o chat com o APEX.
                    </p>
                </div>
            )}
        </div>
    );
};

export default NutritionPlan;
