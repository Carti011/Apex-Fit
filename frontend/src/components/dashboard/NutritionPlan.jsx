import { Apple, Battery, Flame } from 'lucide-react';

const NutritionPlan = ({ nutrition }) => {
    if (!nutrition) {
        return (
            <div className="fade-in glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <h3>⚠️ Perfil Incompleto</h3>
                <p>Preencha seus dados na aba <b>Perfil</b> para gerarmos seu cálculo metabólico e nutricional.</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                Plano Nutricional <span className="highlight">Inteligente</span>
            </h2>

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
                        <Flame size={20} className="highlight" /> {/* Using Flame assuming generic icon */}
                    </div>
                    <div className="stat-value">{nutrition.get} <span className="stat-unit">kcal</span></div>
                    <div className="stat-sub">Para o seu objetivo</div>
                </div>
            </div>

            <div className="glass" style={{ padding: '2rem' }}>
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
        </div>
    );
};

export default NutritionPlan;
