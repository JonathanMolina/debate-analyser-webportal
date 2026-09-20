import type { ViewedDebateMetadata, NewsletterSubscriptionMetadata } from '../types/newsletter.types';

export const DEBATE_VIEWS_STORAGE_KEY = 'argumeta_viewed_debates';
export const MAX_STORED_DEBATES = 30;

/**
 * Registra um debate assistido pelo usuário no histórico local (localStorage).
 * Evita duplicações e mantém ordenado pelo mais recente.
 */
export const recordDebateView = (debate: {
  id: string;
  title: string;
  url?: string;
}): void => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    const existing = getViewedDebates();
    // Remove ocorrência anterior do mesmo debate
    const filtered = existing.filter((item) => item.id !== debate.id);

    const newItem: ViewedDebateMetadata = {
      id: debate.id,
      title: debate.title,
      viewedAt: new Date().toISOString(),
      url: debate.url || (typeof window !== 'undefined' ? window.location.href : undefined)
    };

    const updated = [newItem, ...filtered].slice(0, MAX_STORED_DEBATES);
    window.localStorage.setItem(DEBATE_VIEWS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Falhas de localStorage (ex: quota excedida ou modo anônimo restrito) não devem quebrar a aplicação
  }
};

/**
 * Retorna a lista de debates assistidos registrados no localStorage.
 */
export const getViewedDebates = (): ViewedDebateMetadata[] => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(DEBATE_VIEWS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is ViewedDebateMetadata =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.id === 'string' &&
          typeof item.title === 'string'
      );
    }
    return [];
  } catch {
    return [];
  }
};

/**
 * Limpa o histórico de debates assistidos (útil para testes e privacidade).
 */
export const clearViewedDebates = (): void => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.removeItem(DEBATE_VIEWS_STORAGE_KEY);
  } catch {
    // Silencia erros de storage
  }
};

/**
 * Constrói o payload completo de metadados para envio na assinatura da newsletter.
 */
export const buildNewsletterMetadata = (currentDebate?: {
  id: string;
  title: string;
}): NewsletterSubscriptionMetadata => {
  return {
    viewedDebates: getViewedDebates(),
    currentDebate,
    sourcePage: typeof window !== 'undefined' ? window.location.pathname : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    subscribedAt: new Date().toISOString()
  };
};
