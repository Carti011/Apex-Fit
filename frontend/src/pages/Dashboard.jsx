import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Activity, Target, User, Utensils, LogOut, ShieldCheck, X } from 'lucide-react';
import EvolutionPanel from '../components/dashboard/EvolutionPanel';
import DailyQuests from '../components/dashboard/DailyQuests';
import BioProfileForm from '../components/dashboard/BioProfileForm';
import NutritionPlan from '../components/dashboard/NutritionPlan';
import AccountSettings from '../components/dashboard/AccountSettings';
import { api } from '../services/api';
import './Dashboard.css';

const getUserTitle = (level) => {
    if (level >= 100) return '🏆 Lenda do Apex Fit';
    if (level >= 50) return '👑 Elite';
    if (level >= 25) return '🏋️ Atleta Focado';
    if (level >= 10) return '🏃 Amador';
    return '🌱 Iniciante';
};

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showTitlesModal, setShowTitlesModal] = useState(false);
    const [prevLevel, setPrevLevel] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    // Merge Auth user with fresh DashboardData
    const activeData = { ...user, ...dashboardData };

    // Level Progress Math
    const level = activeData.level || 1;
    const currentXp = activeData.currentXp || 0;
    const targetXp = activeData.targetXp || 100;
    const gap = level * 100;
    const base = targetXp - gap;
    const progressInLevel = Math.max(0, currentXp - base);
    const percent = Math.min(100, (progressInLevel / gap) * 100);


    // Level Progress Math
    const level = user?.level || 1;
    const currentXp = user?.currentXp || 0;
    const targetXp = user?.targetXp || 100;
    const gap = level * 100;
    const base = targetXp - gap;
    const progressInLevel = Math.max(0, currentXp - base);
    const percent = Math.min(100, (progressInLevel / gap) * 100);


    useEffect(() => {
        const fetchDashboardInfo = async () => {
            if (!user || !user.token) return;
            try {
                const data = await api.getDashboard(user.token);
                setDashboardData(data);
                if (data.level) setPrevLevel(data.level);
            } catch (error) {
                console.error("Erro ao carregar dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardInfo();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleProfileUpdate = async (bioPayload) => {
        try {
            const updatedData = await api.updateBioProfile(user.token, bioPayload);

            // Check for Level Up!
            if (prevLevel && updatedData.level > prevLevel) {
                setShowLevelUp(true);
            }

            setPrevLevel(updatedData.level);
            setDashboardData(updatedData);
            showToast("Perfil biológico salvo com sucesso!");
            setActiveTab('diet'); // Redireciona para a aba de dieta para ver os resultados
        } catch (error) {
            showToast("Erro ao salvar perfil. Verifique os dados.", "error");
            console.error(error);
        }
    };

    const handleQuestComplete = async (questType) => {
        try {
            const updatedData = await api.completeQuest(user.token, questType);

            // Check for Level Up
            if (prevLevel && updatedData.level > prevLevel) {
                setShowLevelUp(true);
            }

            setPrevLevel(updatedData.level);
            setDashboardData(updatedData);
            showToast("Missão concluída! XP Adicionado.");
        } catch (error) {
            showToast("Erro ao concluir missão.", "error");
            console.error(error);
        }
    };

    const renderContent = () => {
        if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Carregando seus dados...</div>;

        switch (activeTab) {
            case 'dashboard':
                return <EvolutionPanel user={{ ...user, ...dashboardData }} onNavigate={setActiveTab} />;
            case 'quests':
                return <DailyQuests user={{ ...user, ...dashboardData }} onQuestComplete={handleQuestComplete} />;
            case 'profile':
                return <BioProfileForm user={dashboardData} onUpdate={handleProfileUpdate} />;
            case 'diet':
                return <NutritionPlan nutrition={dashboardData?.nutritionPlan} />;
            case 'account':
                return <AccountSettings user={{ ...user, ...dashboardData }} onUpdateSuccess={(newData) => {
                    if (newData) setDashboardData(newData);
                    setActiveTab('dashboard');
                }} />;
            default:
                return <EvolutionPanel user={{ ...user, ...dashboardData }} onNavigate={setActiveTab} />;
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <span className="nav-brand">APEX<span className="highlight">FIT</span></span>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <Activity size={20} />
                        <span>Evolução</span>
                    </button>

                    <button
                        className={`sidebar-link ${activeTab === 'quests' ? 'active' : ''}`}
                        onClick={() => setActiveTab('quests')}
                    >
                        <Target size={20} />
                        <span>Missões</span>
                    </button>

                    <button
                        className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <User size={20} />
                        <span>Perfil</span>
                    </button>

                    <button
                        className={`sidebar-link ${activeTab === 'diet' ? 'active' : ''}`}
                        onClick={() => setActiveTab('diet')}
                    >
                        <Utensils size={20} />
                        <span>Dieta</span>
                    </button>

                    <button
                        className={`sidebar-link ${activeTab === 'account' ? 'active' : ''}`}
                        onClick={() => setActiveTab('account')}
                    >
                        <ShieldCheck size={20} />
                        <span>Conta</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="sidebar-link logout" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Header Mobile/Desktop */}
                <header className="dashboard-header">
                    <div
                        className="user-welcome interactive-card"
                        onClick={() => setActiveTab('account')}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', borderRadius: '12px' }}
                        title="Editar Configurações de Conta"
                    >
                        <div className="avatar-placeholder">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: '0 0 0.2rem 0' }}>Bem-vindo, {user?.name}</h3>
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowTitlesModal(true); }}
                                style={{ background: 'transparent', border: 'none', padding: 0, margin: '0 0 0.5rem 0', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', display: 'block' }}
                            >
                                <span className="user-level" style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '4px', display: 'inline-block' }}>
                                    Nível {level} • {getUserTitle(level)}
                                </span>
                            </button>
                            {/* Tiny Progress Bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${percent}%`, height: '100%', background: 'var(--accent-color)', borderRadius: '4px', transition: 'width 0.5s ease-out' }} />
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                                    {progressInLevel} / {gap} XP
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Logout Button (Visible only on mobile via CSS) */}
                    <button className="mobile-logout-btn" onClick={handleLogout} aria-label="Sair">
                        <LogOut size={24} />
                    </button>
                </header>

                <div className="dashboard-content">
                    {renderContent()}
                </div>
            </main>

            {/* Level Up Modal Notification */}
            {showLevelUp && (
                <div className="level-up-overlay">
                    <div className="level-up-modal slide-up-bounce">
                        <div className="level-up-icon">⭐</div>
                        <h3 className="level-up-title">LEVEL UP! 🚀</h3>
                        <p className="level-up-text">Você alcançou o Nível <span className="highlight-level">{level}</span></p>
                        <button
                            className="level-up-btn"
                            onClick={() => setShowLevelUp(false)}
                        >
                            Incrível!
                        </button>
                    </div>
                </div>
            )}

            {/* Account Titles Modal Notification */}
            {showTitlesModal && (
                <div className="level-up-overlay" onClick={() => setShowTitlesModal(false)}>
                    <div className="leagues-modal slide-up-bounce" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'white' }}>Nível da Conta</h3>
                            <button onClick={() => setShowTitlesModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Diferente das Patentes (Ranks), o Nível da Conta acumula toda a sua jornada e nunca cai. Continue treinando para forjar seu título!
                        </p>

                        <div className="league-tiers-list">
                            {[
                                { min: 1, max: 9, title: '🌱 Iniciante' },
                                { min: 10, max: 24, title: '🏃 Amador' },
                                { min: 25, max: 49, title: '🏋️ Atleta Focado' },
                                { min: 50, max: 99, title: '👑 Elite' },
                                { min: 100, max: '∞', title: '🏆 Lenda do Apex Fit' }
                            ].map((tier) => {
                                const isCurrent = level >= tier.min && (tier.max === '∞' || level <= tier.max);
                                const isCurrent = (user?.level || 1) >= tier.min && (tier.max === '∞' || (user?.level || 1) <= tier.max);
                                return (
                                    <div key={tier.title} className={`league-tier ${isCurrent ? 'current' : ''}`} style={isCurrent ? { borderColor: 'var(--accent-color)' } : { padding: '0.8rem 1rem' }}>
                                        <div className="league-tier-info" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <div className="league-tier-name" style={{ margin: 0, fontSize: '1.1rem', color: isCurrent ? 'var(--accent-color)' : 'white' }}>{tier.title}</div>
                                            <div className="league-tier-xp" style={{ color: 'var(--text-secondary)' }}>Nível {tier.min}{tier.max !== '∞' ? ` ao ${tier.max}` : '+'}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button className="close-modal-btn" onClick={() => setShowTitlesModal(false)}>
                            Impressionante
                        </button>
                    </div>
                </div>
            )}

            {/* Premium Toast Notification */}
            <div className={`premium-toast ${toast.show ? 'show' : ''} ${toast.type}`}>
                <div className="toast-icon">
                    {toast.type === 'success' ? '✅' : '⚠️'}
                </div>
                <div className="toast-text">{toast.message}</div>
            </div>
        </div>
    );
};

export default Dashboard;
