import { describe, it, expect, vi } from 'vitest';
import { supabase } from '@/app/supabase/client';
import { createSuggestion, fetchComments, addComment, fetchSuggestions } from '../suggestionsApi';

describe('suggestionsApi', () => {
  it('deve rejeitar requisição com honeypot preenchido (anti-bot)', async () => {
    const result = await createSuggestion({
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'Debate Teste',
      honeypot: 'bot-content'
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Requisição inválida.');
  });

  it('deve rejeitar URL do YouTube inválida', async () => {
    const result = await createSuggestion({
      youtubeUrl: 'https://site-invalido.com/video',
      title: 'Debate Teste'
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('URL do YouTube inválida');
  });

  it('deve rejeitar sugestão com título vazio', async () => {
    const result = await createSuggestion({
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: '   '
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('título do debate é obrigatório');
  });

  it('deve adicionar comentário com sucesso quando dados forem válidos', async () => {
    vi.spyOn(supabase, 'from').mockReturnValueOnce({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'comm-123',
              suggestion_id: 'sugg-1',
              author_name: 'Apoiador Cívico',
              content: 'Comentário de teste sobre a proposta',
              created_at: new Date().toISOString()
            },
            error: null
          })
        })
      })
    } as unknown as ReturnType<typeof supabase.from>);

    const result = await addComment({
      suggestionId: 'sugg-1',
      authorName: 'Apoiador Cívico',
      content: 'Comentário de teste sobre a proposta'
    });

    expect(result.success).toBe(true);
    expect(result.data?.id).toBe('comm-123');
    expect(result.data?.content).toBe('Comentário de teste sobre a proposta');
  });

  it('deve rejeitar comentário com conteúdo vazio', async () => {
    const result = await addComment({
      suggestionId: 'mock-sugg-1',
      authorName: 'Tester',
      content: '   '
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('não pode ser vazio');
  });
});
