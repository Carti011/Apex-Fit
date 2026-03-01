import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useToast } from './useToast';

describe('useToast', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('retorna estado inicial correto', () => {
        const { result } = renderHook(() => useToast());
        expect(result.current.toast.show).toBe(false);
        expect(result.current.toast.message).toBe('');
        expect(result.current.toast.type).toBe('success');
    });

    it('showToast exibe a mensagem com tipo "success" por padrão', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showToast('Perfil salvo!');
        });

        expect(result.current.toast.show).toBe(true);
        expect(result.current.toast.message).toBe('Perfil salvo!');
        expect(result.current.toast.type).toBe('success');
    });

    it('showToast aceita tipo "error"', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showToast('Erro ao salvar.', 'error');
        });

        expect(result.current.toast.show).toBe(true);
        expect(result.current.toast.type).toBe('error');
        expect(result.current.toast.message).toBe('Erro ao salvar.');
    });

    it('esconde o toast automaticamente após 3 segundos', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showToast('Mensagem temporária');
        });

        expect(result.current.toast.show).toBe(true);

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(result.current.toast.show).toBe(false);
        // Mantém a mensagem mesmo depois de esconder
        expect(result.current.toast.message).toBe('Mensagem temporária');
    });

    it('não esconde o toast antes dos 3 segundos', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showToast('Ainda aparecendo');
        });

        act(() => {
            vi.advanceTimersByTime(2999);
        });

        expect(result.current.toast.show).toBe(true);
    });
});
