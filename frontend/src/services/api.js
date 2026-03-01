const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

async function fetchWithAuth(url, options = {}) {
    const response = await fetch(url, options);
    if (response.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Sessão expirada. Faça login novamente.');
    }
    return response;
}

export const api = {
    async register(userData) {
        // Ajuste para o endpoint correto do seu backend
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            if (response.status === 409) {
                throw new Error('Email já cadastrado.');
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Erro ao registrar usuário.');
        }

        return response.json();
    },

    login: async (credentials) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error('Falha no login');
        }

        return response.json();
    },

    getDashboard: async (token) => {
        const response = await fetchWithAuth(`${API_URL}/profile/dashboard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Falha ao obter dados do dashboard');
        }

        return response.json();
    },

    updateBioProfile: async (token, bioData) => {
        // Usa fetch direto (sem fetchWithAuth) para que o chamador decida como tratar o 401
        const response = await fetch(`${API_URL}/profile/bio`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bioData),
        });

        if (response.status === 401) {
            throw new Error('SESSION_EXPIRED');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Falha ao atualizar perfil');
        }

        return response.json();
    },

    updateAccountProfile: async (token, accountData) => {
        const response = await fetchWithAuth(`${API_URL}/profile/account`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(accountData),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Falha ao atualizar configurações da conta');
        }

        return response.json();
    },

    completeQuest: async (token, questType) => {
        const response = await fetchWithAuth(`${API_URL}/gamification/quests/complete?questType=${questType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Falha ao concluir missão');
        }

        return response.json();
    },

    getGamificationHistory: async (token) => {
        const response = await fetchWithAuth(`${API_URL}/gamification/history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Falha ao obter histórico de xp');
        }

        return response.json();
    },

    // Envia uma mensagem para o Agente Nutricionista de IA
    chatWithNutritionist: async (token, historico, novaMensagem) => {
        const response = await fetchWithAuth(`${API_URL}/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ historico, novaMensagem })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Erro ao se comunicar com a IA');
        }

        return response.json();
    },

    // Envia mensagem via streaming SSE — onChunk(text), onDone(), onError(msg)
    chatWithNutritionistStream: (token, historico, novaMensagem, onChunk, onDone, onError) => {
        fetch(`${API_URL}/ai/chat/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ historico, novaMensagem })
        }).then(async response => {
            if (response.status === 401) {
                localStorage.removeItem('user');
                window.location.href = '/login';
                onError?.('Sessão expirada');
                return;
            }
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                onError?.(err.message || 'Erro ao se comunicar com a IA');
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            // Estado do evento SSE atual — acumula linhas até linha em branco (spec SSE)
            let eventoTipo = null;
            let eventoDataLinhas = [];

            const despacharEvento = () => {
                if (eventoDataLinhas.length === 0 && !eventoTipo) return;
                // Múltiplas linhas data: do mesmo evento são unidas com \n (preserva quebras)
                const data = eventoDataLinhas.join('\n');
                if (eventoTipo === 'done') {
                    onDone?.();
                } else if (eventoTipo === 'error') {
                    onError?.('Erro ao processar resposta da IA');
                } else if (data) {
                    onChunk?.(data);
                }
                eventoTipo = null;
                eventoDataLinhas = [];
            };

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // mantém linha incompleta no buffer

                for (const line of lines) {
                    if (line === '') {
                        despacharEvento(); // linha em branco = fim do evento SSE
                    } else if (line.startsWith('event: ')) {
                        eventoTipo = line.slice(7).trim();
                    } else if (line.startsWith('data: ')) {
                        eventoDataLinhas.push(line.slice(6));
                    }
                }
            }
            despacharEvento(); // garante último evento sem linha em branco final
            onDone?.();
        }).catch(err => {
            onError?.(err.message || 'Erro ao se comunicar com a IA');
        });
    },

    // Salva a dieta aprovada pelo usuario no banco
    salvarDieta: async (token, dietaPlan) => {
        const response = await fetchWithAuth(`${API_URL}/ai/salvar-dieta`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ dietaPlan })
        });

        if (!response.ok) {
            throw new Error('Falha ao salvar dieta');
        }

        return response.json();
    }
};

