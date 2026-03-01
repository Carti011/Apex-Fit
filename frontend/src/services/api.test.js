import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from './api';

describe('api service', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    // ─── register ────────────────────────────────────────────────────────────
    describe('register', () => {
        it('registra usuário com sucesso', async () => {
            const mockUser = { name: 'João', token: 'abc' };
            global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockUser });

            const result = await api.register({ name: 'João', email: 'j@j.com', password: '123456' });

            expect(result).toEqual(mockUser);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/auth/register'),
                expect.objectContaining({ method: 'POST' })
            );
        });

        it('lança erro "Email já cadastrado." para status 409', async () => {
            global.fetch.mockResolvedValueOnce({ ok: false, status: 409, json: async () => ({}) });
            await expect(api.register({ email: 'existente@test.com' })).rejects.toThrow('Email já cadastrado.');
        });

        it('lança mensagem da API para outros erros', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false, status: 500, json: async () => ({ message: 'Erro interno do servidor' })
            });
            await expect(api.register({})).rejects.toThrow('Erro interno do servidor');
        });

        it('lança mensagem genérica quando API não retorna mensagem', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false, status: 400, json: async () => ({})
            });
            await expect(api.register({})).rejects.toThrow('Erro ao registrar usuário.');
        });
    });

    // ─── login ───────────────────────────────────────────────────────────────
    describe('login', () => {
        it('faz login com sucesso e retorna dados do usuário', async () => {
            const mockResponse = { token: 'jwt-token', name: 'João' };
            global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockResponse });

            const result = await api.login({ email: 'j@j.com', password: '123456' });
            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/auth/login'),
                expect.objectContaining({ method: 'POST' })
            );
        });

        it('lança erro "Falha no login" quando resposta não é ok', async () => {
            global.fetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
            await expect(api.login({ email: 'x@x.com', password: 'errado' })).rejects.toThrow('Falha no login');
        });
    });

    // ─── getDashboard ────────────────────────────────────────────────────────
    describe('getDashboard', () => {
        it('retorna dados do dashboard com sucesso', async () => {
            const mockDashboard = { level: 3, currentXp: 150 };
            global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockDashboard });

            const result = await api.getDashboard('fake-token');
            expect(result).toEqual(mockDashboard);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/profile/dashboard'),
                expect.objectContaining({
                    headers: expect.objectContaining({ Authorization: 'Bearer fake-token' })
                })
            );
        });

        it('lança erro quando falha ao obter dashboard', async () => {
            global.fetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
            await expect(api.getDashboard('token')).rejects.toThrow('Falha ao obter dados do dashboard');
        });

        it('redireciona para /login e limpa sessão quando token expira (401)', async () => {
            const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
            const mockLocation = { href: '' };
            vi.stubGlobal('location', mockLocation);

            global.fetch.mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({}) });

            await expect(api.getDashboard('token-expirado')).rejects.toThrow('Sessão expirada');
            expect(removeItemSpy).toHaveBeenCalledWith('user');
            expect(mockLocation.href).toBe('/login');

            removeItemSpy.mockRestore();
            vi.unstubAllGlobals();
        });
    });

    // ─── updateBioProfile ────────────────────────────────────────────────────
    describe('updateBioProfile', () => {
        it('atualiza perfil bio com sucesso', async () => {
            const mockUpdated = { level: 2, nutritionPlan: 'Plano X' };
            global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockUpdated });

            const result = await api.updateBioProfile('token', { weight: 80, height: 175 });
            expect(result).toEqual(mockUpdated);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/profile/bio'),
                expect.objectContaining({ method: 'PUT' })
            );
        });

        it('lança erro quando atualização falha', async () => {
            global.fetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
            await expect(api.updateBioProfile('token', {})).rejects.toThrow('Falha ao atualizar perfil');
        });
    });

    // ─── completeQuest ───────────────────────────────────────────────────────
    describe('completeQuest', () => {
        it('completa missão WATER com sucesso', async () => {
            const mockUpdated = { level: 4, currentXp: 250 };
            global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockUpdated });

            const result = await api.completeQuest('fake-token', 'WATER');
            expect(result).toEqual(mockUpdated);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('questType=WATER'),
                expect.objectContaining({ method: 'POST' })
            );
        });

        it('lança erro quando missão não pode ser concluída', async () => {
            global.fetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
            await expect(api.completeQuest('token', 'DIET')).rejects.toThrow('Falha ao concluir missão');
        });
    });

    // ─── chatWithNutritionist ────────────────────────────────────────────────
    describe('chatWithNutritionist', () => {
        it('envia mensagem e recebe resposta da IA', async () => {
            const mockResp = { resposta: 'Aqui está seu plano de dieta!' };
            global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockResp });

            const result = await api.chatWithNutritionist('token', [], 'Quero ganhar massa');
            expect(result).toEqual(mockResp);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/ai/chat'),
                expect.objectContaining({ method: 'POST' })
            );
        });

        it('lança mensagem de erro da API quando IA falha', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Limite de mensagens atingido' })
            });
            await expect(api.chatWithNutritionist('token', [], 'msg')).rejects.toThrow('Limite de mensagens atingido');
        });

        it('lança mensagem genérica quando erro não tem mensagem', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({})
            });
            await expect(api.chatWithNutritionist('token', [], 'msg')).rejects.toThrow('Erro ao se comunicar com a IA');
        });
    });

    // ─── salvarDieta ─────────────────────────────────────────────────────────
    describe('salvarDieta', () => {
        it('salva dieta com sucesso', async () => {
            const mockResp = { nutritionPlan: 'dieta salva...' };
            global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockResp });

            const result = await api.salvarDieta('token', 'Dieta completa do atleta');
            expect(result).toEqual(mockResp);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/ai/salvar-dieta'),
                expect.objectContaining({ method: 'PUT' })
            );
        });

        it('lança erro quando falha ao salvar', async () => {
            global.fetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
            await expect(api.salvarDieta('token', 'dieta')).rejects.toThrow('Falha ao salvar dieta');
        });
    });
});
