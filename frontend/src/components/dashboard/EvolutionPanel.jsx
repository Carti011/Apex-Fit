import { Trophy, Flame, Target } from 'lucide-react';
import WeeklyChart from './WeeklyChart';
import '../../App.css';

const EvolutionPanel = ({ user }) => {
    return (
        <div className="evolution-panel fade-in">
            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                Painel de <span className="highlight">Evolução</span>
            </h2>

            <div className="stats-grid">
                {/* Card XP */}
                <div className="stat-card glass">
                    <div className="stat-header">
                        <span className="stat-label">XP Total</span>
                        <Trophy size={20} className="highlight" />
                    </div>
                    <div className="stat-value">{user?.currentXp || 0} <span className="stat-unit">XP</span></div>
                    <div className="stat-sub">Nível {user?.level || 1}</div>

                    {/* XP Bar Progress */}
                    <div className="xp-progress-container">
                        <div
                            className="xp-progress-fill"
                            style={{ width: `${((user?.currentXp || 0) / (user?.targetXp || 100)) * 100}%` }}
                        ></div>
                    </div>
                    <div className="xp-text">Próximo nível: {user?.targetXp || 100} XP</div>
                </div>

                {/* Card Ofensiva */}
                <div className="stat-card glass">
                    <div className="stat-header">
                        <span className="stat-label">Ofensiva</span>
                        <Flame size={20} className={user?.currentStreak > 0 ? "highlight pulse-animation" : "highlight"} style={user?.currentStreak > 0 ? { color: '#ff4d4d' } : {}} />
                    </div>
                    <div className="stat-value">{user?.currentStreak || 0} <span className="stat-unit">dias</span></div>
                    <div className="stat-sub">Não quebre o ritmo!</div>
                </div>

                {/* Card Liga */}
                <div className="stat-card glass">
                    <div className="stat-header">
                        <span className="stat-label">Liga</span>
                        <Target size={20} className="highlight" />
                    </div>
                    <div className="stat-value">Bronze</div>
                    <div className="stat-sub">Top 10 sobem!</div>
                </div>
            </div>

            {/* Gráfico de Evolução Semanal */}
            <div className="glass" style={{ marginTop: '2rem', padding: '1.5rem', height: '350px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Evolução Semanal</h3>
                <div style={{ flex: 1, minHeight: 0 }}>
                    <WeeklyChart />
                </div>
            </div>
        </div>
    );
};

export default EvolutionPanel;
