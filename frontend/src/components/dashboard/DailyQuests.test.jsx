import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DailyQuests from './DailyQuests';

describe('DailyQuests Component', () => {

    it('deve renderizar as missões não completadas e o botão Concluir', () => {
        const mockUser = {
            waterGoalMet: false,
            dietGoalMet: false,
            workoutGoalMet: false
        };
        const mockOnComplete = vi.fn();

        render(<DailyQuests user={mockUser} onQuestComplete={mockOnComplete} />);

        // Verificar os textos
        expect(screen.getByText('Beba 3 Litros (+20 XP)')).toBeInTheDocument();
        expect(screen.getByText('Fique na dieta (+30 XP)')).toBeInTheDocument();
        expect(screen.getByText('Fui pra academia (+50 XP)')).toBeInTheDocument();

        // Devem ter 3 botões "Concluir"
        const botoes = screen.getAllByRole('button', { name: /Concluir/i });
        expect(botoes.length).toBe(3);
    });

    it('deve esconder o botão Concluir quando a missão está completa', () => {
        const mockUser = {
            waterGoalMet: true,  // Completou água
            dietGoalMet: false,
            workoutGoalMet: true // Completou treino
        };
        const mockOnComplete = vi.fn();

        render(<DailyQuests user={mockUser} onQuestComplete={mockOnComplete} />);

        // Só deve ter 1 botão de concluir (o da dieta)
        const botoes = screen.getAllByRole('button', { name: /Concluir/i });
        expect(botoes.length).toBe(1);
    });

    it('deve chamar onQuestComplete com o tipo de missão correto ao clicar', async () => {
        const mockUser = {
            waterGoalMet: false,
            dietGoalMet: false,
            workoutGoalMet: false
        };
        const mockOnComplete = vi.fn();

        render(<DailyQuests user={mockUser} onQuestComplete={mockOnComplete} />);

        // A ordem dos cards no componente é WATER, DIET, WORKOUT. 
        // Pegando o 2º botão (DIET):
        const botoes = screen.getAllByRole('button', { name: /Concluir/i });

        await act(async () => {
            fireEvent.click(botoes[1]);
        });

        expect(mockOnComplete).toHaveBeenCalledWith('DIET');
    });
});
