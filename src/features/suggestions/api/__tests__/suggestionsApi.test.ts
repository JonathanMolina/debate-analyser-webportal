import { describe, it, expect, vi } from 'vitest';
import { createSuggestion } from '../suggestionsApi';

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
});
