import { useState } from 'react';
import { Save, Info, Activity, Ruler, Weight, Droplet, User, Calendar, Target } from 'lucide-react';

const BioProfileForm = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState({
        weight: user?.bioProfile?.weight || '',
        height: user?.bioProfile?.height || '',
        birthDate: user?.bioProfile?.birthDate || '',
        gender: user?.bioProfile?.gender || 'MALE',
        bodyFatPercentage: user?.bioProfile?.bodyFatPercentage || '',
        activityLevel: user?.bioProfile?.activityLevel || 'MODERATE',
        goal: user?.bioProfile?.goal || 'LOSE_WEIGHT'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            weight: formData.weight ? parseFloat(formData.weight) : null,
            height: formData.height ? parseFloat(formData.height) : null,
            bodyFatPercentage: formData.bodyFatPercentage ? parseFloat(formData.bodyFatPercentage) : null,
        };
        onUpdate(payload);
    };

    return (
        <div className="fade-in">
            <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity className="highlight" size={32} />
                Engrenagem <span className="highlight">Biológica</span>
            </h2>

            {/* Caixa Informativa sobre Motor Dinâmico */}
            <div className="glass" style={{ marginBottom: '2rem', padding: '1.5rem', borderLeft: '4px solid var(--primary-color)', backgroundColor: 'rgba(2, 219, 149, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <Info size={24} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '1.1rem' }}>Motor Metabólico Inteligente</h4>
                        <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem', lineHeight: '1.5' }}>
                            Preencha seus dados com precisão. Caso não saiba o seu Percentual de Gordura (BF%), usaremos a fórmula de <strong>Mifflin-St Jeor</strong>.
                            Preenchendo o BF%, nosso IA altera magicamente para a fórmula hiper-precisa de <strong>Katch-McArdle</strong> (focando puramente na sua massa magra).
                        </p>
                    </div>
                </div>
            </div>

            <div className="glass" style={{ padding: '2.5rem', borderRadius: '16px', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>

                    {/* Seção 1: Base */}
                    <div>
                        <h3 style={{ margin: '0 0 1rem 0', color: '#fff', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Fundação Biológica</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> Data de Nascimento</label>
                                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="glass-input" required />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> Sexo Biológico</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="glass-input">
                                    <option value="MALE">Masculino</option>
                                    <option value="FEMALE">Feminino</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Seção 2: Medidas Constantes */}
                    <div>
                        <h3 style={{ margin: '0 0 1rem 0', color: '#fff', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Medidas Corporais</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Weight size={16} /> Peso Atual (kg)</label>
                                <input type="number" step="0.1" name="weight" placeholder="Ex: 75.5" value={formData.weight} onChange={handleChange} className="glass-input" required />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Ruler size={16} /> Altura (cm)</label>
                                <input type="number" name="height" placeholder="Ex: 180" value={formData.height} onChange={handleChange} className="glass-input" required />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: formData.bodyFatPercentage ? 'var(--primary-color)' : '#fff' }}>
                                    <Droplet size={16} /> BF % (Percentual de Gordura) <span style={{ fontSize: '0.8rem', opacity: 0.7, marginLeft: '4px' }}>(Opcional)</span>
                                </label>
                                <input type="number" step="0.1" name="bodyFatPercentage" placeholder="Ex: 15.5" value={formData.bodyFatPercentage} onChange={handleChange} className="glass-input" style={{ borderColor: formData.bodyFatPercentage ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }} />
                            </div>
                        </div>
                    </div>

                    {/* Seção 3: Vida Real e Objetivos */}
                    <div>
                        <h3 style={{ margin: '0 0 1rem 0', color: '#fff', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Estratégia e Rotina</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Target size={16} /> Alvo Metabólico</label>
                                <select name="goal" value={formData.goal} onChange={handleChange} className="glass-input">
                                    <option value="LOSE_WEIGHT">Secar (Déficit Calórico)</option>
                                    <option value="MAINTAIN">Manter Peso (Manutenção)</option>
                                    <option value="GAIN_MUSCLE">Construir Músculo (Superávit)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={16} /> Nível de Atividade</label>
                                <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="glass-input">
                                    <option value="SEDENTARY">Sedentário (Pouco ou nenhum exercício)</option>
                                    <option value="LIGHT">Levemente Ativo (1-3 dias/semana)</option>
                                    <option value="MODERATE">Moderadamente Ativo (3-5 dias/semana)</option>
                                    <option value="ACTIVE">Muito Ativo (6-7 dias/semana)</option>
                                    <option value="VERY_ACTIVE">Extremamente Ativo (Trabalho físico pesado)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="cta-button primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem' }}>
                        <Save size={24} />
                        Gerar Inteligência Nutricional
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BioProfileForm;
