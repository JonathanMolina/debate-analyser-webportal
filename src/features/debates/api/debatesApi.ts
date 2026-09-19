import { supabase, isSupabaseConfigured } from '@/app/supabase/client';
import type { DebateJob } from '../types/debate.types';
import { MOCK_DEBATES } from '@/features/mock/mockPortalData';
import { sanitizeSearchQuery } from '@/features/security/utils/sanitize';

export interface DebatesQueryFilters {
  searchQuery?: string;
  category?: string;
  debaterId?: string;
}

export const fetchDebatesList = async (
  filters?: DebatesQueryFilters
): Promise<DebateJob[]> => {
  let dbJobs: DebateJob[] = [];

  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from('debate_jobs')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (filters?.searchQuery) {
        const sanitized = sanitizeSearchQuery(filters.searchQuery);
        if (sanitized) {
          query = query.ilike('youtube_url', `%${sanitized}%`);
        }
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        // Fetch results in batch
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

        dbJobs = data.map((j: {
          id: string;
          youtube_url: string;
          youtube_id: string;
          speakers: unknown;
          status: string;
          progress: number;
          created_at: string;
          completed_at: string;
        }) => {
          const res = resultsMap.get(j.id) as {
            metrics?: unknown;
            timeline?: unknown;
            fact_checks?: unknown;
            fallacies?: unknown;
          } | undefined;

          return {
            id: j.id,
            title: `Debate ${j.id.replace('job_', '').replace(/_/g, ' ')}`,
            youtubeUrl: j.youtube_url,
            youtubeId: j.youtube_id,
            speakers: (j.speakers as DebateJob['speakers']) || [],
            status: j.status as DebateJob['status'],
            progress: Number(j.progress) || 100,
            metrics: res?.metrics as DebateJob['metrics'],
            timeline: res?.timeline as DebateJob['timeline'],
            factChecks: res?.fact_checks as DebateJob['factChecks'],
            fallacies: res?.fallacies as DebateJob['fallacies'],
            createdAt: new Date(j.created_at).getTime(),
            completedAt: j.completed_at ? new Date(j.completed_at).getTime() : undefined
          };
        });
      }
    } catch {
      // Degradação graciosa em caso de falha de rede/Supabase
    }
  }

  // Combine DB jobs with mock jobs (evita duplicatas por ID)
  const combinedMap = new Map<string, DebateJob>();
  for (const mockJob of MOCK_DEBATES) {
    combinedMap.set(mockJob.id, mockJob);
  }
  for (const dbJob of dbJobs) {
    combinedMap.set(dbJob.id, dbJob);
  }

  let list = Array.from(combinedMap.values());

  // Aplicação de filtros em memória caso especificado
  if (filters?.searchQuery) {
    const q = filters.searchQuery.toLowerCase().trim();
    list = list.filter(
      (job) =>
        (job.title && job.title.toLowerCase().includes(q)) ||
        (job.description && job.description.toLowerCase().includes(q)) ||
        job.speakers.some((s) => s.name.toLowerCase().includes(q))
    );
  }

  if (filters?.category && filters.category !== 'Todos') {
    list = list.filter((job) => job.category === filters.category);
  }

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
};

export const fetchDebateById = async (
  id: string
): Promise<DebateJob | null> => {
  const sanitizedId = sanitizeSearchQuery(id);
  const list = await fetchDebatesList();
  const match = list.find((j) => j.id === sanitizedId);
  return match || null;
};
