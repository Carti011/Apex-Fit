import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Utensils, LogOut } from 'lucide-react';
import EvolutionPanel from '../components/dashboard/EvolutionPanel';
import BioProfileForm from '../components/dashboard/BioProfileForm';
import NutritionPlan from '../components/dashboard/NutritionPlan';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <EvolutionPanel user={user} />;
            case 'profile':
                return <BioProfileForm user={user} onUpdate={(data) => console.log('Update', data)} />;
            case 'diet':
                return <NutritionPlan />;
            default:
                return <EvolutionPanel user={user} />;
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
        </div>
    );
};

export default Dashboard;
