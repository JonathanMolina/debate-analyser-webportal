import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProposalsList } from '../ProposalsList';
import type { ProposalItem } from '../../types/debate.types';

describe('ProposalsList Component', () => {
  it('deve exibir mensagem de estado vazio quando não houver propostas', () => {
    render(<ProposalsList proposals={[]} onSeek={vi.fn()} />);

    expect(
      screen.getByText('Nenhuma proposta ou solução explícita foi mapeada neste debate.')
    ).toBeInTheDocument();
  });

  it('deve exibir itens de propostas com orador, tópico, contexto, citação e pontuação', () => {
    const mockProposals: ProposalItem[] = [
      {
        id: 'prop_1',
        timestamp: 125,
        speaker: 'Candidato Alfa',
        topic: 'Saúde Pública',
        quote: 'Defendo a informatização total dos prontuários das UBSs para zerar filas.',
        context: 'Debate sobre demora no atendimento primário e desperdício de medicamentos.'
      },
      {
        id: 'prop_2',
        timestamp: 300,
        speaker: 'Candidato Beta',
        topic: 'Transporte',
        quote: 'Proponho a ampliação das faixas exclusivas de ônibus com bilhete único metropolitano.',
        context: 'Discussão sobre mobilidade e tempo de deslocamento urbano.'
      }
    ];

    const mockOnSeek = vi.fn();
    render(<ProposalsList proposals={mockProposals} onSeek={mockOnSeek} />);

    // Verifica banner neutro
    expect(screen.getByText('Mapeamento de Propostas & Soluções')).toBeInTheDocument();

    // Oradores e tópicos
    expect(screen.getByText('Candidato Alfa')).toBeInTheDocument();
    expect(screen.getByText('Saúde Pública')).toBeInTheDocument();
    expect(screen.getByText('Candidato Beta')).toBeInTheDocument();
    expect(screen.getByText('Transporte')).toBeInTheDocument();

    // Citações e contextos
    expect(
      screen.getByText('"Defendo a informatização total dos prontuários das UBSs para zerar filas."')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Debate sobre demora no atendimento primário e desperdício de medicamentos.')
    ).toBeInTheDocument();

    // Pontos (+5 pts)
    const pointsBadges = screen.getAllByText('+5 pts');
    expect(pointsBadges.length).toBe(2);

    // Timestamps
    expect(screen.getByText('Timestamp: 2:05')).toBeInTheDocument();
    expect(screen.getByText('Timestamp: 5:00')).toBeInTheDocument();

    // Seek interaction
    fireEvent.click(screen.getByText('Timestamp: 2:05'));
    expect(mockOnSeek).toHaveBeenCalledWith(125);
  });
});
