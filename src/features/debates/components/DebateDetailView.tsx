import { FC } from 'react';
import { Link } from 'react-router';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Trophy,
  Scale,
  Brain,
  MessageSquare,
  FileText,
  Play
} from 'lucide-react';
import { useDebateDetail } from '../hooks/useDebateDetail';
import { DebateTimeline } from './DebateTimeline';
import { FactCheckList } from './FactCheckList';
import { FallaciesList } from './FallaciesList';
import { ScoreBreakdownPanel } from './ScoreBreakdownPanel';
import { LinguisticMetricsPanel } from './LinguisticMetricsPanel';
import { DisclaimerBanner } from '@/components/DisclaimerBanner/DisclaimerBanner';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Button } from '@/components/Button/Button';

export const DebateDetailView: FC = () => {
  const {
    debate,
    isLoading,
    activeTab,
    setActiveTab,
    currentTimestamp,
    handleSeek
  } = useDebateDetail();

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!debate) {
    return (
      <div className="p-16 text-center space-y-4 bg-surface border border-border rounded-2xl">
        <h2 className="text-xl font-bold text-text-main">
          Debate não localizado
        </h2>
        <p className="text-xs text-text-muted max-w-sm mx-auto">
          O debate solicitado não foi encontrado em nosso registro de análises.
        </p>
        <Link to="/">
          <Button variant="primary" size="sm">
            Retornar ao Início
          </Button>
        </Link>
      </div>
    );
  }

  interface DebateTabItem {
    id: 'timeline' | 'facts' | 'fallacies' | 'metrics';
    label: string;
    icon: typeof MessageSquare;
    count?: number;
  }

  const tabs: DebateTabItem[] = [
    { id: 'timeline', label: 'Timeline Retórica', icon: MessageSquare, count: debate.timeline?.length },
    { id: 'facts', label: 'Checagem de Fatos', icon: CheckCircle, count: debate.factChecks?.length },
    { id: 'fallacies', label: 'Falácias Retóricas', icon: AlertTriangle, count: debate.fallacies?.length },
    { id: 'metrics', label: 'Pontuação & Indicadores', icon: Scale }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-text-muted hover:text-text-main transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Voltar ao feed de debates</span>
        </Link>

        {debate.category && (
          <span className="px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-primary">
            {debate.category}
          </span>
        )}
      </div>

      {/* Video Player Section */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="aspect-video w-full bg-black relative">
          {debate.youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${debate.youtubeId}?start=${Math.floor(
                currentTimestamp
              )}&autoplay=0&rel=0`}
              title={debate.title || 'Debate Audiovisual'}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-text-muted space-y-2">
              <Play size={40} className="text-primary" />
              <span className="text-xs">Reprodutor integrado de vídeo</span>
            </div>
          )}
        </div>

        {/* Video Meta info */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-main tracking-tight leading-tight">
              {debate.title}
            </h1>
            {debate.description && (
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-4xl">
                {debate.description}
              </p>
            )}
          </div>

          {/* Speakers Pill Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/80">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-text-muted font-mono mr-1">
                Participantes:
              </span>
              {debate.speakers.map((spk) => (
                <div
                  key={spk.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-elevated border border-border text-xs text-text-main font-semibold"
                >
                  {spk.previewUrl && (
                    <img
                      src={spk.previewUrl}
                      alt={spk.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  )}
                  <span>{spk.name}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {Math.floor((debate.durationSeconds || 1200) / 60)} min de áudio
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                {new Date(debate.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto select-none scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-surface-elevated text-primary border border-primary/30 shadow-sm'
                  : 'text-text-muted hover:text-text-main hover:bg-surface-hover/60 border border-transparent'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-primary/20 text-primary'
                      : 'bg-canvas text-text-muted border border-border'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panes */}
      <div className="animate-fadeIn">
        {activeTab === 'timeline' && (
          <DebateTimeline
            timeline={debate.timeline}
            speakers={debate.speakers}
            onSeek={handleSeek}
          />
        )}

        {activeTab === 'facts' && (
          <FactCheckList
            factChecks={debate.factChecks}
            onSeek={handleSeek}
          />
        )}

        {activeTab === 'fallacies' && (
          <FallaciesList
            fallacies={debate.fallacies}
            onSeek={handleSeek}
          />
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <ScoreBreakdownPanel
              score={debate.metrics?.debateScore}
              speakers={debate.speakers}
            />
            <LinguisticMetricsPanel
              metrics={debate.metrics}
              speakers={debate.speakers}
            />
          </div>
        )}
      </div>

      {/* Impartiality Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
};
