import { supabase, isSupabaseConfigured } from '@/app/supabase/client';
import type { DebateJob } from '../types/debate.types';
import { sanitizeSearchQuery } from '@/features/security/utils/sanitize';

export interface DebatesQueryFilters {
  searchQuery?: string;
  category?: string;
  debaterId?: string;
}

export const fetchDebatesList = async (
  filters?: DebatesQueryFilters
): Promise<DebateJob[]> => {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    let query = supabase
      .from('debate_jobs')
      .select('*')
      .eq('status', 'completed')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (filters?.searchQuery) {
      const sanitized = sanitizeSearchQuery(filters.searchQuery);
      if (sanitized) {
        query = query.ilike('youtube_url', `%${sanitized}%`);
      }
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return [];
    }

    // Buscar resultados em lote
    const jobIds = data.map((j: { id: string }) => j.id);
    const { data: resultsData } = await supabase
      .from('debate_results')
      .select('*')
      .in('job_id', jobIds);

    const resultsMap = new Map(
      (resultsData || []).map((r: { job_id: string; metrics: unknown; timeline: unknown; fact_checks: unknown; fallacies: unknown }) => [
        r.job_id,
        r
      ])
    );

    let list: DebateJob[] = data.map((j: {
      id: string;
      youtube_url: string;
      youtube_id: string;
      speakers: unknown;
      status: string;
      progress: number;
      is_active?: boolean;
      created_at: string;
      completed_at: string;
    }) => {
      const res = resultsMap.get(j.id) as {
        metrics?: unknown;
        timeline?: unknown;
        fact_checks?: unknown;
        fallacies?: unknown;
      } | undefined;

      const speakersList = (j.speakers as DebateJob['speakers']) || [];
      const title = `Debate ${speakersList.map((s) => s.name).join(' vs ') || j.id.replace('job_', '').replace(/_/g, ' ')}`;

      return {
        id: j.id,
        title,
        youtubeUrl: j.youtube_url,
        youtubeId: j.youtube_id,
        speakers: speakersList,
        status: j.status as DebateJob['status'],
        progress: Number(j.progress) || 100,
        isActive: Boolean(j.is_active),
        metrics: res?.metrics as DebateJob['metrics'],
        timeline: res?.timeline as DebateJob['timeline'],
        factChecks: res?.fact_checks as DebateJob['factChecks'],
        fallacies: res?.fallacies as DebateJob['fallacies'],
        createdAt: new Date(j.created_at).getTime(),
        completedAt: j.completed_at ? new Date(j.completed_at).getTime() : undefined
      };
    });

    // Filtro por termo de busca nos dados recebidos do Supabase
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(
        (job) =>
          (job.title && job.title.toLowerCase().includes(q)) ||
          (job.description && job.description.toLowerCase().includes(q)) ||
          job.speakers.some((s) => s.name.toLowerCase().includes(q))
      );
    }

    // Filtro por debatedor
    if (filters?.debaterId) {
      list = list.filter((job) =>
        job.speakers.some(
          (s) =>
            s.debaterId === filters.debaterId ||
            s.name.toLowerCase().includes(filters.debaterId!.toLowerCase())
        )
      );
    }

    return list;
  } catch {
    return [];
  }
};

export const fetchDebateById = async (
  id: string
): Promise<DebateJob | null> => {
  const sanitizedId = sanitizeSearchQuery(id);
  if (!sanitizedId || !isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('debate_jobs')
      .select('*')
      .eq('id', sanitizedId)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) return null;

    const { data: resData } = await supabase
      .from('debate_results')
      .select('*')
      .eq('job_id', sanitizedId)
      .maybeSingle();

    const speakersList = (data.speakers as DebateJob['speakers']) || [];

    return {
      id: data.id,
      title: `Debate ${speakersList.map((s) => s.name).join(' vs ') || data.id.replace('job_', '').replace(/_/g, ' ')}`,
      youtubeUrl: data.youtube_url,
      youtubeId: data.youtube_id,
      speakers: speakersList,
      status: data.status as DebateJob['status'],
      progress: Number(data.progress) || 100,
      isActive: Boolean(data.is_active),
      metrics: resData?.metrics as DebateJob['metrics'],
      timeline: resData?.timeline as DebateJob['timeline'],
      factChecks: resData?.fact_checks as DebateJob['factChecks'],
      fallacies: resData?.fallacies as DebateJob['fallacies'],
      createdAt: new Date(data.created_at).getTime(),
      completedAt: data.completed_at ? new Date(data.completed_at).getTime() : undefined
    };
  } catch {
    return null;
  }
};
