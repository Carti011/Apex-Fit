import React from 'react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-cyan-500 selection:text-white">
            {/* Navbar */}
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Apex Fit
                </div>
                <div className="space-x-4">
                    <button className="px-4 py-2 text-slate-300 hover:text-white transition">Login</button>
                    <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition transform hover:-translate-y-0.5">
                        Começar Agora
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 text-sm font-medium mb-4">
                        🚀 Gamificação Fitness
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
                        Treine como um <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Campeão</span>.
                        <br />
                        Evolua no <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Jogo</span>.
                    </h1>
                    <p className="text-slate-400 text-lg lg:text-xl max-w-xl leading-relaxed">
                        Transforme seus treinos em missões. Ganhe XP, suba de nível e compita com amigos.
                        Sua jornada fitness nunca foi tão viciante.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-lg shadow-xl shadow-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/30 transition transform hover:-translate-y-1">
                            Criar Conta Grátis
                        </button>
                        <button className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-700 transition flex items-center justify-center gap-2">
                            <span>🎮</span> Como funciona
                        </button>
                    </div>
                </div>

                {/* Visual Element (Placeholder for 3D/Image) */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-slate-800 rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
                        <div className="flex flex-col gap-6">
                            {/* Mock Card 1 */}
                            <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-2xl">🔥</div>
                                <div>
                                    <div className="text-slate-400 text-xs uppercase font-bold tracking-wider">Ofensiva Atual</div>
                                    <div className="text-white font-bold text-xl">12 Dias</div>
                                </div>
                            </div>
                            {/* Mock Card 2 */}
                            <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl">🏆</div>
                                <div>
                                    <div className="text-slate-400 text-xs uppercase font-bold tracking-wider">Liga Atual</div>
                                    <div className="text-white font-bold text-xl">Diamante</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
