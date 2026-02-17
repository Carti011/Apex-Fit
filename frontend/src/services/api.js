const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const api = {
    async register(userData) {
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
            throw new Error('Erro ao registrar usuário.');
        }

        return response.json();
    }
};
