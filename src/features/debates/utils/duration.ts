/**
 * Utilitários para formatação e cálculo de duração de vídeos/debates.
 * Alinhado ao padrão de exibição do YouTube e experiência do usuário no portal web.
 */

/**
 * Formata a duração em segundos para o badge visual sobre a thumbnail do vídeo (estilo YouTube).
 * Exemplos:
 * - Menos de 1h: "20:40", "05:12"
 * - 1h ou mais: "2:16:07", "1:05:30"
 * - Sem duração informada ou inválida: ""
 */
export const formatVideoBadgeDuration = (seconds?: number): string => {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds <= 0) {
    return '';
  }

  const totalSecs = Math.floor(seconds);
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const paddedSecs = secs.toString().padStart(2, '0');

  if (hours > 0) {
    const paddedMins = mins.toString().padStart(2, '0');
    return `${hours}:${paddedMins}:${paddedSecs}`;
  }

  return `${mins}:${paddedSecs}`;
};

/**
 * Formata a duração do vídeo em texto amigável em português do Brasil.
 * Não utiliza "min de áudio" para não confundir o usuário com soma de tempos sem silêncio.
 * Utiliza o tamanho/duração real do vídeo do YouTube.
 * Exemplos:
 * - 8167s -> "2h 16min"
 * - 3600s -> "1h"
 * - 1240s -> "20 min"
 * - Menos de 60s -> "< 1 min"
 * - Sem duração informada: ""
 */
export const formatVideoHumanDuration = (seconds?: number): string => {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds <= 0) {
    return '';
  }

  const totalSecs = Math.floor(seconds);
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);

  if (hours > 0) {
    if (mins > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${hours}h`;
  }

  if (mins > 0) {
    return `${mins} min`;
  }

  return '< 1 min';
};
