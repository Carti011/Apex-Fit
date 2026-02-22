import { Trophy, Flame, Target } from 'lucide-react';
import WeeklyChart from './WeeklyChart';
import '../../App.css';

const EvolutionPanel = ({ user, onNavigate }) => {
    const getLeagueInfo = (level) => {
        switch (level) {
            case 1: return { name: 'Bronze', color: '#cd7f32', min: 0, max: 3000 };
            case 2: return { name: 'Prata', color: '#c0c0c0', min: 3000, max: 10000 };
            case 3: return { name: 'Ouro', color: '#ffd700', min: 10000, max: 50000 };
            case 4: return { name: 'Diamante', color: '#b9f2ff', min: 50000, max: 50000 };
            default: return { name: 'Bronze', color: '#cd7f32', min: 0, max: 3000 };
        }
    };

    const league = getLeagueInfo(user?.level || 1);
    const current = user?.currentXp || 0;

    let progressPercent = 100;
    if (user?.level < 4) {
        progressPercent = ((current - league.min) / (league.max - league.min)) * 100;
        progressPercent = Math.max(0, Math.min(100, progressPercent));
    }

    const streakActive = user?.currentStreak > 0;

    return (
        <div className="evolution-panel fade-in">
            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                Painel de <span className="highlight">Evolução</span>
            </h2>

            <div className="stats-grid">
                {/* Card XP e Progresso (Clicável no Futuro - Modal Liga) */}
                <div
                    className="stat-card glass interactive-card"
                    style={{ borderColor: league.color, boxShadow: `0 8px 32px 0 ${league.color}15`, cursor: 'pointer' }}
                    onClick={() => alert("Em breve: Modal visualizando todas as Ligas (Bronze > Diamante)!")}
                >
                    <div className="stat-header">
                        <span className="stat-label" style={{ color: league.color, fontWeight: 'bold' }}>{league.name}</span>
                        <Trophy size={20} style={{ color: league.color }} />
                    </div>
                    <div className="stat-value">{current} <span className="stat-unit">XP</span></div>
                    <div className="stat-sub">Nível {user?.level || 1}</div>

                    <div className="xp-progress-container" style={{ marginTop: '1rem', height: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div
                            className="xp-progress-fill"
                            style={{
                                width: `${progressPercent}%`,
                                backgroundColor: league.color,
                                height: '100%',
                                transition: 'width 1s ease-in-out',
                                boxShadow: `0 0 10px ${league.color}`
                            }}
                        ></div>
                    </div>
                    <div className="xp-text" style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#aaa' }}>
                        {user?.level < 4 ? `Faltam ${league.max - current} XP para a próxima liga` : 'Você atingiu a liga máxima!'}
                    </div>
                </div>

                {/* Card Ofensiva */}
                <div className="stat-card glass" style={{ borderColor: streakActive ? '#ff4d4d' : 'rgba(255,255,255,0.1)' }}>
                    <div className="stat-header">
                        <span className="stat-label" style={{ color: streakActive ? '#ff4d4d' : 'var(--text-secondary)' }}>Ofensiva</span>
                        <Flame size={20} className={streakActive ? "pulse-animation" : ""} style={{ color: streakActive ? '#ff4d4d' : '#555', filter: streakActive ? 'drop-shadow(0 0 8px #ff4d4d)' : 'none' }} />
                    </div>
                    <div className="stat-value" style={{ color: streakActive ? 'white' : '#888' }}>
                        {user?.currentStreak || 0} <span className="stat-unit">dias</span>
                    </div>
                    <div className="stat-sub" style={{ color: streakActive ? '#ddd' : '#555' }}>
                        {streakActive ? 'Mantenha o fogo aceso!' : 'Faça uma dieta ou treino.'}
                    </div>
                </div>

                {/* Card Meta Status (Clicável - Vai para Quests) */}
                <div
                    className="stat-card glass interactive-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onNavigate && onNavigate('quests')}
                >
                    <div className="stat-header">
                        <span className="stat-label">Missões Fixas</span>
                        <Target size={20} className="highlight" />
                    </div>
                    <div className="stat-value" style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
                        Diárias
                    </div>
                    <div className="stat-sub" style={{ marginTop: '0.5rem' }}>
                        Clique para ir às Missões
                    </div>
                </div>
            </div>

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
