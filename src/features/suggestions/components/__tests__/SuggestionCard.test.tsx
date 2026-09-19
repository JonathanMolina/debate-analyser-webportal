import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuggestionCard } from '../SuggestionCard';
import type { DebateSuggestion } from '../../types/suggestion.types';

const mockSuggestion: DebateSuggestion = {
  id: 'sugg-test-1',
  youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  youtubeVideoId: 'dQw4w9WgXcQ',
  title: 'Debate Eleitoral Filosófico 2026',
  description: 'Discussão sobre ética e tecnologia.',
  debaters: 'Filósofo A vs Filósofo B',
  submittedBy: 'Usuário Teste',
  likesCount: 15,
  dislikesCount: 2,
  commentsCount: 4,
  status: 'voting',
  createdAt: new Date().toISOString()
};

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe('SuggestionCard Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve renderizar dados da sugestão corretamente', () => {
    const handleWatch = vi.fn();
    renderWithQueryClient(
      <SuggestionCard suggestion={mockSuggestion} onWatchVideo={handleWatch} />
    );

    expect(screen.getByText('Debate Eleitoral Filosófico 2026')).toBeInTheDocument();
    expect(screen.getByText(/Filósofo A vs Filósofo B/)).toBeInTheDocument();
    expect(screen.getByText('Usuário Teste')).toBeInTheDocument();
    expect(screen.getByText('Em Votação')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('deve chamar callback onWatchVideo ao clicar no botão de reprodução', () => {
    const handleWatch = vi.fn();
    renderWithQueryClient(
      <SuggestionCard suggestion={mockSuggestion} onWatchVideo={handleWatch} />
    );

    const playBtn = screen.getByLabelText(/Assistir vídeo: Debate Eleitoral Filosófico 2026/i);
    fireEvent.click(playBtn);

    expect(handleWatch).toHaveBeenCalledWith(mockSuggestion);
  });

  it('deve alternar voto de like otimista ao clicar no botão de curtir', () => {
    const handleWatch = vi.fn();
    renderWithQueryClient(
      <SuggestionCard suggestion={mockSuggestion} onWatchVideo={handleWatch} />
    );

    const likeBtn = screen.getByLabelText('Curtir sugestão');
    expect(screen.getByText('15')).toBeInTheDocument();

    fireEvent.click(likeBtn);

    // Otimista: deve incrementar de 15 para 16
    expect(screen.getByText('16')).toBeInTheDocument();
  });
});
