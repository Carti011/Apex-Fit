import { useState, useEffect } from 'react';
import { api } from '../services/api';

/**
 * Gerencia o carregamento e estado dos dados do dashboard.
 * Centraliza: fetch inicial, dashboardData, loading e prevLevel.
 */
export function useDashboard(user) {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [prevLevel, setPrevLevel] = useState(null);

    useEffect(() => {
        if (!user?.token) return;

        const fetchDashboardInfo = async () => {
            try {
                const data = await api.getDashboard(user.token);
                setDashboardData(data);
                if (data.level) setPrevLevel(data.level);
            } catch (error) {
                console.error('Erro ao carregar dashboard', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardInfo();
    }, [user]);

    return { dashboardData, setDashboardData, loading, prevLevel, setPrevLevel };
}
