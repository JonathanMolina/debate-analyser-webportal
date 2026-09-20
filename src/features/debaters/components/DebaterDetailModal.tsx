import { FC } from 'react';
import { Link } from 'react-router';
import {
  User,
  Trophy,
  Activity,
  AlertTriangle,
  Brain,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Flame,
  Award
} from 'lucide-react';
import { Modal } from '@/components/Modal/Modal';
import { Badge } from '@/components/Badge/Badge';
import { DebaterAvatar } from '@/components/DebaterAvatar';
import type { DebaterAggregateStats } from '../types/debater.types';

export interface DebaterDetailModalProps {
  debater: DebaterAggregateStats | null;
  onClose: () => void;
}

export const DebaterDetailModal: FC<DebaterDetailModalProps> = ({
  debater,
  onClose
}) => {
  if (!debater) return null;

  return (
    <Modal
      isOpen={Boolean(debater)}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <DebaterAvatar
            name={debater.debaterName}
            photoUrl={debater.photoUrl}
            debaterId={debater.debaterId}
            size="md"
            className="w-10 h-10"
          />
          <div>
            <span className="font-bold text-base text-text-main">
              {debater.debaterName}
            </span>
            {debater.role && (
              <span className="block text-xs text-text-muted font-normal">
                {debater.role}
              </span>
            )}
          </div>
        </div>
      }
      subtitle="Dossiê Técnico & Histórico de Debates Analisados"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Top Highlight Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="bg-canvas border border-border p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-text-muted uppercase tracking-wider block">
              Média Técnica
            </span>
            <span className="text-xl font-black text-primary block">
              {debater.avgScore} pts
            </span>
            <span className="text-[10px] text-text-muted">Pontuação Geral</span>
          </div>

          <div className="bg-canvas border border-border p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-text-muted uppercase tracking-wider block">
              Aproveitamento
            </span>
            <span className="text-xl font-black text-text-main block">
              {debater.winRate}%
            </span>
            <span className="text-[10px] text-text-muted">
              {debater.wins}V - {debater.draws}E - {debater.losses}D
            </span>
          </div>

          <div className="bg-canvas border border-border p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-text-muted uppercase tracking-wider block">
              Precisão Factual
            </span>
            <span className="text-xl font-black text-emerald-400 block">
              {debater.factCheckAccuracy}%
            </span>
            <span className="text-[10px] text-text-muted">
              {debater.totalFactChecks} alegações checadas
            </span>
          </div>

          <div className="bg-canvas border border-border p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] text-text-muted uppercase tracking-wider block">
              Falácias / Debate
            </span>
            <span className="text-xl font-black text-rose-400 block">
              {debater.avgFallaciesPerDebate}
            </span>
            <span className="text-[10px] text-text-muted">
              Total de {debater.totalFallacies} identificadas
            </span>
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Activity size={14} className="text-primary" />
            <span>Médias de Oratória, Substância e Controle Emocional</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-canvas/80 border border-border/80 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-text-muted font-mono">
                <span>Densidade de Dados:</span>
                <strong className="text-primary font-bold">{debater.avgDataDensity}/100</strong>
              </div>
              <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${debater.avgDataDensity}%` }}
                />
              </div>
            </div>

            <div className="bg-canvas/80 border border-border/80 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-text-muted font-mono">
                <span>Controle Emocional:</span>
                <strong className="text-primary font-bold">{debater.avgEmotionalControl}/100</strong>
              </div>
              <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${debater.avgEmotionalControl}%` }}
                />
              </div>
            </div>

            <div className="bg-canvas/80 border border-border/80 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-text-muted font-mono">
                <span>Resposta Direta:</span>
                <strong className="text-primary font-bold">{debater.avgDirectAnswerRate}%</strong>
              </div>
              <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${debater.avgDirectAnswerRate}%` }}
                />
              </div>
            </div>

            <div className="bg-canvas/80 border border-border/80 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-text-muted font-mono">
                <span>Riqueza Vocabular:</span>
                <strong className="text-primary font-bold">{debater.avgVocabularyRichness}/100</strong>
              </div>
              <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${debater.avgVocabularyRichness}%` }}
                />
              </div>
            </div>

            <div className="bg-canvas/80 border border-border/80 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-text-muted font-mono">
                <span>Taxa de Refutação:</span>
                <strong className="text-primary font-bold">{debater.avgRebuttalScore}/100</strong>
              </div>
              <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${debater.avgRebuttalScore}%` }}
                />
              </div>
            </div>

            <div className="bg-canvas/80 border border-border/80 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-text-muted font-mono">
                <span>Ritmo de Fala (WPM):</span>
                <strong className="text-primary font-bold">{debater.avgWordsPerMinute} ppm</strong>
              </div>
              <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${Math.min(100, (debater.avgWordsPerMinute / 180) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Debates Processados Recentes */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Award size={14} className="text-primary" />
            <span>Últimos Debates Processados ({debater.recentDebates.length})</span>
          </h4>

          <div className="space-y-2">
            {debater.recentDebates.length > 0 ? (
              debater.recentDebates.map((item) => (
                <div
                  key={item.jobId}
                  className="p-3.5 bg-canvas border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          item.result === 'win'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.result === 'loss'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}
                      >
                        {item.result === 'win'
                          ? 'VITÓRIA'
                          : item.result === 'loss'
                          ? 'DERROTA'
                          : 'EMPATE'}
                      </span>
                      <span className="text-xs font-bold text-text-main">
                        {item.debateTitle || `Debate vs ${item.opponentNames.join(', ')}`}
                      </span>
                    </div>

                    <div className="text-[11px] text-text-muted font-mono flex items-center gap-3">
                      <span>Vs: {item.opponentNames.join(', ')}</span>
                      <span>•</span>
                      <span>Score: {item.score} pts</span>
                      <span>•</span>
                      <span>{item.fallaciesCount} falácias</span>
                    </div>
                  </div>

                  <Link
                    to={`/debates/${item.jobId}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover transition-colors shrink-0"
                  >
                    <span>Ver análise</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-xs text-text-muted p-4 text-center bg-canvas rounded-xl">
                Nenhum debate processado registrado para este debatedor no momento.
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
