// Sintetizador de sons via Web Audio API — sem arquivos externos, zero dependências
// Os sons são gerados programaticamente com osciladores, igual a jogos retro.

let _ctx = null;

const getCtx = () => {
    if (!_ctx) {
        _ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Retoma o contexto se suspenso (política de autoplay dos browsers)
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
};

// Toca uma nota: frequência (Hz), duração (s), forma de onda, volume, delay (s)
const tom = (freq, dur, tipo = 'sine', vol = 0.25, delay = 0) => {
    try {
        const c = getCtx();
        const t = c.currentTime + delay;
        const osc = c.createOscillator();
        const gain = c.createGain();

        osc.connect(gain);
        gain.connect(c.destination);

        osc.type = tipo;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(vol, t);
        // Fade out suave para evitar clique no final
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        osc.start(t);
        osc.stop(t + dur + 0.01);
    } catch {
        // Contexto de áudio não disponível (ex: SSR ou browser restrito)
    }
};

export const sons = {
    // Missão concluída: acorde ascendente C5 → E5 → G5
    missaoConcluida: () => {
        tom(523, 0.12, 'sine', 0.25, 0);
        tom(659, 0.12, 'sine', 0.25, 0.13);
        tom(784, 0.32, 'sine', 0.25, 0.26);
    },

    // Level Up: fanfarra C5 → E5 → G5 → C6
    levelUp: () => {
        tom(523,  0.08, 'sine', 0.28, 0);
        tom(659,  0.08, 'sine', 0.28, 0.09);
        tom(784,  0.08, 'sine', 0.28, 0.18);
        tom(1047, 0.55, 'sine', 0.28, 0.28);
    },

    // Salvo com sucesso: dois tons rápidos
    sucesso: () => {
        tom(660, 0.1,  'sine', 0.18, 0);
        tom(880, 0.28, 'sine', 0.18, 0.1);
    },

    // Erro: buzzer descendente
    erro: () => {
        tom(220, 0.3, 'sawtooth', 0.12, 0);
        tom(180, 0.2, 'sawtooth', 0.08, 0.15);
    },
};
