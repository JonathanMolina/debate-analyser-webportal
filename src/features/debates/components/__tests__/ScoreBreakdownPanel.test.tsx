import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScoreBreakdownPanel } from '../ScoreBreakdownPanel';
import type { DebateScore } from '../../types/debate.types';

describe('ScoreBreakdownPanel Component', () => {
  it('deve exibir mensagem de consolidação quando não houver score', () => {
    render(<ScoreBreakdownPanel />);
    expect(
      screen.getByText('Pontuação técnica em consolidação algorítmica.')
    ).toBeInTheDocument();
  });

  it('deve exibir Opinião do Público (Comentários YouTube) com escala de 100 pontos para 2 debatedores', () => {
    const mockScore: DebateScore = {
      winner: 'Debatedor Alfa',
      difference: 20,
      isDraw: false,
      scores: {
        'Debatedor Alfa': 120,
        'Debatedor Beta': 100
      },
      breakdown: {
        'Debatedor Alfa': {
          evidencePoints: 30,
          fallacyPenalties: 0,
          qaPoints: 15,
          tonePoints: 5,
          speakingEfficiency: 5,
          audiencePoints: 65,
          totalPoints: 120
        },
        'Debatedor Beta': {
          evidencePoints: 20,
          fallacyPenalties: 5,
          qaPoints: 10,
          tonePoints: 5,
          speakingEfficiency: 5,
          audiencePoints: 35,
          totalPoints: 100
        }
      }
    };

    render(<ScoreBreakdownPanel score={mockScore} />);

    expect(
      screen.getByText('Opinião do Público (Comentários YouTube)')
    ).toBeInTheDocument();
    expect(screen.getByText('(até +100 pontos distrib.)')).toBeInTheDocument();
    expect(
      screen.getByText('Evidências & Fatos Verificados (+5 Verdadeiro, +2 Discutível, -5 Falso)')
    ).toBeInTheDocument();
    expect(screen.getByText('+65 pontos')).toBeInTheDocument();
    expect(screen.getByText('+35 pontos')).toBeInTheDocument();
  });

  it('deve exibir escala de 250 pontos distribuidos para 5 debatedores', () => {
    const speakers = ['D1', 'D2', 'D3', 'D4', 'D5'];
    const breakdown: Record<string, any> = {};
    const scores: Record<string, number> = {};

    speakers.forEach((s) => {
      scores[s] = 100;
      breakdown[s] = {
        evidencePoints: 20,
        fallacyPenalties: 0,
        qaPoints: 10,
        tonePoints: 5,
        speakingEfficiency: 5,
        audiencePoints: 50,
        totalPoints: 100
      };
    });

    const mockScore: DebateScore = {
      winner: 'D1',
      difference: 0,
      isDraw: true,
      scores,
      breakdown
    };

    render(<ScoreBreakdownPanel score={mockScore} />);

    expect(
      screen.getByText('Opinião do Público (Comentários YouTube)')
    ).toBeInTheDocument();
    expect(screen.getByText('(até +250 pontos distrib.)')).toBeInTheDocument();
  });

  it('deve exibir linha de Propostas & Soluções com pontuação correta', () => {
    const mockScore: DebateScore = {
      winner: 'Debatedor Alfa',
      difference: 15,
      isDraw: false,
      scores: {
        'Debatedor Alfa': 115,
        'Debatedor Beta': 100
      },
      breakdown: {
        'Debatedor Alfa': {
          evidencePoints: 20,
          fallacyPenalties: 0,
          proposalPoints: 15, // 3 propostas * 5
          qaPoints: 10,
          tonePoints: 5,
          speakingEfficiency: 5,
          totalPoints: 115
        },
        'Debatedor Beta': {
          evidencePoints: 20,
          fallacyPenalties: 0,
          proposalPoints: 5, // 1 proposta * 5
          qaPoints: 10,
          tonePoints: 5,
          speakingEfficiency: 5,
          totalPoints: 100
        }
      }
    };

    render(<ScoreBreakdownPanel score={mockScore} />);

    const proposalsRow = screen.getByText('Propostas & Soluções (+5 pontos cada)').closest('tr');
    expect(proposalsRow).toBeInTheDocument();
    expect(proposalsRow).toHaveTextContent('+15 pontos');
    expect(proposalsRow).toHaveTextContent('+5 pontos');
  });

  it('deve exibir 0 pontos para propostas em debates antigos sem crashar', () => {
    const mockLegacyScore: DebateScore = {
      winner: 'Debatedor Alfa',
      difference: 10,
      isDraw: false,
      scores: {
        'Debatedor Alfa': 100,
        'Debatedor Beta': 90
      },
      breakdown: {
        'Debatedor Alfa': {
          evidencePoints: 20,
          fallacyPenalties: 0,
          // proposalPoints ausente (debate legado)
          qaPoints: 10,
          tonePoints: 5,
          speakingEfficiency: 5,
          totalPoints: 100
        },
        'Debatedor Beta': {
          evidencePoints: 10,
          fallacyPenalties: 0,
          // proposalPoints ausente
          qaPoints: 10,
          tonePoints: 5,
          speakingEfficiency: 5,
          totalPoints: 90
        }
      }
    };

    render(<ScoreBreakdownPanel score={mockLegacyScore} />);

    const legacyRow = screen.getByText('Propostas & Soluções (+5 pontos cada)').closest('tr');
    expect(legacyRow).toBeInTheDocument();
    expect(legacyRow).toHaveTextContent('+0 pontos');
  });

  it('deve exibir linha de Repercussão Web (Google Trends) com +50 pontos para o líder de buscas', () => {
    const mockScoreWithTrends: DebateScore = {
      winner: 'Debatedor Beta',
      difference: 30,
      isDraw: false,
      scores: {
        'Debatedor Alfa': 100,
        'Debatedor Beta': 130
      },
      breakdown: {
        'Debatedor Alfa': {
          evidencePoints: 20,
          fallacyPenalties: 0,
          qaPoints: 10,
          tonePoints: 5,
          speakingEfficiency: 5,
          searchImpactPoints: 0,
          totalPoints: 100
        },
        'Debatedor Beta': {
          evidencePoints: 20,
          fallacyPenalties: 0,
          qaPoints: 10,
          tonePoints: 5,
          speakingEfficiency: 5,
          searchImpactPoints: 50,
          totalPoints: 130
        }
      }
    };

    render(<ScoreBreakdownPanel score={mockScoreWithTrends} />);

    expect(screen.getByText('Repercussão Web (Google Trends)')).toBeInTheDocument();
    expect(screen.getByText('(pontos = % de buscas obtida)')).toBeInTheDocument();
    expect(screen.getByText('+50 pontos')).toBeInTheDocument();
  });
});
