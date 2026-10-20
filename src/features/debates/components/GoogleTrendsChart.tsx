import { FC, useState, useMemo, useRef, MouseEvent } from 'react';
import { TrendingUp, Trophy, Award, Search } from 'lucide-react';
import type { GoogleTrendsMetrics, SpeakerInput } from '../types/debate.types';

export interface GoogleTrendsChartProps {
  trends?: GoogleTrendsMetrics;
  speakers?: SpeakerInput[];
}

const SPEAKER_COLORS = [
  { stroke: '#38bdf8', fill: 'rgba(56, 189, 248, 0.15)', text: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' },
  { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.15)', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.15)', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { stroke: '#a855f7', fill: 'rgba(168, 85, 247, 0.15)', text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { stroke: '#ec4899', fill: 'rgba(236, 72, 153, 0.15)', text: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' }
];

export const GoogleTrendsChart: FC<GoogleTrendsChartProps> = ({ trends, speakers = [] }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Mapeamento de termos associados a cada debatedor (nome principal + apelidos)
  const debaterTermsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    if (trends?.speakerTerms) {
      return trends.speakerTerms;
    }
    speakers.forEach((s) => {
      if (s.name) {
        const nicks = s.nicknames || [];
        map[s.name] = [s.name, ...nicks];
      }
    });
    return map;
  }, [trends?.speakerTerms, speakers]);

  // Consolidação por debatedor: soma buscas do nome principal e apelidos em um único valor por debatedor
  const { consolidatedTimeline, consolidatedShares, consolidatedAverages, speakerNames } = useMemo(() => {
    if (!trends) {
      return {
        consolidatedTimeline: [],
        consolidatedShares: {},
        consolidatedAverages: {},
        speakerNames: speakers.map((s) => s.name)
      };
    }

    const rawTimeline = trends.timeline || [];
    const rawShares = trends.shares || {};
    const rawAverages = trends.averages || {};

    const debaterList = speakers.length > 0
      ? speakers.map((s) => s.name)
      : Object.keys(rawShares);

    const needsConsolidation = Object.keys(debaterTermsMap).some((debaterName) => {
      const terms = debaterTermsMap[debaterName] || [];
      return terms.some(
        (t) =>
          t.toLowerCase() !== debaterName.toLowerCase() &&
          (t in rawShares || (rawTimeline[0]?.values && t in rawTimeline[0].values))
      );
    });

    if (!needsConsolidation) {
      const names = debaterList.length > 0 ? debaterList : Object.keys(rawShares);
      return {
        consolidatedTimeline: rawTimeline,
        consolidatedShares: rawShares,
        consolidatedAverages: rawAverages,
        speakerNames: names
      };
    }

    const termToDebater: Record<string, string> = {};
    Object.entries(debaterTermsMap).forEach(([debaterName, terms]) => {
      terms.forEach((t) => {
        termToDebater[t.toLowerCase()] = debaterName;
      });
    });

    const consolidatedTimeline = rawTimeline.map((pt) => {
      const values: Record<string, number> = {};
      debaterList.forEach((name) => {
        values[name] = 0;
      });

      Object.entries(pt.values).forEach(([term, val]) => {
        const debater = termToDebater[term.toLowerCase()] || term;
        values[debater] = (values[debater] || 0) + val;
      });

      return {
        ...pt,
        values
      };
    });

    const consolidatedShares: Record<string, number> = {};
    debaterList.forEach((name) => {
      consolidatedShares[name] = 0;
    });
    Object.entries(rawShares).forEach(([term, share]) => {
      const debater = termToDebater[term.toLowerCase()] || term;
      consolidatedShares[debater] = (consolidatedShares[debater] || 0) + share;
    });

    const consolidatedAverages: Record<string, number> = {};
    debaterList.forEach((name) => {
      consolidatedAverages[name] = 0;
    });
    Object.entries(rawAverages).forEach(([term, avg]) => {
      const debater = termToDebater[term.toLowerCase()] || term;
      consolidatedAverages[debater] = (consolidatedAverages[debater] || 0) + avg;
    });

    return {
      consolidatedTimeline,
      consolidatedShares,
      consolidatedAverages,
      speakerNames: debaterList
    };
  }, [trends, speakers, debaterTermsMap]);

  // Dimensões SVG
  const width = 800;
  const height = 260;
  const padding = { top: 20, right: 30, bottom: 40, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Valor máximo capturado para a escala do eixo Y (garante que picos e valores consolidados não fiquem limitados a 100)
  const maxY = useMemo(() => {
    let max = 0;
    consolidatedTimeline.forEach((pt) => {
      speakerNames.forEach((spk) => {
        const val = pt.values[spk] ?? 0;
        if (val > max) {
          max = val;
        }
      });
    });
    return max > 0 ? max : 100;
  }, [consolidatedTimeline, speakerNames]);

  // Marcadores do eixo Y dinâmicos baseados no valor máximo capturado
  const yTicks = useMemo(() => {
    return [0, 0.25, 0.5, 0.75, 1].map((pct) => Math.round(maxY * pct));
  }, [maxY]);

  // Coordenadas das séries temporais
  const seriesData = useMemo(() => {
    if (consolidatedTimeline.length < 2) return [];

    return speakerNames.map((spk, spkIdx) => {
      const color = SPEAKER_COLORS[spkIdx % SPEAKER_COLORS.length];
      const points = consolidatedTimeline.map((pt, i) => {
        const x = padding.left + (i / (consolidatedTimeline.length - 1)) * chartW;
        const val = pt.values[spk] ?? 0;
        const y = padding.top + chartH - (Math.min(maxY, Math.max(0, val)) / maxY) * chartH;
        return { x, y, val, time: pt.formattedTime || pt.timestamp };
      });

      const pathD = points.reduce((acc, p, idx) => {
        return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
      }, '');

      const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

      return {
        name: spk,
        color,
        points,
        pathD,
        areaD
      };
    });
  }, [consolidatedTimeline, speakerNames, chartW, chartH, padding, maxY]);

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || consolidatedTimeline.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgX = (mouseX / rect.width) * width;
    const relativeX = svgX - padding.left;
    const ratio = Math.max(0, Math.min(1, relativeX / chartW));
    const index = Math.round(ratio * (consolidatedTimeline.length - 1));
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  if (!trends || consolidatedTimeline.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 text-center space-y-3">
        <div className="w-10 h-10 mx-auto rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center">
          <Search size={20} />
        </div>
        <h3 className="text-sm font-bold text-text-main">Repercussão Web: Buscas no Google</h3>
        <p className="text-xs text-text-muted max-w-md mx-auto">
          Dado não avaliado para esse debate.
        </p>
      </div>
    );
  }

  const hoveredPoint = hoverIndex !== null ? consolidatedTimeline[hoverIndex] : null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-text-main">
                Repercussão Web: Buscas no Google (24h)
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/15 border border-sky-500/30 text-sky-400">
                Google Trends
              </span>
            </div>
            <p className="text-[11px] text-text-muted">
              Volume relativo consolidado de interesse de pesquisa no Brasil durante o debate e nas 24h seguintes (pontos equivalentes à porcentagem obtida).
            </p>
          </div>
        </div>

        {/* Winner Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {trends.isDraw ? (
            <div className="px-3 py-1 rounded-full text-xs font-semibold bg-canvas border border-border text-text-main flex items-center gap-1.5 shadow-xs">
              <Award size={14} className="text-status-disputed" />
              <span>Empate em Repercussão</span>
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center gap-1.5 shadow-xs">
              <Trophy size={14} />
              <span>Maior Repercussão: {trends.winner}</span>
            </div>
          )}
        </div>
      </div>

      {/* Debater Share Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {speakerNames.map((spk, idx) => {
          const color = SPEAKER_COLORS[idx % SPEAKER_COLORS.length];
          const share = consolidatedShares[spk] ?? 0;
          const avg = consolidatedAverages[spk] ?? 0;
          const isWinner = trends.winner === spk && !trends.isDraw;
          const pointsEarned = Math.round(share);
          const terms = debaterTermsMap[spk] || [];
          const activeNicknames = terms.filter((t) => t.toLowerCase() !== spk.toLowerCase());

          return (
            <div
              key={spk}
              className={`p-3 rounded-xl border transition-all ${color.bg} ${color.border} ${
                isWinner ? 'ring-1 ring-sky-400/40 shadow-xs' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0 pr-1">
                  <span className="text-[11px] font-bold text-text-main truncate block" title={spk}>
                    {spk}
                  </span>
                  {activeNicknames.length > 0 && (
                    <span
                      className="text-[9px] text-text-muted font-mono truncate block"
                      title={`Buscas somadas: ${spk}, ${activeNicknames.join(', ')}`}
                    >
                      +{activeNicknames.join(', ')}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 shrink-0">
                  +{pointsEarned} PTS
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-1.5">
                <span className={`text-xl font-black font-mono ${color.text}`}>
                  {share}%
                </span>
                <span className="text-[10px] text-text-muted font-mono">
                  Média: {avg}
                </span>
              </div>
              <div className="w-full bg-canvas/60 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, share)}%`, backgroundColor: color.stroke }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* SVG Interactive Timeline Chart */}
      <div className="relative bg-canvas/60 border border-border/80 rounded-xl p-3 overflow-hidden">
        {/* Subtle Debate Window Label */}
        <div className="flex items-center justify-between text-[10px] text-text-muted font-mono px-2 pb-1 border-b border-border/40">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Transmissão do Debate (Início)
          </span>
          <span className="flex items-center gap-1">
            Período Pós-Debate (+24 Horas) &rarr;
          </span>
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 cursor-crosshair select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {seriesData.map((s) => (
              <linearGradient key={`grad-${s.name}`} id={`grad-${s.name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color.stroke} stopOpacity="0.35" />
                <stop offset="100%" stopColor={s.color.stroke} stopOpacity="0.0" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid lines */}
          {yTicks.map((val, idx) => {
            const y = padding.top + chartH - (val / maxY) * chartH;
            return (
              <g key={`y-grid-${idx}-${val}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="rgba(156, 163, 175, 0.7)"
                  className="font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area Fills */}
          {seriesData.map((s) => (
            <path
              key={`area-${s.name}`}
              d={s.areaD}
              fill={`url(#grad-${s.name})`}
            />
          ))}

          {/* Line Strokes */}
          {seriesData.map((s) => (
            <path
              key={`line-${s.name}`}
              d={s.pathD}
              fill="none"
              stroke={s.color.stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Hover indicator vertical bar & dots */}
          {hoveredPoint && hoverIndex !== null && (
            <g>
              <line
                x1={padding.left + (hoverIndex / (consolidatedTimeline.length - 1)) * chartW}
                y1={padding.top}
                x2={padding.left + (hoverIndex / (consolidatedTimeline.length - 1)) * chartW}
                y2={padding.top + chartH}
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              {seriesData.map((s) => {
                const pt = s.points[hoverIndex];
                if (!pt) return null;
                return (
                  <circle
                    key={`dot-${s.name}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill={s.color.stroke}
                    stroke="#18181b"
                    strokeWidth="2"
                  />
                );
              })}
            </g>
          )}

          {/* X Axis time markers */}
          {Array.from(new Set([0, Math.floor(consolidatedTimeline.length / 4), Math.floor(consolidatedTimeline.length / 2), Math.floor((consolidatedTimeline.length * 3) / 4), consolidatedTimeline.length - 1])).map((idx) => {
            const pt = consolidatedTimeline[idx];
            if (!pt) return null;
            const x = padding.left + (idx / (consolidatedTimeline.length - 1)) * chartW;
            return (
              <text
                key={`time-marker-${idx}-${pt.timestamp || pt.formattedTime || idx}`}
                x={x}
                y={height - 12}
                textAnchor="middle"
                fontSize="10"
                fill="rgba(156, 163, 175, 0.75)"
                className="font-mono"
              >
                {pt.formattedTime || `Ponto ${idx}`}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && hoverIndex !== null && (
          <div className="absolute top-8 right-6 bg-surface-elevated/95 border border-border p-2.5 rounded-xl shadow-lg backdrop-blur-sm text-xs font-mono space-y-1.5 pointer-events-none">
            <div className="text-[10px] text-text-muted pb-1 border-b border-border/60">
              Momento: <span className="text-text-main font-bold">{hoveredPoint.formattedTime || hoveredPoint.timestamp}</span>
            </div>
            {speakerNames.map((spk, idx) => {
              const color = SPEAKER_COLORS[idx % SPEAKER_COLORS.length];
              const val = hoveredPoint.values[spk] ?? 0;
              return (
                <div key={spk} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color.stroke }} />
                    <span className="text-text-muted truncate max-w-[120px]">{spk}</span>
                  </div>
                  <span className={`font-bold ${color.text}`}>{val}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
