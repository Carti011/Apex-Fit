import { useState } from 'react';
import { Save } from 'lucide-react';

const BioProfileForm = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState({
        weight: user?.weight || '',
        height: user?.height || '',
        age: user?.age || '',
        gender: user?.gender || 'MALE',
        activityLevel: user?.activityLevel || 'MODERATE',
        goal: user?.goal || 'LOSE_WEIGHT'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Call backend to update profile and calculate TMB/GET
        console.log('Dados Biológicos:', formData);
        onUpdate(formData);
    };

    return (
        <div className="fade-in">
            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                Perfil <span className="highlight">Biológico</span>
            </h2>

            <div className="glass" style={{ padding: '2rem' }}>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>

                    <div className="form-group">
                        <label>Data de Nascimento / Idade</label>
                        <input
                            type="number"
                            name="age"
                            placeholder="Ex: 25"
                            value={formData.age}
                            onChange={handleChange}
                            className="glass-input"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Peso (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                placeholder="Ex: 75.5"
                                value={formData.weight}
                                onChange={handleChange}
                                className="glass-input"
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
                            />
                        </div>
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

                    <button type="submit" className="cta-button primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                        <Save size={20} />
                        Atualizar Dados
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BioProfileForm;
