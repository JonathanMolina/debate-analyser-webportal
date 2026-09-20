import { describe, it, expect } from 'vitest';
import { formatVideoBadgeDuration, formatVideoHumanDuration } from '../duration';

describe('duration utilities', () => {
  describe('formatVideoBadgeDuration', () => {
    it('deve formatar vídeos com menos de 1 hora no padrão MM:SS', () => {
      expect(formatVideoBadgeDuration(1240)).toBe('20:40');
      expect(formatVideoBadgeDuration(65)).toBe('1:05');
      expect(formatVideoBadgeDuration(599)).toBe('9:59');
    });

    it('deve formatar vídeos com 1 hora ou mais no padrão H:MM:SS (estilo YouTube)', () => {
      // 8167s = 2h 16m 07s
      expect(formatVideoBadgeDuration(8167)).toBe('2:16:07');
      // 3600s = 1h 00m 00s
      expect(formatVideoBadgeDuration(3600)).toBe('1:00:00');
      // 3665s = 1h 01m 05s
      expect(formatVideoBadgeDuration(3665)).toBe('1:01:05');
    });

    it('deve retornar string vazia para valores nulos, indefinidos, zero ou negativos', () => {
      expect(formatVideoBadgeDuration(undefined)).toBe('');
      expect(formatVideoBadgeDuration(0)).toBe('');
      expect(formatVideoBadgeDuration(-10)).toBe('');
      expect(formatVideoBadgeDuration(NaN)).toBe('');
    });
  });

  describe('formatVideoHumanDuration', () => {
    it('deve formatar vídeos longos com horas e minutos sem menção confusa a áudio', () => {
      // 8167s = 2h 16m 07s
      expect(formatVideoHumanDuration(8167)).toBe('2h 16min');
      // 3600s = 1h
      expect(formatVideoHumanDuration(3600)).toBe('1h');
      // 7200s = 2h
      expect(formatVideoHumanDuration(7200)).toBe('2h');
    });

    it('deve formatar vídeos com menos de 1 hora em minutos', () => {
      expect(formatVideoHumanDuration(1240)).toBe('20 min');
      expect(formatVideoHumanDuration(1800)).toBe('30 min');
      expect(formatVideoHumanDuration(30)).toBe('< 1 min');
    });

    it('deve retornar string vazia para valores nulos, indefinidos, zero ou negativos', () => {
      expect(formatVideoHumanDuration(undefined)).toBe('');
      expect(formatVideoHumanDuration(0)).toBe('');
      expect(formatVideoHumanDuration(-50)).toBe('');
      expect(formatVideoHumanDuration(NaN)).toBe('');
    });
  });
});
