import { useState, useEffect } from 'react'
import { Activity, Zap, TrendingUp, Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'

function Home() {
    const [status, setStatus] = useState('Verificando...')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        // Ajuste para não duplicar /api/v1 se já estiver na env
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
        fetch(`${apiUrl}/status`)
            .then(res => res.json())
            .then(data => setStatus('Online 🟢'))
            .catch((err) => {
                console.error("Erro ao verificar status:", err);
                setStatus('Offline 🔴');
            })
    }, [])

    return (
        <div className="app-layout">
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo-container">
                    <img src="/apex-logo.svg" alt="Apex Logo" className="nav-logo" />
                    <span className="nav-brand">APEX<span className="highlight">FIT</span></span>
                </div>

                <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    <a href="#features">Recursos</a>
                    <a href="#about">Sobre</a>
                    <a href="#pricing">Planos</a>
                    <Link to="/login" className="nav-cta">Entrar</Link>
                </div>

                <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </nav>

            {/* Hero Section */}
            <header className="hero">
                <div className="hero-content">
                    <div className="status-pill">
                        <span className="pulsing-dot"></span> API Status: {status}
                    </div>

                    <h1 className="hero-title">
                        EVOLUA SEU CORPO<br />
                        COMO UM <span className="highlight-gradient">RPG</span>
                    </h1>

                    <p className="hero-description">
                        Transforme treinos em XP. Supere missões diárias.
                        Conquiste o shape lendário com a nossa tecnologia de gamificação biomecânica.
                    </p>

                    <div className="hero-actions">
                        <button className="cta-button primary" onClick={() => navigate('/register')}>Começar Agora</button>
                        <button className="cta-button secondary">Ver Demo</button>
                    </div>
                </div>
            </header>

            {/* Features Grid */}
            <section className="features-section" id="features">
                <h2 className="section-title">ARSENAL <span className="highlight">TECNOLÓGICO</span></h2>

                <div className="grid-features">
                    <div className="feature-card">
                        <div className="icon-box"><Activity size={32} /></div>
                        <h3>Tracking Biométrico</h3>
                        <p>Monitore cada repetição e carga com gráficos de evolução em tempo real.</p>
                    </div>

                    <div className="feature-card">
                        <div className="icon-box"><Zap size={32} /></div>
                        <h3>Gamificação Hardcore</h3>
                        <p>Suba de nível, desbloqueie conquistas e entre para ligas competitivas.</p>
                    </div>

                    <div className="feature-card">
                        <div className="icon-box"><TrendingUp size={32} /></div>
                        <h3>Metabolismo Inteligente</h3>
                        <p>IA que ajusta seus macros (TMB/GET) automaticamente conforme você evolui.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>© 2026 Apex Fitness. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default Home
