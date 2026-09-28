import { describe, it, expect } from 'vitest';
import {
  formatMatchRecordFull,
  formatMatchRecordCompact,
  formatPointsLabel
} from '../metricFormatters';

describe('metricFormatters', () => {
  it('deve formatar histórico completo com concordância correta de singular e plural', () => {
    expect(formatMatchRecordFull(1, 0, 0)).toBe('1 vitória • 0 empates • 0 derrotas');
    expect(formatMatchRecordFull(3, 1, 2)).toBe('3 vitórias • 1 empate • 2 derrotas');
  });

  it('deve formatar histórico compacto legível para mobile', () => {
    expect(formatMatchRecordCompact(1, 0, 0)).toBe('1 vit. • 0 emp. • 0 der.');
    expect(formatMatchRecordCompact(5, 2, 1)).toBe('5 vit. • 2 emp. • 1 der.');
  });

  it('deve formatar label de pontos por extenso', () => {
    expect(formatPointsLabel(270)).toBe('270 pontos');
    expect(formatPointsLabel('120')).toBe('120 pontos');
  });
});
