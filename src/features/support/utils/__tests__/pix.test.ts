import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { calculateCrc16, formatTlv, generatePixPayload, getPixConfig } from '../pix';

describe('Pix Utility', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_PIX_KEY', '');
    vi.stubEnv('VITE_PIX_PAYLOAD', '');
    vi.stubEnv('VITE_PIX_NAME', '');
    vi.stubEnv('VITE_PIX_CITY', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('deve calcular corretamente o CRC16-CCITT', () => {
    const raw = '00020126410014br.gov.bcb.pix0119pix@argumeta.com.br5204000053039865802BR5908Argumeta6009SAO PAULO62070503***6304';
    const crc = calculateCrc16(raw);
    expect(crc).toBe('0064');
  });

  it('deve formatar TLV com dois dígitos de tamanho', () => {
    expect(formatTlv('00', '01')).toBe('000201');
    expect(formatTlv('58', 'BR')).toBe('5802BR');
  });

  it('deve gerar payload Pix válido com sanitização de acentuação', () => {
    const payload = generatePixPayload({
      key: 'contato@argumeta.com.br',
      name: 'Argumeta Análise',
      city: 'São Paulo'
    });

    expect(payload).toContain('000201');
    expect(payload).toContain('br.gov.bcb.pix');
    expect(payload).toContain('contato@argumeta.com.br');
    // Deve remover acentos no nome e cidade
    expect(payload).toContain('Argumeta Analise');
    expect(payload).toContain('Sao Paulo');
    expect(payload.length).toBeGreaterThan(50);
  });

  it('deve retornar configuração padrão caso nenhuma env esteja definida', () => {
    const config = getPixConfig();
    expect(config.key).toBe('pix@argumeta.com.br');
    expect(config.payload).toMatch(/^000201/);
  });
});
