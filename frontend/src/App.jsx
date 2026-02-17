import { useState, useEffect } from 'react'
import { Activity, Zap, TrendingUp, Menu, X } from 'lucide-react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Register from './components/Register'
import './App.css'

function Home() {
  const [status, setStatus] = useState('Verificando...')
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    fetch(`${apiUrl}/api/v1/status`)
      .then(res => res.json())
      .then(() => setStatus('Online 🟢'))
      .catch((err) => {
        console.error("Erro ao verificar status:", err);
        setStatus('Offline 🔴');
      })
  }, [])

  return (
    <>
      <header className="hero">
        <div className="hero-content">
          <div className="status-pill mb-6">
            <span className={`pulsing-dot ${status.includes('Online') ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            API Status: {status}
          </div>

          <h1 className="hero-title text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            EVOLUA SEU CORPO<br />
            COMO UM <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">RPG</span>
          </h1>

          <p className="hero-description text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transforme treinos em XP. Supere missões diárias.
            Conquiste o shape lendário com a nossa tecnologia de gamificação biomecânica.
          </p>

          <div className="hero-actions flex gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/20"
            >
              Começar Agora
            </button>
            <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700">
              Ver Demo
            </button>
          </div>
        </div>
      </header>

      <section className="features-section py-20 px-4" id="features">
        <h2 className="section-title text-3xl font-bold text-center mb-12">
          ARSENAL <span className="text-emerald-400">TECNOLÓGICO</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="feature-card bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:border-emerald-500/30 transition-all">
            <div className="icon-box bg-slate-700/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-emerald-400">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Tracking Biométrico</h3>
            <p className="text-slate-400">Monitore cada repetição e carga com gráficos de evolução em tempo real.</p>
          </div>

          <div className="feature-card bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-all">
            <div className="icon-box bg-slate-700/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-400">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Gamificação Hardcore</h3>
            <p className="text-slate-400">Suba de nível, desbloqueie conquistas e entre para ligas competitivas.</p>
          </div>

          <div className="feature-card bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:border-purple-500/30 transition-all">
            <div className="icon-box bg-slate-700/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-purple-400">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Metabolismo Inteligente</h3>
            <p className="text-slate-400">IA que ajusta seus macros (TMB/GET) automaticamente conforme você evolui.</p>
          </div>
        </div>
      </section>
    </>
  )
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500/30">
        <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                  <span className="font-bold text-slate-900">A</span>
                </div>
                <span className="font-bold text-xl tracking-tight">APEX<span className="text-emerald-400">FIT</span></span>
              </Link>

              <div className="hidden md:flex items-center gap-8">
                <a href="/#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Recursos</a>
                <a href="/#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Planos</a>
                <Link to="/login" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">Entrar</Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-slate-100 hover:bg-white text-slate-900 text-sm font-bold rounded-lg transition-all"
                >
                  Começar
                </Link>
              </div>

              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-slate-300 hover:text-white p-2"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-slate-800 border-b border-slate-700">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700">Recursos</a>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-emerald-400 hover:text-emerald-300 hover:bg-slate-700">Entrar</Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-emerald-600 hover:bg-emerald-500">Começar Agora</Link>
              </div>
            </div>
          )}
        </nav>

        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            {/* Login route placeholder */}
            <Route path="/login" element={<div className="flex items-center justify-center h-[80vh] text-2xl text-slate-500">Login Coming Soon...</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
