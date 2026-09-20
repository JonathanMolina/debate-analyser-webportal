import { FC } from 'react';
import { Link } from 'react-router';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Scale,
  MessageSquare,
  Play,
  Users
} from 'lucide-react';
import { useDebateDetail } from '../hooks/useDebateDetail';
import { DebateTimeline } from './DebateTimeline';
import { FactCheckList } from './FactCheckList';
import { FallaciesList } from './FallaciesList';
import { ScoreBreakdownPanel } from './ScoreBreakdownPanel';
import { LinguisticMetricsPanel } from './LinguisticMetricsPanel';
import { AudienceSentimentPanel } from './AudienceSentimentPanel';
import { DisclaimerBanner } from '@/components/DisclaimerBanner/DisclaimerBanner';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Button } from '@/components/Button/Button';
import { SeoHead, ShareButtons, generateDebateFullJsonLd } from '@/features/seo';
import { NewsletterBanner } from '@/features/newsletter/components/NewsletterBanner';
import { useLayoutContext } from '@/features/layout/components/Layout';

export const DebateDetailView: FC = () => {
  const layoutContext = useLayoutContext();
  const onOpenNewsletter = layoutContext?.onOpenNewsletter;

  const {
    debate,
    isLoading,
    activeTab,
    setActiveTab,
    currentTimestamp,
    isAutoPlay,
    iframeRef,
    handleSeek
  } = useDebateDetail();

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
            <Skeleton className="h-[600px] w-full rounded-2xl" />
          </div>
        </div>
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
    id: 'timeline' | 'facts' | 'fallacies' | 'metrics' | 'audience';
    label: string;
    icon: typeof MessageSquare;
    count?: number;
    mobileOnly?: boolean;
  }

  const tabs: DebateTabItem[] = [
    {
      id: 'timeline',
      label: 'Timeline Retórica',
      icon: MessageSquare,
      count: debate.timeline?.length,
      mobileOnly: true
    },
    {
      id: 'facts',
      label: 'Checagem de Fatos',
      icon: CheckCircle,
      count: debate.factChecks?.length
    },
    {
      id: 'fallacies',
      label: 'Falácias Retóricas',
      icon: AlertTriangle,
      count: debate.fallacies?.length
    },
    {
      id: 'metrics',
      label: 'Pontuação & Indicadores',
      icon: Scale
    },
    {
      id: 'audience',
      label: 'Opinião do Público',
      icon: Users,
      count: debate.metrics?.audienceMetrics?.topComments?.length
    }
  ];

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://argumeta.com.br';
  const speakersText = debate.speakers.map((s) => s.name).join(' vs ');
  const debateSeoTitle = `${debate.title || `Debate ${speakersText}`} — Análise e Fact-Checking`;
  const debateSeoDescription =
    debate.description ||
    `Análise retórica e checagem de fatos do debate entre ${speakersText || 'participantes'}. ${debate.factChecks?.length || 0} checagens e ${debate.fallacies?.length || 0} falácias mapeadas.`;
  const debateThumbnail =
    debate.thumbnailUrl ||
    (debate.youtubeId ? `https://img.youtube.com/vi/${debate.youtubeId}/hqdefault.jpg` : `${siteUrl}/logo-512.png`);
  const debateKeywords = [
    'debate',
    ...debate.speakers.map((s) => s.name),
    'fact-checking',
    'checagem de fatos',
    'análise retórica',
    'falácias',
    debate.category || 'política'
  ];
  const debateJsonLd = generateDebateFullJsonLd(debate, siteUrl);

  const originParam = typeof window !== 'undefined' ? `&origin=${encodeURIComponent(window.location.origin)}` : '';

  return (
    <div className="space-y-6 pb-12">
      <SeoHead
        title={debateSeoTitle}
        description={debateSeoDescription}
        keywords={debateKeywords}
        canonicalUrl={`${siteUrl}/debates/${debate.id}`}
        ogType="video.other"
        ogImage={debateThumbnail}
        ogImageAlt={`Capa do debate ${debate.title}`}
        publishedTime={debate.completedAt ? new Date(debate.completedAt).toISOString() : new Date(debate.createdAt).toISOString()}
        jsonLd={debateJsonLd}
      />

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

      {/* Main 2-Column Grid: Left (Video & Analysis Tabs), Right (Timeline & Rhetoric) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Video Player & Below it the Analysis Tabs */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Video Player Section */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-video w-full bg-black relative">
              {debate.youtubeId ? (
                <iframe
                  ref={iframeRef}
                  src={`https://www.youtube-nocookie.com/embed/${debate.youtubeId}?enablejsapi=1${originParam}&start=${Math.floor(
                    currentTimestamp
                  )}&autoplay=${isAutoPlay ? 1 : 0}&rel=0`}
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
            <div className="p-4 sm:p-5 space-y-3.5">
              <div className="space-y-1.5">
                <h1 className="text-lg sm:text-xl font-black text-text-main tracking-tight leading-snug">
                  {debate.title}
                </h1>
                {debate.description && (
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
                    {debate.description}
                  </p>
                )}
              </div>

              {/* Speakers Pill Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/80">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-text-muted font-mono mr-1">
                    Participantes:
                  </span>
                  {debate.speakers.map((spk) => (
                    <div
                      key={spk.name}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface-elevated border border-border text-xs text-text-main font-semibold"
                    >
                      {spk.previewUrl && (
                        <img
                          src={spk.previewUrl}
                          alt={spk.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      )}
                      <span>{spk.name}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono text-text-muted">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {Math.floor((debate.durationSeconds || 1200) / 60)} min de áudio
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(debate.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Social Share Bar */}
              <div className="pt-2.5 border-t border-border/60">
                <ShareButtons
                  title={debate.title || `Debate ${speakersText}`}
                  summary={debate.description}
                />
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Below Video) */}
          <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto select-none scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    tab.mobileOnly ? 'lg:hidden' : ''
                  } ${
                    isActive
                      ? 'bg-surface-elevated text-primary border border-primary/30 shadow-sm'
                      : 'text-text-muted hover:text-text-main hover:bg-surface-hover/60 border border-transparent'
                  }`}
                >
                  <Icon size={15} />
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

          {/* Tab Content Panes (Left Column) */}
          <div className="animate-fadeIn">
            {/* Timeline Tab (Rendered on mobile when selected) */}
            {activeTab === 'timeline' && (
              <div className="lg:hidden">
                <DebateTimeline
                  timeline={debate.timeline}
                  speakers={debate.speakers}
                  currentTimestamp={currentTimestamp}
                  maxHeightClass="max-h-[480px]"
                  onSeek={handleSeek}
                />
              </div>
            )}

            {/* Fallback for desktop when activeTab is timeline: display facts */}
            {activeTab === 'timeline' && (
              <div className="hidden lg:block">
                <FactCheckList
                  factChecks={debate.factChecks}
                  onSeek={handleSeek}
                />
              </div>
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

            {activeTab === 'audience' && (
              <AudienceSentimentPanel
                audienceMetrics={debate.metrics?.audienceMetrics}
                speakers={debate.speakers}
                technicalWinner={debate.metrics?.debateScore?.winner}
              />
            )}
          </div>
        </div>

        {/* Right Column: Timeline & Rhetoric Dedicated Panel (Desktop lg+) */}
        <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 flex-col bg-surface border border-border rounded-2xl overflow-hidden shadow-xl sticky top-20 max-h-[calc(100vh-6rem)]">
          {/* Header */}
          <div className="p-4 border-b border-border bg-surface-elevated/70 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-primary" />
              <h2 className="text-sm font-bold text-text-main">
                Timeline & Retórica
              </h2>
            </div>
            {debate.timeline?.length !== undefined && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25 font-semibold">
                {debate.timeline.length} falas
              </span>
            )}
          </div>

          {/* Subtitle / Interactive Hint */}
          <div className="px-4 py-2 bg-canvas/40 border-b border-border/50 text-[11px] text-text-muted flex items-center gap-1.5 font-mono shrink-0">
            <Clock size={12} className="text-primary shrink-0" />
            <span>Clique no tempo para avançar e reproduzir o vídeo</span>
          </div>

          {/* Scrollable Timeline List */}
          <div className="p-3.5 overflow-y-auto flex-1">
            <DebateTimeline
              timeline={debate.timeline}
              speakers={debate.speakers}
              currentTimestamp={currentTimestamp}
              maxHeightClass="max-h-full"
              onSeek={handleSeek}
            />
          </div>
        </div>
      </div>

      {/* Newsletter Callout */}
      {onOpenNewsletter && (
        <NewsletterBanner onOpenNewsletter={onOpenNewsletter} />
      )}

      {/* Impartiality Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
};

