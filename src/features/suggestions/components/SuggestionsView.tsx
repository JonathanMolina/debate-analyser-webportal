import { FC, useState } from 'react';
import { Sparkles, MessageSquare, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { useSuggestions } from '../hooks/useSuggestions';
import { SuggestionsFilterBar } from './SuggestionsFilterBar';
import { SuggestionCard } from './SuggestionCard';
import { SuggestionFormModal } from './SuggestionFormModal';
import { SuggestionVideoModal } from './SuggestionVideoModal';
import type { DebateSuggestion } from '../types/suggestion.types';
import { SeoHead } from '@/features/seo';

export const SuggestionsView: FC = () => {
  const {
    suggestions,
    isLoading,
    isError,
    sort,
    setSort,
    searchQuery,
    setSearch,
    createSuggestion
  } = useSuggestions();

  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [selectedVideoSuggestion, setSelectedVideoSuggestion] = useState<DebateSuggestion | null>(null);
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://argumeta.com.br';

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      <SeoHead
        title="Sugestões da Comunidade & Novos Debates"
        description="Sugira novos debates do YouTube para análise algorítmica de retórica e fact-checking no Argumeta. Vote nas melhores propostas da comunidade."
        keywords={['sugestões de debates', 'novos debates', 'comunidade', 'pedir análise de debate', 'Argumeta']}
        canonicalUrl={`${siteUrl}/sugestoes`}
      />

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-elevated via-surface to-surface-elevated border border-border p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold">
            <Sparkles size={14} />
            <span>Curadoria Comunitária</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-text-main tracking-tight leading-tight">
            Sugestões da Comunidade
          </h1>

          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            Compartilhe links do YouTube dos debates mais aguardados para serem analisados pela nossa
            inteligência artificial. Vote nos seus favoritos e comente para ajudar a definir as próximas análises!
          </p>

          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              icon={<Plus size={18} />}
              onClick={() => setIsSuggestModalOpen(true)}
            >
              Sugerir Próximo Debate
            </Button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Search Bar */}
      <SuggestionsFilterBar
        sort={sort}
        onSortChange={setSort}
        searchQuery={searchQuery}
        onSearchChange={setSearch}
        onOpenSuggestModal={() => setIsSuggestModalOpen(true)}
      />

      {/* Suggestions List / Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="space-y-4 p-5 rounded-2xl bg-surface border border-border">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-12 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-12 text-center rounded-2xl bg-surface border border-border space-y-3">
          <AlertCircle size={36} className="mx-auto text-status-false" />
          <h3 className="text-base font-bold text-text-main">
            Não foi possível carregar as sugestões
          </h3>
          <p className="text-xs text-text-muted max-w-md mx-auto">
            Ocorreu uma instabilidade momentânea na conexão com o servidor. Tente novamente mais tarde.
          </p>
        </div>
      ) : suggestions.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-surface border border-border space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <MessageSquare size={28} />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-lg font-bold text-text-main">
              {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhuma sugestão enviada ainda'}
            </h3>
            <p className="text-xs text-text-muted">
              {searchQuery
                ? 'Tente pesquisar por outros termos ou debatedores.'
                : 'Seja o primeiro a sugerir um debate do YouTube para ser analisado!'}
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => setIsSuggestModalOpen(true)}
          >
            Sugerir Primeiro Debate
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onWatchVideo={(sug) => setSelectedVideoSuggestion(sug)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <SuggestionFormModal
        isOpen={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
        onSubmit={createSuggestion}
      />

      <SuggestionVideoModal
        suggestion={selectedVideoSuggestion}
        isOpen={Boolean(selectedVideoSuggestion)}
        onClose={() => setSelectedVideoSuggestion(null)}
      />
    </div>
  );
};
