import { describe, it, expect } from 'vitest';
import { getFallacyExplanation } from '../fallacyExplanations';

describe('fallacyExplanations', () => {
  it('deve resolver explicação correta para Tu Quoque / Ad Hominem', () => {
    const res = getFallacyExplanation('Tu Quoque / Ad Hominem');
    expect(res.title).toBe('Tu Quoque / Ad Hominem');
    expect(res.explanation).toContain('você também fez o mesmo');
  });

  it('deve resolver explicação correta para Espantalho', () => {
    const res = getFallacyExplanation('Espantalho');
    expect(res.title).toBe('Falácia do Espantalho');
    expect(res.explanation).toContain('Distorce');
  });

  it('deve resolver explicação correta para Ad Hominem simples', () => {
    const res = getFallacyExplanation('Ad Hominem');
    expect(res.title).toBe('Falácia Ad Hominem (Ataque Pessoal)');
    expect(res.explanation).toContain('Ataca o caráter');
  });

  it('deve lidar com maiúsculas, minúsculas e acentos', () => {
    const res = getFallacyExplanation('apelo à emoção');
    expect(res.title).toBe('Apelo à Emoção (Ad Passiones)');
  });

  it('deve fornecer fallback seguro para falácias não cadastradas', () => {
    const res = getFallacyExplanation('Falácia Personalizada XYZ');
    expect(res.title).toBe('Falácia: Falácia Personalizada XYZ');
    expect(res.explanation).toContain('Desvio da lógica argumentativa');
  });
});
