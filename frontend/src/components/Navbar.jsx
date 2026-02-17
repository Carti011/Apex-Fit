import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/20">
              <span className="font-bold text-slate-900">A</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-100">
              APEX<span className="text-emerald-400">FIT</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Recursos</a>
            <a href="/#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Planos</a>
            
            <Link 
              to="/login" 
              className={`text-sm font-medium transition-colors ${isActive('/login') ? 'text-emerald-400' : 'text-slate-300 hover:text-emerald-300'}`}
            >
              Entrar
            </Link>
            
            <Link
              to="/register"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-bold rounded-lg transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
            >
              Começar Agora
            </Link>
          </div>

          {/* Mobile Menu Button */}
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

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-800 border-b border-slate-700 animate-in slide-in-from-top-2">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700" onClick={() => setIsMenuOpen(false)}>Recursos</a>
            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-emerald-400 hover:text-emerald-300 hover:bg-slate-700" onClick={() => setIsMenuOpen(false)}>Entrar</Link>
            <Link to="/register" className="block w-full text-center px-3 py-3 mt-4 rounded-xl text-base font-bold text-slate-900 bg-emerald-500 hover:bg-emerald-400" onClick={() => setIsMenuOpen(false)}>
              Começar Agora
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
