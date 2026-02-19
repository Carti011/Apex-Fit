import { useState } from 'react';
import { useAuth } from '../context/AuthContext';


import { User, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate('/profile'); // Redirect to profile after login
        } catch (err) {
            setError('Falha no login. Verifique suas credenciais.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 relative">
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
                <ArrowRight className="h-5 w-5 rotate-180" />
                Voltar para Home
            </button>
            <div className="w-full max-w-md bg-neutral-800 rounded-2xl shadow-xl border border-neutral-700/50 p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                        Bem-vindo de volta
                    </h2>
                    <p className="text-gray-400 mt-2">Entre para continuar sua jornada</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Senha</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-10 py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Entrar
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-400">
                        Não tem uma conta?{' '}
                        <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline transition-colors">
                            Criar conta
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
