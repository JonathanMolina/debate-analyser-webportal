import { FC } from 'react';
import { Brain, Mic, MessageSquare, Activity } from 'lucide-react';
import type { DebateMetrics, SpeakerInput } from '../types/debate.types';
import { DebaterAvatar } from '@/components/DebaterAvatar';

export interface LinguisticMetricsPanelProps {
  metrics?: DebateMetrics;
  speakers?: SpeakerInput[];
}

export const LinguisticMetricsPanel: FC<LinguisticMetricsPanelProps> = ({
  metrics,
  speakers = []
}) => {
  if (!metrics) {
    return (
      <div className="p-8 text-center text-xs text-text-muted bg-surface rounded-2xl border border-border">
        Métricas retóricas em processamento.
      </div>
    );
  }

  const speakerNames = speakers.map((s) => s.name);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {speakerNames.map((spk) => {
        const ling = metrics.linguisticMetrics?.[spk];
        const tone = metrics.toneMetrics?.[spk];
        const qa = metrics.qaMetrics?.[spk];
        const content = metrics.contentMetrics?.[spk];
        const spkData = speakers.find((s) => s.name === spk);

        return (
          <div
            key={spk}
            className="bg-surface border border-border rounded-2xl p-5 space-y-5 shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <DebaterAvatar
                name={spk}
                photoUrl={spkData?.previewUrl}
                debaterId={spkData?.debaterId}
                size="md"
                className="w-10 h-10"
              />
              <div>
                <h4 className="font-bold text-base text-text-main">{spk}</h4>
                <span className="text-[11px] text-text-muted font-mono">
                  Indicadores Individuais de Oratória
                </span>
              </div>
            </div>

            {/* Metrics Sliders */}
            <div className="space-y-3.5 text-xs font-mono">
              {/* Densidade de Dados */}
              <div className="space-y-1">
                <div className="flex justify-between text-text-muted">
                  <span>Densidade de Dados / Evidências:</span>
                  <strong className="text-primary">{ling?.dataDensity ?? 65}/100</strong>
                </div>
                <div className="w-full bg-canvas h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${ling?.dataDensity ?? 65}%` }}
                  />
                </div>
              </div>

              {/* Riqueza Vocabular */}
              <div className="space-y-1">
                <div className="flex justify-between text-text-muted">
                  <span>Riqueza Vocabular (TTR):</span>
                  <strong className="text-primary">{ling?.vocabularyRichness ?? 75}/100</strong>
                </div>
                <div className="w-full bg-canvas h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${ling?.vocabularyRichness ?? 75}%` }}
                  />
                </div>
              </div>

              {/* Compostura Sob Pressão */}
              <div className="space-y-1">
                <div className="flex justify-between text-text-muted">
                  <span>Controle Emocional & Compostura:</span>
                  <strong className="text-primary">{tone?.emotionalControl ?? 78}/100</strong>
                </div>
                <div className="w-full bg-canvas h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${tone?.emotionalControl ?? 78}%` }}
                  />
                </div>
              </div>

              {/* Resposta Direta */}
              <div className="space-y-1">
                <div className="flex justify-between text-text-muted">
                  <span>Taxa de Resposta Direta:</span>
                  <strong className="text-primary">{qa?.directAnswerRate ?? 85}%</strong>
                </div>
                <div className="w-full bg-canvas h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${qa?.directAnswerRate ?? 85}%` }}
                  />
                </div>
              </div>

              {/* Taxa de Refutação Efetiva */}
              <div className="space-y-1">
                <div className="flex justify-between text-text-muted">
                  <span>Taxa de Refutação de Teses:</span>
                  <strong className="text-primary">{content?.rebuttalScore ?? 80}/100</strong>
                </div>
                <div className="w-full bg-canvas h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${content?.rebuttalScore ?? 80}%` }}
                  />
                </div>
              </div>

              {/* Palavras Por Minuto */}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-text-muted text-[11px]">
                <span>Ritmo Verbal Médio:</span>
                <span className="font-bold text-text-main">
                  {ling?.wordsPerMinute ?? 140} PPM
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
