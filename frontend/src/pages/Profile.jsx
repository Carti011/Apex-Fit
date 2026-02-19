import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8 flex justify-center items-start pt-20 relative">
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
                <ArrowRight className="h-5 w-5 rotate-180" />
                Voltar para Home
            </button>
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold mb-8 text-emerald-400">Meu Perfil</h1>

                <div className="bg-neutral-800 p-8 rounded-2xl border border-neutral-700 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl font-bold border border-emerald-500/30">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                            <p className="text-gray-400">{user.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-700">
                            <p className="text-sm text-gray-500 mb-1">Status da Conta</p>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                <span className="text-emerald-400 font-medium">Ativo</span>
                            </div>
                        </div>
                        <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-700">
                            <p className="text-sm text-gray-500 mb-1">Plano</p>
                            <p className="text-white font-medium">Gratuito</p>
                        </div>
                    </div>

                    <div className="border-t border-neutral-700 pt-6">
                        <button
                            onClick={handleLogout}
                            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all font-medium"
                        >
                            Sair da Conta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
