import { FC, useState, useMemo } from 'react';
import {
  Users,
  ThumbsUp,
  Award,
  AlertCircle,
  CheckCircle2,
  Filter,
  MessageCircle,
  Share2,
  HelpCircle
} from 'lucide-react';
import type { AudienceMetrics, SpeakerInput } from '../types/debate.types';

export interface AudienceSentimentPanelProps {
  audienceMetrics?: AudienceMetrics;
  speakers?: SpeakerInput[];
  technicalWinner?: string;
}

export const AudienceSentimentPanel: FC<AudienceSentimentPanelProps> = ({
  audienceMetrics,
  speakers = [],
  technicalWinner
}) => {
  const [selectedSpeakerFilter, setSelectedSpeakerFilter] = useState<string>('all');

  const topComments = useMemo(() => {
    return audienceMetrics?.topComments || [];
  }, [audienceMetrics?.topComments]);

  const filteredComments = useMemo(() => {
    if (selectedSpeakerFilter === 'all') {
      return topComments;
    }
    return topComments.filter((c) => c.favoredSpeaker === selectedSpeakerFilter);
  }, [topComments, selectedSpeakerFilter]);

  if (!audienceMetrics) {
    return (
      <div className="p-12 text-center bg-surface border border-border rounded-2xl space-y-3">
        <Users className="mx-auto text-text-muted opacity-50" size={36} />
        <h4 className="text-sm font-bold text-text-main">
          Métricas de Audiência em Consolidação
        </h4>
        <p className="text-xs text-text-muted max-w-md mx-auto">
          A extração e auditoria de sentimento dos comentários do YouTube ainda não foi finalizada para este debate.
        </p>
      </div>
    );
  }

  const {
    totalCommentsAnalyzed,
    favoredWinner,
    winnerAgreementWithAlgorithm,
    publicVerdictSummary,
    speakersFeedback
  } = audienceMetrics;

  const speakerFeedbackList = Object.values(speakersFeedback || {});
  const totalDebaters = Math.max(1, speakers.length || speakerFeedbackList.length || 2);
  const maxAudiencePoints = totalDebaters * 50;

  const formatLikes = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="space-y-6">
      {/* Community Winner & Consensus Banner */}
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Award size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                  Veredito Popular da Comunidade
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-surface-elevated border border-border text-text-muted">
                  <MessageCircle size={10} />
                  {totalCommentsAnalyzed.toLocaleString('pt-BR')} comentários auditados
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-text-main mt-0.5">
                Vencedor Popular: <span className="text-amber-400">{favoredWinner}</span>
              </h3>

              <div className="flex items-center gap-2 mt-1">
                {winnerAgreementWithAlgorithm ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 size={14} />
                    <span>Concordância com o Algoritmo Técnico ({technicalWinner})</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                    <AlertCircle size={14} />
                    <span>Divergência com Análise Técnica (Algoritmo apontou: {technicalWinner || 'Empate'})</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Weight Callout Badge */}
          <div
            className="p-3 px-4 rounded-xl bg-surface-elevated border border-border flex items-center gap-3 relative group"
            title={`Distribuição de até 50 pontos por quantidade de debatedores: até ${maxAudiencePoints} pontos totais distribuídos (${totalDebaters} debatedores).`}
          >
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-text-muted flex items-center justify-end gap-1">
                <span>Impacto no Score Final</span>
                <HelpCircle size={11} className="text-amber-400" />
              </span>
              <span className="text-xs font-bold text-primary font-mono block">
                Até +{maxAudiencePoints} pts no Scorecard
              </span>
              <span className="text-[9px] text-text-muted font-mono block">
                (50 pts máx por debatedor)
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <ThumbsUp size={16} />
            </div>

            {/* Hover Tooltip */}
            <div className="absolute top-full right-0 mt-2 hidden group-hover:block w-72 p-3 bg-surface-elevated text-xs font-sans text-text-main rounded-xl shadow-xl border border-border z-50 pointer-events-none leading-snug">
              <div className="font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                <ThumbsUp size={12} />
                <span>Opinião do Público (Comentários YouTube)</span>
              </div>
              <p className="text-[11px] text-text-muted">
                Avaliação semântica via IA baseada nos comentários mais curtidos do vídeo, desmascarando ironias. A pontuação é distribuída proporcionalmente em até 50 pontos por debatedor (ex: até 100 pts distribuídos em 2 debatedores, até 250 pts em 5 debatedores).
              </p>
            </div>
          </div>
        </div>

        {/* Public Summary */}
        {publicVerdictSummary && (
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed bg-surface-elevated/50 p-4 rounded-xl border border-border/80">
            {publicVerdictSummary}
          </p>
        )}

        {/* Community Ratio Bar */}
        {speakerFeedbackList.length >= 2 && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-text-main">
                {speakerFeedbackList[0].speakerName}: {speakerFeedbackList[0].approvalPercentage}%
              </span>
              <span className="text-text-muted text-[11px]">Distribuição de Preferência</span>
              <span className="font-bold text-text-main">
                {speakerFeedbackList[1].approvalPercentage}%: {speakerFeedbackList[1].speakerName}
              </span>
            </div>

            <div className="h-3 w-full bg-surface-elevated rounded-full overflow-hidden flex p-0.5 border border-border">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-l-full transition-all duration-500"
                style={{ width: `${speakerFeedbackList[0].approvalPercentage}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-sky-500 rounded-r-full transition-all duration-500"
                style={{ width: `${speakerFeedbackList[1].approvalPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Key Reasons per Speaker */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted font-mono flex items-center gap-2">
          <Users size={14} className="text-primary" />
          <span>Por Quais Motivos Segundo as Pessoas</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {speakerFeedbackList.map((fb) => {
            const isFavored = favoredWinner.includes(fb.speakerName);
            const speakerInfo = speakers.find((s) => s.name === fb.speakerName);

            return (
              <div
                key={fb.speakerName}
                className={`p-5 rounded-2xl border transition-all ${
                  isFavored
                    ? 'bg-surface border-amber-500/40 shadow-sm'
                    : 'bg-surface border-border'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    {speakerInfo?.previewUrl ? (
                      <img
                        src={speakerInfo.previewUrl}
                        alt={fb.speakerName}
                        className="w-8 h-8 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary font-mono">
                        {fb.speakerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h5 className="text-sm font-bold text-text-main leading-none">
                        {fb.speakerName}
                      </h5>
                      <span className="text-[10px] text-text-muted font-mono">
                        {fb.supportCount.toLocaleString('pt-BR')} menções de apoio
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                      isFavored
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                        : 'bg-surface-elevated border-border text-text-muted'
                    }`}
                  >
                    {fb.approvalPercentage}% apoio
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted block">
                    Principais argumentos dos espectadores:
                  </span>
                  <ul className="space-y-2">
                    {fb.keyReasons.map((reason) => (
                      <li
                        key={reason}
                        className="text-xs text-text-muted flex items-start gap-2 leading-relaxed bg-surface-elevated/40 p-2.5 rounded-xl border border-border/50"
                      >
                        <span className="text-primary font-black mt-0.5">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 15 Most Liked Comments */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm space-y-4 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
              <ThumbsUp size={16} className="text-amber-400" />
              <span>Top 15 Comentários Mais Curtidos do Vídeo</span>
            </h4>
            <p className="text-xs text-text-muted">
              Comentários com maior engajamento que orientam a percepção coletiva do debate.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto select-none">
            <button
              type="button"
              onClick={() => setSelectedSpeakerFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedSpeakerFilter === 'all'
                  ? 'bg-primary text-black font-semibold'
                  : 'bg-surface-elevated text-text-muted hover:text-text-main border border-border'
              }`}
            >
              Todos ({topComments.length})
            </button>
            {speakerFeedbackList.map((fb) => (
              <button
                key={fb.speakerName}
                type="button"
                onClick={() => setSelectedSpeakerFilter(fb.speakerName)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedSpeakerFilter === fb.speakerName
                    ? 'bg-primary text-black font-semibold'
                    : 'bg-surface-elevated text-text-muted hover:text-text-main border border-border'
                }`}
              >
                {fb.speakerName}
              </button>
            ))}
          </div>
        </div>

        {filteredComments.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted">
            Nenhum comentário filtrado para esta categoria.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredComments.slice(0, 15).map((comment, index) => {
              const isFirst = index === 0;
              return (
                <div
                  key={comment.id || `${comment.author}_${index}`}
                  className={`p-4 rounded-xl border transition-all ${
                    isFirst
                      ? 'bg-surface-elevated/90 border-amber-500/40 shadow-sm'
                      : 'bg-surface-elevated/40 border-border/80 hover:border-border'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center ${
                          index < 3
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-surface text-text-muted border border-border'
                        }`}
                      >
                        #{index + 1}
                      </span>
                      <span className="text-xs font-semibold text-text-main">
                        {comment.author}
                      </span>
                      {comment.publishedAt && (
                        <span className="text-[10px] text-text-muted font-mono">
                          • {comment.publishedAt}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {comment.favoredSpeaker && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                            comment.favoredSpeaker === 'Neutro'
                              ? 'bg-surface text-text-muted border-border'
                              : 'bg-primary/10 text-primary border-primary/20'
                          }`}
                        >
                          Apoia: {comment.favoredSpeaker}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-lg">
                        <ThumbsUp size={11} />
                        {formatLikes(comment.likes)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed whitespace-pre-line pl-8">
                    "{comment.text}"
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
