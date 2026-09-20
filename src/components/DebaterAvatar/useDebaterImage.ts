import { useState, useEffect, useMemo } from 'react';
import { resolveDebaterPhotoUrl } from './debaterPhotoResolver';
import { debaterImageCache, type ImageLoadStatus } from './debaterImageCache';

export interface UseDebaterImageResult {
  resolvedUrl?: string;
  status: ImageLoadStatus;
  isLoaded: boolean;
  hasError: boolean;
}

export const useDebaterImage = (
  photoUrl?: string,
  debaterName?: string,
  debaterId?: string
): UseDebaterImageResult => {
  const resolvedUrl = useMemo(
    () => resolveDebaterPhotoUrl(photoUrl, debaterName, debaterId),
    [photoUrl, debaterName, debaterId]
  );

  const [status, setStatus] = useState<ImageLoadStatus>(() =>
    resolvedUrl ? debaterImageCache.getStatus(resolvedUrl) : 'idle'
  );

  useEffect(() => {
    if (!resolvedUrl) {
      setStatus('idle');
      return;
    }

    // Subscreve às notificações do cache em memória
    const unsubscribe = debaterImageCache.subscribe(resolvedUrl, (newStatus) => {
      setStatus(newStatus);
    });

    // Dispara o pré-carregamento singleton se ainda não foi carregado
    debaterImageCache.preload(resolvedUrl);

    return unsubscribe;
  }, [resolvedUrl]);

  return {
    resolvedUrl,
    status,
    isLoaded: status === 'loaded',
    hasError: status === 'error' || (!resolvedUrl && Boolean(photoUrl))
  };
};
