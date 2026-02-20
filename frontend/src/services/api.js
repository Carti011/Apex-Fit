const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

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
        const response = await fetch(`${API_URL}/profile/dashboard`, {
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
        const response = await fetch(`${API_URL}/profile/bio`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bioData),
        });

        if (!response.ok) {
            throw new Error('Falha ao atualizar perfil');
        }

        return response.json();
    },

    completeQuest: async (token, questType) => {
        const response = await fetch(`${API_URL}/gamification/quests/complete?questType=${questType}`, {
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
    }
};
