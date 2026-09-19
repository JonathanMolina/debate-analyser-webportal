/**
 * Utilitários para validação e extração de identificadores de vídeos do YouTube.
 */

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Extrai o ID de 11 caracteres de qualquer URL do YouTube válida ou valida um ID direto.
 */
export const extractYouTubeVideoId = (input: string): string | null => {
  if (!input) return null;
  const trimmed = input.trim();

  // Se já for diretamente um ID válido de 11 caracteres
  if (YOUTUBE_ID_REGEX.test(trimmed)) {
    return trimmed;
  }

  try {
    const urlString = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;

    const parsed = new URL(urlString);
    const hostname = parsed.hostname.toLowerCase().replace('www.', '');

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      if (parsed.pathname === '/watch') {
        const v = parsed.searchParams.get('v');
        if (v && YOUTUBE_ID_REGEX.test(v)) return v;
      }

      const match = parsed.pathname.match(/^\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/);
      if (match && YOUTUBE_ID_REGEX.test(match[1])) {
        return match[1];
      }
    } else if (hostname === 'youtu.be') {
      const match = parsed.pathname.match(/^\/([a-zA-Z0-9_-]{11})/);
      if (match && YOUTUBE_ID_REGEX.test(match[1])) {
        return match[1];
      }
    }
  } catch {
    // Fallback via regex
    const regexMatch = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([a-zA-Z0-9_-]{11})/
    );
    if (regexMatch && YOUTUBE_ID_REGEX.test(regexMatch[1])) {
      return regexMatch[1];
    }
  }

  return null;
};

/**
 * Retorna a URL da imagem de capa (thumbnail) de alta qualidade do YouTube.
 */
export const getYouTubeThumbnailUrl = (videoId: string): string => {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

/**
 * Valida se uma string é uma URL ou ID válido do YouTube.
 */
export const isValidYouTubeUrl = (url: string): boolean => {
  return extractYouTubeVideoId(url) !== null;
};
