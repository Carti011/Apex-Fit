import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import '../App.css';
import '../App.css';
import { api } from '../services/api';

export function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        try {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...dataToSend } = formData;
            await api.register(dataToSend);
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="app-layout" style={{ justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle at center, rgba(0, 255, 136, 0.1) 0%, rgba(13, 13, 13, 1) 100%)' }}>
                <div className="glass" style={{ padding: '3rem', borderRadius: '24px', maxWidth: '450px', width: '100%', boxShadow: '0 8px 32px rgba(0, 255, 136, 0.2)', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'rgba(0, 255, 136, 0.2)', padding: '1.5rem', borderRadius: '50%' }}>
                            <CheckCircle size={48} color="#00ff88" />
                        </div>
                    </div>

                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        Bem-vindo, <span className="highlight-gradient">{formData.name}</span>!
                    </h2>

                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                        Sua conta foi criada com sucesso. Prepare-se para evoluir.
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className="cta-button primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        Ir para Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="app-layout" style={{ justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle at center, rgba(0, 255, 136, 0.1) 0%, rgba(13, 13, 13, 1) 100%)' }}>

            <button
                onClick={() => navigate('/')}
                style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <ArrowLeft size={20} /> Voltar para Home
            </button>

            <div className="glass" style={{ padding: '2.5rem', borderRadius: '16px', maxWidth: '400px', width: '100%', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
                    Crie sua Conta <span className="highlight-gradient">APEX</span>
                </h2>

                {error && <div style={{ background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem', border: '1px solid rgba(255, 77, 77, 0.2)' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Nome de Herói</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontSize: '1rem', outline: 'none' }}
                            placeholder="Ex: Aragorn"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email de Contato</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontSize: '1rem', outline: 'none' }}
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Senha Secreta</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', paddingRight: '2.5rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontSize: '1rem', outline: 'none' }}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Confirmar Senha</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                required
                                minLength={6}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', paddingRight: '2.5rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', fontSize: '1rem', outline: 'none' }}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="cta-button primary"
                        disabled={loading}
                        style={{ marginTop: '1rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        {loading ? <span className="pulsing-dot" style={{ width: '10px', height: '10px', background: 'black', boxShadow: 'none' }}></span> : 'Criar Conta Grátis'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Já tem conta? <Link to="/login" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>Entrar</Link>
                </p>
            </div>
        </div>
    );
}
