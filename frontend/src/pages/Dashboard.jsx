import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Activity, Target, User, Utensils, LogOut } from 'lucide-react';
import EvolutionPanel from '../components/dashboard/EvolutionPanel';
import DailyQuests from '../components/dashboard/DailyQuests';
import BioProfileForm from '../components/dashboard/BioProfileForm';
import NutritionPlan from '../components/dashboard/NutritionPlan';
import { api } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [prevLevel, setPrevLevel] = useState(null);

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
            alert("Perfil salvo com sucesso!");
            setActiveTab('diet'); // Redireciona para a aba de dieta para ver os resultados
        } catch (error) {
            alert("Erro ao salvar perfil");
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
        } catch (error) {
            alert("Erro ao concluir missão");
            console.error(error);
        }
    };

    const renderContent = () => {
        if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Carregando seus dados...</div>;

        switch (activeTab) {
            case 'dashboard':
                return <EvolutionPanel user={{ ...user, ...dashboardData }} />;
            case 'quests':
                return <DailyQuests user={{ ...user, ...dashboardData }} onQuestComplete={handleQuestComplete} />;
            case 'profile':
                return <BioProfileForm user={dashboardData} onUpdate={handleProfileUpdate} />;
            case 'diet':
                return <NutritionPlan nutrition={dashboardData?.nutritionPlan} />;
            default:
                return <EvolutionPanel user={{ ...user, ...dashboardData }} />;
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
                    <div className="user-welcome">
                        <div className="avatar-placeholder">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h3>Bem-vindo, {user?.name}</h3>
                            <span className="user-level">Nível {user?.level || 1} • Iniciante</span>
                        </div>
                    </div>
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
                        <p className="level-up-text">Você alcançou o Nível <span className="highlight-level">{user?.level}</span></p>
                        <button
                            className="level-up-btn"
                            onClick={() => setShowLevelUp(false)}
                        >
                            Incrível!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
