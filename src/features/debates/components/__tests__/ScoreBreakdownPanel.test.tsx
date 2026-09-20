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

  it('deve exibir Opinião do Público (Comentários YouTube) com escala de 100 pts para 2 debatedores', () => {
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
    expect(screen.getByText('(até +100 pts distrib.)')).toBeInTheDocument();
    expect(
      screen.getByText('Evidências & Fatos Verificados (+5 V, +2 D, -5 F)')
    ).toBeInTheDocument();
    expect(screen.getByText('+65 pts')).toBeInTheDocument();
    expect(screen.getByText('+35 pts')).toBeInTheDocument();
  });

  it('deve exibir escala de 250 pts distribuidos para 5 debatedores', () => {
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
    expect(screen.getByText('(até +250 pts distrib.)')).toBeInTheDocument();
  });
});
