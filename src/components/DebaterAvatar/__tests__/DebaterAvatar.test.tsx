import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { DebaterAvatar } from '../DebaterAvatar';
import { resolveDebaterPhotoUrl, registerDebaterPhoto } from '../debaterPhotoResolver';
import { debaterImageCache } from '../debaterImageCache';

describe('DebaterAvatar & Image Memory Cache', () => {
  beforeEach(() => {
    debaterImageCache.clear();
  });

  describe('debaterPhotoResolver', () => {
    it('deve resolver caminhos legados do ETL para o Supabase Storage público', () => {
      const legacyPath = '/src/assets/speakers/tallis_gomes.jpg';
      const resolved = resolveDebaterPhotoUrl(legacyPath);
      expect(resolved).toContain('/storage/v1/object/public/debater-assets/photos/tallis_gomes.jpg');
    });

    it('deve manter URLs HTTP/HTTPS completas intactas', () => {
      const fullUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d';
      const resolved = resolveDebaterPhotoUrl(fullUrl);
      expect(resolved).toBe(fullUrl);
    });

    it('deve resolver debatedores conhecidos via registro em memória quando photoUrl não é informada', () => {
      const resolved = resolveDebaterPhotoUrl(undefined, 'Tallis Gomes');
      expect(resolved).toContain('tallis_gomes.jpg');
    });

    it('deve permitir registrar novos debatedores e fotos em tempo de execução', () => {
      registerDebaterPhoto('debater_teste', 'https://teste.com/foto.jpg');
      const resolved = resolveDebaterPhotoUrl(undefined, 'debater_teste');
      expect(resolved).toBe('https://teste.com/foto.jpg');
    });
  });

  describe('debaterImageCache', () => {
    it('deve registrar e sincronizar status de carregamento no cache singleton', async () => {
      const testUrl = 'https://exemplo.com/debatedor.jpg';
      expect(debaterImageCache.getStatus(testUrl)).toBe('idle');

      const loadPromise = debaterImageCache.preload(testUrl);
      const success = await loadPromise;

      expect(success).toBe(true);
      expect(debaterImageCache.isLoaded(testUrl)).toBe(true);
      expect(debaterImageCache.getStatus(testUrl)).toBe('loaded');
    });

    it('deve reaproveitar a mesma Promise e cache para chamadas subsequentes', async () => {
      const testUrl = 'https://exemplo.com/debatedor_memo.jpg';
      const p1 = debaterImageCache.preload(testUrl);
      const p2 = debaterImageCache.preload(testUrl);

      expect(p1).toBe(p2);
      await p1;
    });
  });

  describe('DebaterAvatar Component', () => {
    it('deve renderizar fallback com a inicial quando não há foto', () => {
      render(<DebaterAvatar name="Paulo Brigadeiro" photoUrl="" />);
      expect(screen.getByText('P')).toBeInTheDocument();
    });

    it('deve renderizar imagem quando photoUrl válida é informada e carregada', async () => {
      const url = 'https://exemplo.com/avatar.jpg';
      debaterImageCache.setStatus(url, 'loaded');

      render(<DebaterAvatar name="Tallis Gomes" photoUrl={url} size="sm" />);
      const img = await screen.findByRole('img');
      expect(img).toHaveAttribute('src', url);
      expect(img).toHaveAttribute('alt', 'Tallis Gomes');
    });

    it('deve atualizar para imagem quando o pré-carregamento termina', async () => {
      const url = 'https://exemplo.com/async-avatar.jpg';
      render(<DebaterAvatar name="Tallis Gomes" photoUrl={url} size="sm" />);

      // Inicialmente exibe inicial enquanto carrega
      expect(screen.getByText('T')).toBeInTheDocument();

      // Quando carregada no cache
      act(() => {
        debaterImageCache.setStatus(url, 'loaded');
      });

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });
    });

    it('deve aplicar tamanhos e formatos corretamente', () => {
      const { container } = render(
        <DebaterAvatar name="Marina Silva" size="lg" shape="2xl" />
      );

      const avatarEl = container.firstChild as HTMLElement;
      expect(avatarEl).toHaveClass('w-14');
      expect(avatarEl).toHaveClass('h-14');
      expect(avatarEl).toHaveClass('rounded-2xl');
    });
  });
});
