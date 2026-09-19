import { FC } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, ExternalLink, Play } from 'lucide-react';
import { Badge } from '@/components/Badge/Badge';
import type { FactCheckItem, FactCheckVerdict } from '../types/debate.types';

export interface FactCheckListProps {
  factChecks?: FactCheckItem[];
  onSeek: (seconds: number) => void;
}

export const FactCheckList: FC<FactCheckListProps> = ({
  factChecks = [],
  onSeek
}) => {
  const getVerdictBadge = (verdict: FactCheckVerdict) => {
    switch (verdict) {
      case 'Verdadeiro':
        return (
          <Badge variant="true" className="gap-1">
            <CheckCircle2 size={12} /> Verdadeiro
          </Badge>
        );
      case 'Falso':
        return (
          <Badge variant="false" className="gap-1">
            <XCircle size={12} /> Falso
          </Badge>
        );
      case 'Impreciso':
      case 'Disputado':
        return (
          <Badge variant="disputed" className="gap-1">
            <AlertTriangle size={12} /> {verdict}
          </Badge>
        );
      default:
        return <Badge variant="neutral">{verdict}</Badge>;
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  if (factChecks.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-text-muted bg-surface rounded-2xl border border-border">
        Nenhuma checagem factual específica cadastrada para este debate.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {factChecks.map((item) => (
        <div
          key={item.id}
          className="p-5 bg-surface border border-border rounded-2xl space-y-3 hover:border-border/90 transition-all"
        >
          {/* Header Row: Speaker, Verdict & Timestamp */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-main">
                {item.speaker}
              </span>
              <span className="text-text-muted">•</span>
              {getVerdictBadge(item.verdict)}
            </div>

            <button
              type="button"
              onClick={() => onSeek(item.timestamp)}
              className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-canvas text-primary border border-border hover:border-primary/40 transition-colors cursor-pointer"
            >
              <Play size={10} className="fill-primary" />
              <span>Timestamp: {formatTime(item.timestamp)}</span>
            </button>
          </div>

          {/* Claim Box */}
          <div className="space-y-1">
            <span className="text-[10px] text-text-muted uppercase font-mono tracking-wider">
              Alegação Feita no Debate:
            </span>
            <p className="text-sm font-semibold text-text-main italic bg-canvas/60 p-3 rounded-xl border border-border/40">
              "{item.claim}"
            </p>
          </div>

          {/* Evidence Analysis */}
          <div className="space-y-1 text-xs">
            <span className="text-[10px] text-text-muted uppercase font-mono tracking-wider">
              Evidência & Contexto Analisado:
            </span>
            <p className="text-xs text-text-muted leading-relaxed">
              {item.evidence}
            </p>
          </div>

          {/* Sources */}
          {item.sources && item.sources.length > 0 && (
            <div className="pt-2 border-t border-border/40 flex flex-wrap items-center gap-2 text-[11px] font-mono text-text-muted">
              <span>Fontes consultadas:</span>
              {item.sources.map((src, i) => (
                <span
                  key={`${src}-${i}`}
                  className="px-2 py-0.5 rounded bg-surface-elevated text-text-main border border-border"
                >
                  {src}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
