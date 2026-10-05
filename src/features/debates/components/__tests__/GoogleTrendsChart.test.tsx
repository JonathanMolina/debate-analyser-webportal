import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GoogleTrendsChart } from '../GoogleTrendsChart';
import type { GoogleTrendsMetrics } from '../../types/debate.types';

const MOCK_TRENDS: GoogleTrendsMetrics = {
  windowStart: '20:00',
  windowEnd: '+24h',
  winner: 'Candidato Alfa',
  winnerShare: 62.5,
  isDraw: false,
  shares: {
    'Candidato Alfa': 62.5,
    'Candidato Beta': 37.5
  },
  averages: {
    'Candidato Alfa': 50,
    'Candidato Beta': 30
  },
  timeline: [
    { timestamp: '1728000000', formattedTime: '20:00', relativeHour: 0, values: { 'Candidato Alfa': 40, 'Candidato Beta': 25 } },
    { timestamp: '1728003600', formattedTime: '21:00', relativeHour: 1, values: { 'Candidato Alfa': 80, 'Candidato Beta': 45 } },
    { timestamp: '1728007200', formattedTime: '22:00', relativeHour: 2, values: { 'Candidato Alfa': 60, 'Candidato Beta': 35 } }
  ]
};

describe('GoogleTrendsChart Component (Webportal)', () => {
  it('renderiza fallback quando não há dados de tendências', () => {
    render(<GoogleTrendsChart trends={undefined} />);
    expect(screen.getByText('Dado não avaliado para esse debate.')).toBeInTheDocument();
  });

  it('renderiza líder de buscas, badges de pontos e percentuais', () => {
    render(<GoogleTrendsChart trends={MOCK_TRENDS} />);
    expect(screen.getByText(/Maior Repercussão: Candidato Alfa/i)).toBeInTheDocument();
    expect(screen.getByText('62.5%')).toBeInTheDocument();
    expect(screen.getByText('37.5%')).toBeInTheDocument();
    expect(screen.getByText('+63 PTS')).toBeInTheDocument();
    expect(screen.getByText('+38 PTS')).toBeInTheDocument();
  });

  it('renderiza badge de empate técnico quando isDraw é true', () => {
    const drawTrends: GoogleTrendsMetrics = {
      ...MOCK_TRENDS,
      winner: 'Empate Técnico',
      isDraw: true
    };
    render(<GoogleTrendsChart trends={drawTrends} />);
    expect(screen.getByText(/Empate em Repercussão/i)).toBeInTheDocument();
  });
});
