import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getPaymentConfig, normalizePaymentUrl, getDisplayUrl } from '../payment';

describe('Payment Utility', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_PAYMENT_URL', '');
    vi.stubEnv('VITE_MERCADO_PAGO_URL', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('deve retornar URL padrão do Mercado Pago quando nenhuma env estiver configurada', () => {
    const config = getPaymentConfig();
    expect(config.paymentUrl).toBe('https://link.mercadopago.com.br/argumeta');
    expect(config.displayUrl).toBe('link.mercadopago.com.br/argumeta');
    expect(config.hasCustomConfig).toBe(false);
  });

  it('deve normalizar URL sem protocolo adicionando https://', () => {
    const normalized = normalizePaymentUrl('link.mercadopago.com.br/argumeta');
    expect(normalized).toBe('https://link.mercadopago.com.br/argumeta');
  });

  it('deve preservar URL com protocolo https:// ou http://', () => {
    expect(normalizePaymentUrl('https://mpago.la/abc1234')).toBe('https://mpago.la/abc1234');
    expect(normalizePaymentUrl('http://link.mercadopago.com.br/teste')).toBe('http://link.mercadopago.com.br/teste');
  });

  it('deve rejeitar protocolos perigosos como javascript: e retornar fallback seguro', () => {
    expect(normalizePaymentUrl('javascript:alert("xss")')).toBe('https://link.mercadopago.com.br/argumeta');
    expect(normalizePaymentUrl('data:text/html,<script>alert(1)</script>')).toBe('https://link.mercadopago.com.br/argumeta');
  });

  it('deve ler corretamente a variável VITE_PAYMENT_URL', () => {
    vi.stubEnv('VITE_PAYMENT_URL', 'link.mercadopago.com.br/minhaloja');
    const config = getPaymentConfig();
    expect(config.paymentUrl).toBe('https://link.mercadopago.com.br/minhaloja');
    expect(config.displayUrl).toBe('link.mercadopago.com.br/minhaloja');
    expect(config.hasCustomConfig).toBe(true);
  });

  it('deve ler VITE_MERCADO_PAGO_URL como fallback caso VITE_PAYMENT_URL não exista', () => {
    vi.stubEnv('VITE_MERCADO_PAGO_URL', 'https://mpago.la/xyz');
    const config = getPaymentConfig();
    expect(config.paymentUrl).toBe('https://mpago.la/xyz');
    expect(config.displayUrl).toBe('mpago.la/xyz');
    expect(config.hasCustomConfig).toBe(true);
  });

  it('deve formatar corretamente o displayUrl removendo protocolos e barras finais', () => {
    expect(getDisplayUrl('https://link.mercadopago.com.br/argumeta/')).toBe('link.mercadopago.com.br/argumeta');
    expect(getDisplayUrl('http://test.com/')).toBe('test.com');
  });
});
