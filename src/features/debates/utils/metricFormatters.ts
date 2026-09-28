/**
 * Utilitários para formatação legível e humanizada de métricas,
 * eliminando siglas crípticas (como 1V - 0E - 0D).
 */

export const formatMatchRecordFull = (
  wins: number,
  draws: number,
  losses: number
): string => {
  const wText = `${wins} ${wins === 1 ? 'vitória' : 'vitórias'}`;
  const dText = `${draws} ${draws === 1 ? 'empate' : 'empates'}`;
  const lText = `${losses} ${losses === 1 ? 'derrota' : 'derrotas'}`;
  return `${wText} • ${dText} • ${lText}`;
};

export const formatMatchRecordCompact = (
  wins: number,
  draws: number,
  losses: number
): string => {
  return `${wins} vit. • ${draws} emp. • ${losses} der.`;
};

export const formatPointsLabel = (points: number | string): string => {
  return `${points} pontos`;
};
