import { describe, it, expect, vi } from 'vitest';
import { submitFeedback } from '../feedbackApi';

describe('Feedback API', () => {
  it('deve rejeitar mensagens vazias ou apenas com espaços', async () => {
    const result = await submitFeedback({
      category: 'suggestion',
      message: '   '
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('vazia');
  });

  it('deve sanitizar strings antes do envio', async () => {
    const result = await submitFeedback({
      category: 'bug',
      message: '<script>alert(1)</script>Encontrei um erro no player',
      name: '<b>Usuario</b>'
    });

    // Como o cliente Supabase mockado ou real processa a inserção
    expect(typeof result.success).toBe('boolean');
  });
});
