import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { DebateDetailView } from '../DebateDetailView';
import type { DebateJob } from '@/features/debates/types/debate.types';

// Mock do hook useDebateDetail
const mockDebateData: { current: DebateJob | null; isLoading: boolean } = {
  current: null,
  isLoading: false
};

vi.mock('../../hooks/useDebateDetail', () => ({
  useDebateDetail: () => ({
    debate: mockDebateData.current,
    isLoading: mockDebateData.isLoading,
    activeTab: 'facts',
    setActiveTab: vi.fn(),
    currentTimestamp: 0,
    isAutoPlay: false,
    iframeRef: { current: null },
    handleSeek: vi.fn()
  })
}));

describe('DebateDetailView - Exibição de Duração do Vídeo', () => {
  it('deve exibir a duração no formato de horas e minutos reais e não mencionar "min de áudio"', () => {
    mockDebateData.current = {
      id: 'job_tallis_vs_brigadeiro_2026',
      title: 'Duelo de Gestão vs Pragmatismo: Tallis Gomes vs Paulo Brigadeiro',
      youtubeUrl: 'https://www.youtube.com/watch?v=zIwRCVd6-v8',
      youtubeId: 'zIwRCVd6-v8',
      speakers: [
        { name: 'Tallis Gomes' },
        { name: 'Paulo Brigadeiro' }
      ],
      durationSeconds: 8167, // 2h 16m 07s
      status: 'completed',
      progress: 100,
      createdAt: 1726700000000
    };

    render(
      <MemoryRouter>
        <DebateDetailView />
      </MemoryRouter>
    );

    // Deve exibir duração amigável real do vídeo
    expect(screen.getByText('2h 16min')).toBeInTheDocument();

    // NÃO deve conter o texto confuso "min de áudio"
    expect(screen.queryByText(/min de áudio/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/20 min de áudio/i)).not.toBeInTheDocument();
  });

  it('deve exibir duração em minutos quando o vídeo for menor que 1 hora', () => {
    mockDebateData.current = {
      id: 'job_short_debate',
      title: 'Debate Curto',
      youtubeUrl: 'https://www.youtube.com/watch?v=abc',
      youtubeId: 'abc',
      speakers: [{ name: 'A' }, { name: 'B' }],
      durationSeconds: 1240, // 20 min 40s
      status: 'completed',
      progress: 100,
      createdAt: 1726700000000
    };

    render(
      <MemoryRouter>
        <DebateDetailView />
      </MemoryRouter>
    );

    expect(screen.getByText('20 min')).toBeInTheDocument();
    expect(screen.queryByText(/min de áudio/i)).not.toBeInTheDocument();
  });
});
