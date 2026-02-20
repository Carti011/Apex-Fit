import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Utensils, LogOut } from 'lucide-react';
import EvolutionPanel from '../components/dashboard/EvolutionPanel';
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

    const renderContent = () => {
        if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Carregando seus dados...</div>;

        switch (activeTab) {
            case 'dashboard':
                // Temporarily mixing user auth data with dashboard gamification data
                return <EvolutionPanel user={{ ...user, ...dashboardData }} />;
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
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
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

            {/* Level Up Toast Notification */}
            {showLevelUp && (
                <div className="level-up-toast fade-in" style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    background: 'linear-gradient(135deg, var(--gold), #ffb703)',
                    color: '#000',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    zIndex: 1000
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>LEVEL UP! 🚀</h3>
                    <p style={{ margin: 0, fontWeight: 600 }}>Você alcançou o Nível {user?.level}</p>
                    <button
                        onClick={() => setShowLevelUp(false)}
                        style={{
                            marginTop: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: '#000',
                            color: 'var(--gold)',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Incrível!
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
