export interface PaymentConfig {
  paymentUrl: string;
  displayUrl: string;
  hasCustomConfig: boolean;
}

const DEFAULT_PAYMENT_URL = 'https://link.mercadopago.com.br/argumeta';

/**
 * Normaliza e valida a URL de pagamento informada, garantindo protocolo seguro (https:// ou http://).
 * Se o usuário informar algo como "link.mercadopago.com.br/argumeta", adiciona "https://" automaticamente.
 * Previne vetores de ataque como 'javascript:' (Regra de Segurança de URLs).
 */
export const normalizePaymentUrl = (rawUrl: string): string => {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return DEFAULT_PAYMENT_URL;
  }

  // Previne injeção de javascript:, data:, vbscript:, etc.
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return DEFAULT_PAYMENT_URL;
  }

  // Se já tiver protocolo http:// ou https://
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Adiciona https:// caso venha sem protocolo explícito
  return `https://${trimmed}`;
};

/**
 * Retorna uma versão amigável para exibição visual do link (sem prefixo https:// ou http://)
 */
export const getDisplayUrl = (url: string): string => {
  return url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
};

/**
 * Obtém a configuração do link de pagamento (Mercado Pago / Pix / Cartão)
 * priorizando variáveis de ambiente (VITE_PAYMENT_URL ou VITE_MERCADO_PAGO_URL).
 */
export const getPaymentConfig = (): PaymentConfig => {
  const envUrl =
    import.meta.env.VITE_PAYMENT_URL?.trim() ||
    import.meta.env.VITE_MERCADO_PAGO_URL?.trim() ||
    '';

  if (envUrl) {
    const validUrl = normalizePaymentUrl(envUrl);
    return {
      paymentUrl: validUrl,
      displayUrl: getDisplayUrl(validUrl),
      hasCustomConfig: true
    };
  }

  return {
    paymentUrl: DEFAULT_PAYMENT_URL,
    displayUrl: getDisplayUrl(DEFAULT_PAYMENT_URL),
    hasCustomConfig: false
  };
};
