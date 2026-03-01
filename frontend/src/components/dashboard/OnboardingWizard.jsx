import { useState } from 'react';
import { Save, Info, Activity, Ruler, Weight, Droplet, User, Calendar, Target, ChevronRight } from 'lucide-react';
import './OnboardingWizard.css';

const STEPS = [
    { id: 1, label: 'Fundação', desc: 'Dados pessoais básicos' },
    { id: 2, label: 'Medidas', desc: 'Corpo e composição' },
    { id: 3, label: 'Objetivo', desc: 'Meta e rotina' },
];

const OnboardingWizard = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        birthDate: '',
        gender: 'MALE',
        height: '',
        weight: '',
        bodyFatPercentage: '',
        goal: 'LOSE_WEIGHT',
        activityLevel: 'MODERATE',
    });

    const set = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleNext = async (e) => {
        e.preventDefault();
        if (step < 3) {
            setStep(s => s + 1);
        } else {
            const payload = {
                ...formData,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                height: formData.height ? parseFloat(formData.height) : null,
                bodyFatPercentage: formData.bodyFatPercentage ? parseFloat(formData.bodyFatPercentage) : null,
            };
            setSaving(true);
            try {
                await onComplete(payload);
            } finally {
                setSaving(false);
            }
        }
    };

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-container">
                {/* Brand */}
                <div className="onboarding-brand">
                    <span className="onboarding-logo">APEX<span>FIT</span></span>
                    <p className="onboarding-subtitle">Configure seu perfil para desbloquear o app</p>
                </div>

                {/* Step Indicators */}
                <div className="onboarding-steps">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="onboarding-step-wrapper">
                            <div className={`onboarding-step-dot${step === s.id ? ' active' : step > s.id ? ' done' : ''}`}>
                                {step > s.id ? '✓' : s.id}
                            </div>
                            <div className={`onboarding-step-label${step === s.id ? ' active' : ''}`}>{s.label}</div>
                            {i < STEPS.length - 1 && <div className={`onboarding-step-line${step > s.id ? ' done' : ''}`} />}
                        </div>
                    ))}
                </div>

                {/* Form */}
                <form className="onboarding-form" onSubmit={handleNext}>

                    {step === 1 && (
                        <div className="onboarding-step-content fade-in">
                            <h2 className="onboarding-step-title">👤 Quem é você?</h2>
                            <p className="onboarding-step-desc">Precisamos desses dados para calcular seu metabolismo corretamente.</p>

                            <div className="ob-form-group">
                                <label><Calendar size={14} /> Data de Nascimento</label>
                                <input type="date" value={formData.birthDate}
                                    onChange={e => set('birthDate', e.target.value)}
                                    className="glass-input" required />
                            </div>

                            <div className="ob-form-group">
                                <label><User size={14} /> Sexo Biológico</label>
                                <div className="ob-radio-group">
                                    {['MALE', 'FEMALE'].map(g => (
                                        <button key={g} type="button"
                                            className={`ob-radio-btn${formData.gender === g ? ' selected' : ''}`}
                                            onClick={() => set('gender', g)}>
                                            {g === 'MALE' ? '♂ Masculino' : '♀ Feminino'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="onboarding-step-content fade-in">
                            <h2 className="onboarding-step-title">📏 Seu corpo</h2>
                            <p className="onboarding-step-desc">Essas medidas formam a base do seu cálculo metabólico.</p>

                            <div className="ob-form-row">
                                <div className="ob-form-group">
                                    <label><Weight size={14} /> Peso (kg)</label>
                                    <input type="number" step="0.1" placeholder="Ex: 75.5"
                                        value={formData.weight} onChange={e => set('weight', e.target.value)}
                                        className="glass-input" required />
                                </div>
                                <div className="ob-form-group">
                                    <label><Ruler size={14} /> Altura (cm)</label>
                                    <input type="number" placeholder="Ex: 180"
                                        value={formData.height} onChange={e => set('height', e.target.value)}
                                        className="glass-input" required />
                                </div>
                            </div>

                            <div className="ob-form-group">
                                <label>
                                    <Droplet size={14} />
                                    % Gordura Corporal
                                    <span className="ob-optional">(Opcional — melhora a precisão)</span>
                                </label>
                                <input type="number" step="0.1" placeholder="Ex: 15.5"
                                    value={formData.bodyFatPercentage} onChange={e => set('bodyFatPercentage', e.target.value)}
                                    className="glass-input" />
                            </div>

                            <div className="ob-info-box">
                                <Info size={14} />
                                <span>Com BF% preenchido usamos <strong>Katch-McArdle</strong> (mais precisa). Sem ele, usamos <strong>Mifflin-St Jeor</strong>.</span>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="onboarding-step-content fade-in">
                            <h2 className="onboarding-step-title">🎯 Sua missão</h2>
                            <p className="onboarding-step-desc">Defina sua estratégia metabólica. Você pode ajustar isso depois em Conta.</p>

                            <div className="ob-form-group">
                                <label><Target size={14} /> Alvo Metabólico</label>
                                <div className="ob-goal-group">
                                    {[
                                        { value: 'LOSE_WEIGHT', emoji: '🔥', label: 'Secar', sub: 'Déficit calórico' },
                                        { value: 'MAINTAIN', emoji: '⚖️', label: 'Manter', sub: 'Manutenção' },
                                        { value: 'GAIN_MUSCLE', emoji: '💪', label: 'Ganhar Músculo', sub: 'Superávit' },
                                    ].map(g => (
                                        <button key={g.value} type="button"
                                            className={`ob-goal-btn${formData.goal === g.value ? ' selected' : ''}`}
                                            onClick={() => set('goal', g.value)}>
                                            <span className="ob-goal-emoji">{g.emoji}</span>
                                            <span className="ob-goal-label">{g.label}</span>
                                            <span className="ob-goal-sub">{g.sub}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="ob-form-group">
                                <label><Activity size={14} /> Nível de Atividade</label>
                                <select value={formData.activityLevel} onChange={e => set('activityLevel', e.target.value)} className="glass-input">
                                    <option value="SEDENTARY">🛋️ Sedentário (Pouco ou nenhum exercício)</option>
                                    <option value="LIGHT">🚶 Levemente Ativo (1-3 dias/semana)</option>
                                    <option value="MODERATE">🏃 Moderadamente Ativo (3-5 dias/semana)</option>
                                    <option value="ACTIVE">🏋️ Muito Ativo (6-7 dias/semana)</option>
                                    <option value="VERY_ACTIVE">⚡ Extremamente Ativo (Trabalho físico pesado)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <button type="submit" className="ob-next-btn" disabled={saving}>
                        {step < 3 ? (
                            <>Próximo <ChevronRight size={18} /></>
                        ) : saving ? (
                            <>Salvando...</>
                        ) : (
                            <><Save size={18} /> Salvar e Entrar no App</>
                        )}
                    </button>
                </form>

                <p className="onboarding-footer">
                    Esses dados são armazenados com segurança e usados apenas para personalizar sua experiência.
                </p>
            </div>
        </div>
    );
};

export default OnboardingWizard;
