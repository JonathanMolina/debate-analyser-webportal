import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { DebateCard } from '../DebateCard';
import type { DebateJob } from '@/features/debates/types/debate.types';

const baseMockDebate: DebateJob = {
  id: 'job_test',
  title: 'Debate de Teste',
  description: 'Descrição de teste',
  youtubeUrl: 'https://www.youtube.com/watch?v=zIwRCVd6-v8',
  youtubeId: 'zIwRCVd6-v8',
  speakers: [
    { name: 'Debatedor 1' },
    { name: 'Debatedor 2' }
  ],
  status: 'completed',
  progress: 100,
  createdAt: 1726700000000
};

describe('DebateCard', () => {
  it('deve exibir formato H:MM:SS para debates com mais de 1 hora de vídeo', () => {
    const longDebate: DebateJob = {
      ...baseMockDebate,
      durationSeconds: 8167 // 2h 16m 07s
    };

    render(
      <MemoryRouter>
        <DebateCard debate={longDebate} />
      </MemoryRouter>
    );

    expect(screen.getByText('2:16:07')).toBeInTheDocument();
  });

  it('deve exibir formato MM:SS para debates com menos de 1 hora', () => {
    const shortDebate: DebateJob = {
      ...baseMockDebate,
      durationSeconds: 1240 // 20m 40s
    };

    render(
      <MemoryRouter>
        <DebateCard debate={shortDebate} />
      </MemoryRouter>
    );

    expect(screen.getByText('20:40')).toBeInTheDocument();
  });

  it('não deve exibir badge fake ou hardcoded quando não houver duração informada', () => {
    const noDurationDebate: DebateJob = {
      ...baseMockDebate,
      durationSeconds: undefined
    };

    render(
      <MemoryRouter>
        <DebateCard debate={noDurationDebate} />
      </MemoryRouter>
    );

    expect(screen.queryByText('20:40')).not.toBeInTheDocument();
  });

  it('deve exibir indicador de propostas com ícone e tooltip de explicação', () => {
    const debateWithProposals: DebateJob = {
      ...baseMockDebate,
      proposals: [
        {
          id: 'p1',
          timestamp: 100,
          speaker: 'Debatedor 1',
          quote: 'Proposta 1'
        },
        {
          id: 'p2',
          timestamp: 200,
          speaker: 'Debatedor 2',
          quote: 'Proposta 2'
        },
        {
          id: 'p3',
          timestamp: 300,
          speaker: 'Debatedor 1',
          quote: 'Proposta 3'
        }
      ]
    };

    render(
      <MemoryRouter>
        <DebateCard debate={debateWithProposals} />
      </MemoryRouter>
    );

    // Deve exibir a contagem "3" de propostas
    const proposalsElement = screen.getByTitle('Propostas e soluções');
    expect(proposalsElement).toBeInTheDocument();
    expect(proposalsElement).toHaveTextContent('3');
  });

  it('deve exibir 0 propostas para debates antigos sem propostas mapeadas sem travar', () => {
    const legacyDebate: DebateJob = {
      ...baseMockDebate,
      proposals: undefined
    };

    render(
      <MemoryRouter>
        <DebateCard debate={legacyDebate} />
      </MemoryRouter>
    );

    const proposalsElement = screen.getByTitle('Propostas e soluções');
    expect(proposalsElement).toBeInTheDocument();
    expect(proposalsElement).toHaveTextContent('0');
  });
});
