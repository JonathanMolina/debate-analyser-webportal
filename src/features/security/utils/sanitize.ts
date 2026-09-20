import DOMPurify from 'dompurify';

/**
 * Sanitiza strings e previne injeção XSS através de DOMPurify
 */
export const sanitizeText = (input: string | null | undefined): string => {
  if (!input) return '';
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span'],
    ALLOWED_ATTR: ['class']
  });
};

/**
 * Sanitiza inputs de busca contra SQL/Command injection e caracteres maliciosos
 */
export const sanitizeSearchQuery = (query: string): string => {
  if (!query) return '';
  // Remove caracteres comuns de SQL Injection / quebra de comandos
  return query
    .replace(/['";\\%_]/g, '')
    .trim()
    .slice(0, 100);
};

/**
 * Sanitiza identificadores alfanuméricos seguros (IDs de jobs, debates, debatedores)
 * Permite apenas a-z, A-Z, 0-9, hífen e underscore sem remover underscores necessários.
 */
export const sanitizeId = (id: string | null | undefined): string => {
  if (!id) return '';
  return id.replace(/[^a-zA-Z0-9_-]/g, '').trim().slice(0, 128);
};

/**
 * Valida se uma URL é segura para navegação externa ou imagens
 * Bloqueia protocolos perigosos como javascript:, data:, vbscript:
 */
export const isSafeUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url, window.location.origin);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};
