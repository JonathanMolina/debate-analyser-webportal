import { describe, it, expect } from 'vitest';
import { extractYouTubeVideoId, getYouTubeThumbnailUrl, isValidYouTubeUrl } from '../youtube';

describe('YouTube Utility', () => {
  describe('extractYouTubeVideoId', () => {
    it('deve extrair ID de URL padrão watch?v=', () => {
      const id = extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      expect(id).toBe('dQw4w9WgXcQ');
    });

    it('deve extrair ID de URL com parâmetros extras', () => {
      const id = extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120s&feature=share');
      expect(id).toBe('dQw4w9WgXcQ');
    });

    it('deve extrair ID de URL encurtada youtu.be', () => {
      const id = extractYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ');
      expect(id).toBe('dQw4w9WgXcQ');
    });

    it('deve extrair ID de YouTube Shorts', () => {
      const id = extractYouTubeVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ');
      expect(id).toBe('dQw4w9WgXcQ');
    });

    it('deve extrair ID de YouTube Live', () => {
      const id = extractYouTubeVideoId('https://www.youtube.com/live/dQw4w9WgXcQ');
      expect(id).toBe('dQw4w9WgXcQ');
    });

    it('deve extrair ID de embed URL', () => {
      const id = extractYouTubeVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ');
      expect(id).toBe('dQw4w9WgXcQ');
    });

    it('deve aceitar ID puro de 11 caracteres', () => {
      const id = extractYouTubeVideoId('dQw4w9WgXcQ');
      expect(id).toBe('dQw4w9WgXcQ');
    });

    it('deve retornar null para URLs inválidas ou de outros domínios', () => {
      expect(extractYouTubeVideoId('https://vimeo.com/12345678')).toBeNull();
      expect(extractYouTubeVideoId('https://example.com/watch?v=123')).toBeNull();
      expect(extractYouTubeVideoId('texto aleatorio')).toBeNull();
      expect(extractYouTubeVideoId('')).toBeNull();
    });
  });

  describe('getYouTubeThumbnailUrl', () => {
    it('deve formatar URL da thumbnail corretamente', () => {
      expect(getYouTubeThumbnailUrl('dQw4w9WgXcQ')).toBe(
        'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
      );
    });

    it('deve retornar string vazia se videoId for vazio', () => {
      expect(getYouTubeThumbnailUrl('')).toBe('');
    });
  });

  describe('isValidYouTubeUrl', () => {
    it('deve validar corretamente URLs válidas e inválidas', () => {
      expect(isValidYouTubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
      expect(isValidYouTubeUrl('https://google.com')).toBe(false);
    });
  });
});
