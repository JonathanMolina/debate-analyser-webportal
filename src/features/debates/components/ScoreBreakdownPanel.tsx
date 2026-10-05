import { FC } from 'react';
import { Trophy, Scale } from 'lucide-react';
import type { DebateScore, SpeakerInput } from '../types/debate.types';
import { InfoTooltip } from '@/components/InfoTooltip';
import { METRIC_EXPLANATIONS } from '../utils/metricExplanations';

export interface ScoreBreakdownPanelProps {
  score?: DebateScore;
  speakers?: SpeakerInput[];
}

export const ScoreBreakdownPanel: FC<ScoreBreakdownPanelProps> = ({
  score,
  speakers = []
}) => {
  if (!score || !score.breakdown) {
    return (
      <div className="p-8 text-center text-xs text-text-muted bg-surface rounded-2xl border border-border">
        Pontuação técnica em consolidação algorítmica.
      </div>
    );
  }

  const speakerNames = Object.keys(score.breakdown);
  const maxAudiencePoints = speakerNames.length * 50;

  return (
    <div className="space-y-6">
      {/* Top Banner with Winner & Difference */}
      <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
            <Trophy size={24} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">
              Resultado Algorítmico do Debate
            </span>
            <h3 className="text-lg font-extrabold text-text-main">
              {score.isDraw
                ? 'Empate Técnico'
                : `Vencedor por Métricas: ${score.winner}`}
            </h3>
            {!score.isDraw && (
              <span className="text-xs text-primary font-mono font-semibold">
                Diferença técnica: +{score.difference} pontos
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {speakerNames.map((spk) => {
            const isWinner = score.winner === spk && !score.isDraw;
            return (
              <div
                key={spk}
                className={`p-3 rounded-xl border text-center font-mono min-w-[110px] ${
                  isWinner
                    ? 'bg-primary/15 border-primary text-primary'
                    : 'bg-canvas border-border text-text-muted'
                }`}
              >
                <span className="text-[10px] uppercase block truncate max-w-[100px]">
                  {spk}
                </span>
                <span className="text-xl font-black block">
                  {score.scores[spk] ?? 100}
                </span>
                <span className="text-[9px] block">pontos</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown Table Comparison */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-surface-elevated/40">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted font-mono flex items-center gap-2">
            <Scale size={14} className="text-primary" />
            <span>Detalhamento dos Critérios de Pontuação Técnica</span>
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border/80 text-text-muted">
                <th className="p-3.5">Critério Avaliado</th>
                {speakerNames.map((spk) => (
                  <th key={spk} className="p-3.5 text-right font-bold text-text-main">
                    {spk}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="p-3.5 text-text-muted">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>Evidências & Fatos Verificados (+5 Verdadeiro, +2 Discutível, -5 Falso)</span>
                    <InfoTooltip
                      title={METRIC_EXPLANATIONS.evidencePoints.title}
                      content={METRIC_EXPLANATIONS.evidencePoints.shortHint}
                      triggerAriaLabel="Informações sobre pontuação de evidências"
                    />
                  </div>
                </td>
                {speakerNames.map((spk) => (
                  <td key={spk} className="p-3.5 text-right font-semibold text-emerald-400">
                    +{score.breakdown[spk].evidencePoints} pontos
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 text-text-muted">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>Penalidades por Falácias Retóricas</span>
                    <InfoTooltip
                      title={METRIC_EXPLANATIONS.fallacyPenalties.title}
                      content={METRIC_EXPLANATIONS.fallacyPenalties.shortHint}
                      triggerAriaLabel="Informações sobre penalidades por falácias"
                    />
                  </div>
                </td>
                {speakerNames.map((spk) => (
                  <td key={spk} className="p-3.5 text-right font-semibold text-rose-400">
                    {score.breakdown[spk].fallacyPenalties} pontos
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 text-text-muted">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>Propostas & Soluções (+5 pontos cada)</span>
                    <InfoTooltip
                      title={METRIC_EXPLANATIONS.proposalPoints.title}
                      content={METRIC_EXPLANATIONS.proposalPoints.shortHint}
                      triggerAriaLabel="Informações sobre pontuação de propostas e soluções"
                    />
                  </div>
                </td>
                {speakerNames.map((spk) => (
                  <td key={spk} className="p-3.5 text-right font-semibold text-amber-400">
                    +{score.breakdown[spk].proposalPoints ?? 0} pontos
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 text-text-muted">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>Eficiência em Respostas Diretas</span>
                    <InfoTooltip
                      title={METRIC_EXPLANATIONS.qaPoints.title}
                      content={METRIC_EXPLANATIONS.qaPoints.shortHint}
                      triggerAriaLabel="Informações sobre respostas diretas"
                    />
                  </div>
                </td>
                {speakerNames.map((spk) => (
                  <td key={spk} className="p-3.5 text-right font-semibold text-text-main">
                    +{score.breakdown[spk].qaPoints} pontos
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 text-text-muted">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>Controle Tonal & Compostura Sob Pressão</span>
                    <InfoTooltip
                      title={METRIC_EXPLANATIONS.tonePoints.title}
                      content={METRIC_EXPLANATIONS.tonePoints.shortHint}
                      triggerAriaLabel="Informações sobre controle tonal e compostura"
                    />
                  </div>
                </td>
                {speakerNames.map((spk) => (
                  <td key={spk} className="p-3.5 text-right font-semibold text-text-main">
                    +{score.breakdown[spk].tonePoints} pontos
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3.5 text-text-muted">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>Eficiência Temporal & Ritmo de Fala</span>
                    <InfoTooltip
                      title={METRIC_EXPLANATIONS.speakingEfficiency.title}
                      content={METRIC_EXPLANATIONS.speakingEfficiency.shortHint}
                      triggerAriaLabel="Informações sobre ritmo e tempo de fala"
                    />
                  </div>
                </td>
                {speakerNames.map((spk) => (
                  <td key={spk} className="p-3.5 text-right font-semibold text-text-main">
                    +{score.breakdown[spk].speakingEfficiency} pontos
                  </td>
                ))}
              </tr>
              {speakerNames.some((spk) => score.breakdown[spk].audiencePoints !== undefined) && (
                <tr className="bg-amber-500/5">
                  <td className="p-3.5 text-text-main font-semibold">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-amber-400 font-bold">★</span>
                      <span>Opinião do Público (Comentários YouTube)</span>
                      <span className="text-[10px] text-text-muted font-normal font-mono">
                        (até +{maxAudiencePoints} pontos distrib.)
                      </span>
                      <InfoTooltip
                        title={METRIC_EXPLANATIONS.audiencePoints.title}
                        content={METRIC_EXPLANATIONS.audiencePoints.shortHint}
                        triggerAriaLabel="Informações sobre a opinião do público"
                      />
                    </div>
                  </td>
                  {speakerNames.map((spk) => (
                    <td key={spk} className="p-3.5 text-right font-bold text-amber-400">
                      +{score.breakdown[spk].audiencePoints ?? 0} pontos
                    </td>
                  ))}
                </tr>
              )}
              {speakerNames.some((spk) => (score.breakdown[spk].searchImpactPoints ?? 0) > 0) && (
                <tr className="bg-sky-500/5">
                  <td className="p-3.5 text-text-main font-semibold">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sky-400 font-bold">★</span>
                      <span>Repercussão Web (Google Trends)</span>
                      <span className="text-[10px] text-text-muted font-normal font-mono">
                        (pontos = % de buscas obtida)
                      </span>
                      <InfoTooltip
                        title={METRIC_EXPLANATIONS.searchImpactPoints.title}
                        content={METRIC_EXPLANATIONS.searchImpactPoints.shortHint}
                        triggerAriaLabel="Informações sobre a repercussão de buscas"
                      />
                    </div>
                  </td>
                  {speakerNames.map((spk) => (
                    <td key={spk} className="p-3.5 text-right font-bold text-sky-400">
                      +{score.breakdown[spk].searchImpactPoints ?? 0} pontos
                    </td>
                  ))}
                </tr>
              )}
              <tr className="bg-surface-elevated/80 font-bold">
                <td className="p-3.5 text-text-main">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span>Total Consolidado</span>
                    <InfoTooltip
                      title={METRIC_EXPLANATIONS.totalScore.title}
                      content={METRIC_EXPLANATIONS.totalScore.shortHint}
                      triggerAriaLabel="Informações sobre o total consolidado"
                    />
                  </div>
                </td>
                {speakerNames.map((spk) => (
                  <td key={spk} className="p-3.5 text-right text-sm text-primary">
                    {score.breakdown[spk].totalPoints} pontos
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
