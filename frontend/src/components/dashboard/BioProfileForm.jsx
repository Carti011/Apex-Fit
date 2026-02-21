import { useState } from 'react';
import { Save } from 'lucide-react';

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
        // Backend expects weight, height, BF% as numbers, and dates in ISO format (YYYY-MM-DD)
        const payload = {
            ...formData,
            weight: formData.weight ? parseFloat(formData.weight) : null,
            height: formData.height ? parseFloat(formData.height) : null,
            bodyFatPercentage: formData.bodyFatPercentage ? parseFloat(formData.bodyFatPercentage) : null,
        };
        console.log('Enviando Dados Biológicos:', payload);
        onUpdate(payload);
    };

    return (
        <div className="fade-in">
            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                Perfil <span className="highlight">Biológico</span>
            </h2>

            <div className="glass" style={{ padding: '2rem' }}>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Data de Nascimento</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                className="glass-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Sexo Biológico</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="glass-input"
                            >
                                <option value="MALE">Masculino</option>
                                <option value="FEMALE">Feminino</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Peso (kg)</label>
                            <input
                                type="number"
                                step="0.1"
                                name="weight"
                                placeholder="Ex: 75.5"
                                value={formData.weight}
                                onChange={handleChange}
                                className="glass-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Altura (cm)</label>
                            <input
                                type="number"
                                name="height"
                                placeholder="Ex: 180"
                                value={formData.height}
                                onChange={handleChange}
                                className="glass-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>BF % (Opcional)</label>
                            <input
                                type="number"
                                step="0.1"
                                name="bodyFatPercentage"
                                placeholder="Ex: 15.5"
                                value={formData.bodyFatPercentage}
                                onChange={handleChange}
                                className="glass-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Objetivo Principal</label>
                        <select
                            name="goal"
                            value={formData.goal}
                            onChange={handleChange}
                            className="glass-input"
                        >
                            <option value="LOSE_WEIGHT">Perder Gordura</option>
                            <option value="MAINTAIN">Manter Peso</option>
                            <option value="GAIN_MUSCLE">Ganhar Massa Muscular</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Nível de Atividade</label>
                        <select
                            name="activityLevel"
                            value={formData.activityLevel}
                            onChange={handleChange}
                            className="glass-input"
                        >
                            <option value="SEDENTARY">Sedentário (Pouco ou nenhum exercício)</option>
                            <option value="LIGHT">Levemente Ativo (1-3 dias/semana)</option>
                            <option value="MODERATE">Moderadamente Ativo (3-5 dias/semana)</option>
                            <option value="ACTIVE">Muito Ativo (6-7 dias/semana)</option>
                            <option value="VERY_ACTIVE">Extremamente Ativo (Trabalho físico pesado)</option>
                        </select>
                    </div>

                    <button type="submit" className="cta-button primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                        <Save size={20} />
                        Atualizar Dados & Calcular
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BioProfileForm;
