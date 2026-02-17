import { useState, useEffect } from 'react';
import { Activity, Zap, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [status, setStatus] = useState('Verificando...');
    const navigate = useNavigate();

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        fetch(`${apiUrl}/api/v1/status`)
            .then(res => res.json())
            .then(() => setStatus('Online 🟢'))
            .catch((err) => {
                console.error("Erro ao verificar status:", err);
                setStatus('Offline 🔴');
            });
    }, []);

    return (
        <>
            <header className="relative overflow-hidden pt-20 pb-32">
                <div className="status-pill absolute top-4 right-4 bg-slate-800/80 backdrop-blur px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2 text-sm text-slate-300">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${status.includes('Online') ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    API Status: {status}
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 text-center">

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-white">
                        EVOLUA SEU CORPO<br />
                        COMO UM <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">RPG</span>
                    </h1>

                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Transforme treinos em XP. Supere missões diárias.
                        Conquiste o shape lendário com a nossa tecnologia de gamificação biomecânica.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

            <section className="py-20 bg-slate-800/30" id="features">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-16 text-white">
                        ARSENAL <span className="text-emerald-400">TECNOLÓGICO</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:border-emerald-500/30 transition-all hover:-translate-y-1">
                            <div className="w-14 h-14 bg-slate-700/50 rounded-xl flex items-center justify-center mb-6 text-emerald-400">
                                <Activity size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Tracking Biométrico</h3>
                            <p className="text-slate-400 leading-relaxed">Monitore cada repetição e carga com gráficos de evolução em tempo real.</p>
                        </div>

                        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-all hover:-translate-y-1">
                            <div className="w-14 h-14 bg-slate-700/50 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                                <Zap size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Gamificação Hardcore</h3>
                            <p className="text-slate-400 leading-relaxed">Suba de nível, desbloqueie conquistas e entre para ligas competitivas.</p>
                        </div>

                        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:border-purple-500/30 transition-all hover:-translate-y-1">
                            <div className="w-14 h-14 bg-slate-700/50 rounded-xl flex items-center justify-center mb-6 text-purple-400">
                                <TrendingUp size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Metabolismo Inteligente</h3>
                            <p className="text-slate-400 leading-relaxed">IA que ajusta seus macros (TMB/GET) automaticamente conforme você evolui.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
