import { useState, useEffect } from 'react'
import { Activity, Zap, TrendingUp, Menu, X, Trophy, Flame, Target, Shield, Brain } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../App.css'
import './Home.css' // Import newly created styles

function Home() {
    const [status, setStatus] = useState('Verificando...')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        // Redireciona usuários logados direto
        if (user) {
            navigate('/dashboard');
            return;
        }

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
        fetch(`${apiUrl}/status`)
            .then(res => res.json())
            .then(() => setStatus('Servidor Operacional 🟢'))
            .catch(() => setStatus('Servidor Offline 🔴'))
    }, [user, navigate])

    return (
        <div className="home-container">
            {/* Glowing Effects no Background */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>

            {/* Navbar */}
            <nav className="navbar">
                <div className="logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <img src="/apex-logo.svg" alt="Apex Logo" className="nav-logo" />
                    <span className="nav-brand">APEX<span className="highlight">FIT</span></span>
                </div>

                <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    <a href="#como-funciona" onClick={() => setIsMenuOpen(false)}>Metodologia</a>
                    <a href="#features" onClick={() => setIsMenuOpen(false)}>Arsenal</a>
                    {user ? (
                        <Link to="/dashboard" className="nav-cta">Dashboard</Link>
                    ) : (
                        <Link to="/login" className="nav-cta">Entrar na Conta</Link>
                    )}
                </div>

                <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </nav>

            {/* Hero Section */}
            <header className="hero-redesign">
                <div className="beta-badge">
                    <Zap size={16} /> Beta Aberto - Vagas Limitadas
                </div>

                <h1 className="hero-title-main">
                    Evolua seu corpo.<br />
                    <span className="gradient-text">Upe seus atributos.</span>
                </h1>

                <p className="hero-subtitle">
                    O aplicativo definitivo que transforma a dor do treino e da dieta e converte o seu esforço do mundo real em <strong className="highlight">Experiência (XP), Níveis e Ligas</strong> de competição social.
                </p>

                <div className="hero-actions">
                    <button className="cta-button primary" onClick={() => navigate('/register')}>Começar Jornada Gratuita</button>
                </div>

                {/* Interactive Mockup */}
                <div className="hero-mockup-wrapper">
                    <div className="app-mockup">
                        <div className="mockup-header">
                            <div className="mockup-user">
                                <div className="mockup-avatar"></div>
                                <div>
                                    <div className="mockup-level">Nível 8 • Lenda Urbana</div>
                                    <div className="mockup-name">Gabriel Silva</div>
                                </div>
                            </div>
                            <div className="mockup-stats">
                                <span className="mockup-stat-pill fire"><Flame size={16} /> 14 Dias</span>
                                <span className="mockup-stat-pill xp"><Trophy size={16} /> Ouro</span>
                            </div>
                        </div>
                        <div className="mockup-body">
                            <div className="mockup-card">
                                <h3>Progresso do Nível</h3>
                                <div className="mockup-progress-bar">
                                    <div className="mockup-progress-fill"></div>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.9rem' }}>600 / 800 XP</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Social Proof */}
            <div className="social-proof">
                <div className="proof-item">
                    <span className="proof-number">14.2k+</span>
                    <span className="proof-label">Treinos Registrados</span>
                </div>
                <div className="proof-item">
                    <span className="proof-number">5.6M</span>
                    <span className="proof-label">XP Distribuído</span>
                </div>
                <div className="proof-item">
                    <span className="proof-number">API</span>
                    <span className="proof-label">{status}</span>
                </div>
            </div>

            {/* Como Funciona Section */}
            <section id="como-funciona" className="steps-section">
                <h2 className="section-title">COMO A <span className="highlight">FÍSICA</span> VIRA JOGO</h2>

                <div className="steps-grid">
                    <div className="step-card">
                        <span className="step-number">1</span>
                        <div className="step-icon"><Activity size={28} /></div>
                        <h3>Treine no Mundo Real</h3>
                        <p>Complete as tarefas na sua rotina diária real. Sem robôs, apenas suor. Registre sua dieta e atividades no site.</p>
                    </div>
                    <div className="step-card">
                        <span className="step-number">2</span>
                        <div className="step-icon"><Target size={28} /></div>
                        <h3>Ganhe Experiência (XP)</h3>
                        <p>Cada missão concluída te dá XP limpo. O código valida o seu acerto calórico e credita o progresso na sua vida.</p>
                    </div>
                    <div className="step-card">
                        <span className="step-number">3</span>
                        <div className="step-icon"><Trophy size={28} /></div>
                        <h3>Domine o Ranking</h3>
                        <p>Suba eternamente de Nível da Conta e lute pelas patentes de elite (Prata, Ouro, Diamante) nas ligas semanais.</p>
                    </div>
                </div>
            </section>

            {/* Bento Box Grid */}
            <section id="features" className="bento-section">
                <h2 className="section-title">TECNOLOGIA DE <span className="highlight">PONTA</span></h2>

                <div className="bento-grid">
                    <div className="bento-card bento-large">
                        <Brain size={180} className="bento-bg-icon" />
                        <h3 className="bento-title">Agente de I.A e Motor Biológico.</h3>
                        <p className="bento-desc">
                            Aposente os formulários de macros fixos e ineficientes de 1990. Nós calculamos seu TMB via **Mifflin-St Jeor** e usamos inteligência para te desafiar a consertar sua dieta dinamicamente (O Negociador).
                        </p>
                    </div>

                    <div className="bento-card bento-medium">
                        <Shield size={120} className="bento-bg-icon" />
                        <h3 className="bento-title">Sem Hackers</h3>
                        <p className="bento-desc">Ofensivas (Streaks) rigorosas. Burlou um dia? Punição imediata de nível. Um sistema anti-fraude onde só os dedicados sobrevivem.</p>
                    </div>

                    <div className="bento-card bento-medium">
                        <Flame size={120} className="bento-bg-icon" />
                        <h3 className="bento-title">Viciante</h3>
                        <p className="bento-desc">O formato Dark Mode com neon emite dopamina pela tela. A interface "Glass" e os gráficos te guiam.</p>
                    </div>

                    <div className="bento-card bento-medium" style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.1), rgba(13,13,13,1))' }}>
                        <h3 className="bento-title" style={{ color: 'var(--accent-color)' }}>Tudo isso 100% Web.</h3>
                        <p className="bento-desc" style={{ color: '#fff' }}>Abra a qualquer momento, de qualquer lugar.</p>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="cta-section">
                <div className="cta-box">
                    <h2>Pronto para iniciar seu <span className="highlight">Save Game</span>?</h2>
                    <p>Crie sua conta Apex em 30 segundos usando apenas e-mail e inicie a coleta do seu primeiro XP.</p>
                    <button className="cta-button primary" onClick={() => navigate('/register')} style={{ padding: '1.2rem 3rem', fontSize: '1.2rem' }}>
                        Criar Conta Apex
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" style={{ borderTop: 'none', background: 'rgba(0,0,0,0.5)' }}>
                <p>© 2026 Apex Fitness Elite. Designed by Carti.</p>
            </footer>
        </div>
    )
}

export default Home
