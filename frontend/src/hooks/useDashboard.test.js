import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDashboard } from './useDashboard';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
    api: {
        getDashboard: vi.fn()
    }
}));

describe('useDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('retorna loading=true antes do fetch completar', () => {
        // Promessa que nunca resolve para manter o loading
        api.getDashboard.mockReturnValueOnce(new Promise(() => {}));
        const { result } = renderHook(() => useDashboard({ token: 'fake-token' }));
        expect(result.current.loading).toBe(true);
    });

    it('retorna dashboardData=null e loading=true no estado inicial', () => {
        api.getDashboard.mockReturnValueOnce(new Promise(() => {}));
        const { result } = renderHook(() => useDashboard({ token: 'fake-token' }));
        expect(result.current.dashboardData).toBeNull();
    });

    it('carrega dados do dashboard com sucesso', async () => {
        const mockData = { level: 5, currentXp: 200, name: 'João' };
        // mockResolvedValue (sem Once) garante que o StrictMode do React 18,
        // que invoca os effects duas vezes, sempre receba o mesmo dado.
        api.getDashboard.mockResolvedValue(mockData);

        const { result } = renderHook(() => useDashboard({ token: 'fake-token' }));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.dashboardData).toEqual(mockData);
        expect(api.getDashboard).toHaveBeenCalledWith('fake-token');
    });

    it('define prevLevel com o level recebido da API', async () => {
        api.getDashboard.mockResolvedValue({ level: 7, currentXp: 350 });

        const { result } = renderHook(() => useDashboard({ token: 'fake-token' }));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.prevLevel).toBe(7);
    });

    it('não faz fetch se o user não tiver token', () => {
        renderHook(() => useDashboard({}));
        expect(api.getDashboard).not.toHaveBeenCalled();
    });

    it('não faz fetch se user for null', () => {
        renderHook(() => useDashboard(null));
        expect(api.getDashboard).not.toHaveBeenCalled();
    });

    it('define loading=false mesmo quando a API retorna erro', async () => {
        api.getDashboard.mockRejectedValue(new Error('Erro de rede'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const { result } = renderHook(() => useDashboard({ token: 'fake-token' }));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.dashboardData).toBeNull();
        consoleSpy.mockRestore();
    });

    it('expõe setDashboardData para atualização manual', async () => {
        const mockData = { level: 1 };
        api.getDashboard.mockResolvedValue(mockData);

        const { result } = renderHook(() => useDashboard({ token: 'fake-token' }));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(typeof result.current.setDashboardData).toBe('function');
        expect(typeof result.current.setPrevLevel).toBe('function');
    });
});
