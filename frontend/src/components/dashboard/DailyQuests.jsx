import { useState } from 'react';
import { Droplet, Apple, Dumbbell, CheckCircle2 } from 'lucide-react';
import '../../App.css';

const DailyQuests = ({ user, onQuestComplete }) => {
    // Local loading state to prevent spam clicking
    const [loadingQuest, setLoadingQuest] = useState(null);

    const checkComplete = async (questType) => {
        setLoadingQuest(questType);
        await onQuestComplete(questType);
        setLoadingQuest(null);
    };

    return (
        <div className="daily-quests-panel fade-in" style={{ marginTop: '2rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                Missões <span className="highlight">Diárias</span>
            </h2>

            <div className="quests-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>

                {/* Água */}
                <div className={`quest-card glass ${user?.waterGoalMet ? 'completed' : ''}`} style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: user?.waterGoalMet ? '1px solid var(--accent-color)' : '' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(0, 255, 136, 0.1)', padding: '0.8rem', borderRadius: '12px', color: 'var(--accent-color)' }}>
                            <Droplet size={24} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>Meta de Água</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Beba 3 Litros (+20 XP)</p>
                        </div>
                    </div>
                    {user?.waterGoalMet ? (
                        <CheckCircle2 color="var(--accent-color)" size={28} />
                    ) : (
                        <button
                            className="btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            onClick={() => checkComplete('WATER')}
                            disabled={loadingQuest === 'WATER'}
                        >
                            {loadingQuest === 'WATER' ? '...' : 'Concluir'}
                        </button>
                    )}
                </div>

                {/* Dieta */}
                <div className={`quest-card glass ${user?.dietGoalMet ? 'completed' : ''}`} style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: user?.dietGoalMet ? '1px solid var(--accent-color)' : '' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(0, 255, 136, 0.1)', padding: '0.8rem', borderRadius: '12px', color: 'var(--accent-color)' }}>
                            <Apple size={24} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>Meta de Calorias</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fique na dieta (+30 XP)</p>
                        </div>
                    </div>
                    {user?.dietGoalMet ? (
                        <CheckCircle2 color="var(--accent-color)" size={28} />
                    ) : (
                        <button
                            className="btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            onClick={() => checkComplete('DIET')}
                            disabled={loadingQuest === 'DIET'}
                        >
                            {loadingQuest === 'DIET' ? '...' : 'Concluir'}
                        </button>
                    )}
                </div>

                {/* Treino */}
                <div className={`quest-card glass ${user?.workoutGoalMet ? 'completed' : ''}`} style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: user?.workoutGoalMet ? '1px solid var(--accent-color)' : '' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(0, 255, 136, 0.1)', padding: '0.8rem', borderRadius: '12px', color: 'var(--accent-color)' }}>
                            <Dumbbell size={24} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>Check-in Treino</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fui pra academia (+50 XP)</p>
                        </div>
                    </div>
                    {user?.workoutGoalMet ? (
                        <CheckCircle2 color="var(--accent-color)" size={28} />
                    ) : (
                        <button
                            className="btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            onClick={() => checkComplete('WORKOUT')}
                            disabled={loadingQuest === 'WORKOUT'}
                        >
                            {loadingQuest === 'WORKOUT' ? '...' : 'Concluir'}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default DailyQuests;
