import { supabase, isSupabaseConfigured } from '@/app/supabase/client';
import { sanitizeText } from '@/features/security/utils/sanitize';
import { globalRateLimiter } from '@/features/security/utils/rateLimiter';
import { extractYouTubeVideoId } from '../utils/youtube';
import type {
  DebateSuggestion,
  SuggestionComment,
  SuggestionInput,
  CommentInput,
  SuggestionSortOption,
  VoteType,
  VoteResult
} from '../types/suggestion.types';

interface RawDbSuggestion {
  id: string;
  youtube_url: string;
  youtube_video_id: string;
  title: string;
  description: string | null;
  debaters: string | null;
  submitted_by: string;
  likes_count: number;
  dislikes_count: number;
  comments_count: number;
  status: 'voting' | 'under_review' | 'accepted' | 'rejected';
  created_at: string;
}

interface RawDbComment {
  id: string;
  suggestion_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

const mapDbSuggestion = (row: RawDbSuggestion): DebateSuggestion => ({
  id: row.id,
  youtubeUrl: row.youtube_url,
  youtubeVideoId: row.youtube_video_id,
  title: row.title,
  description: row.description,
  debaters: row.debaters,
  submittedBy: row.submitted_by || 'Anônimo',
  likesCount: row.likes_count ?? 0,
  dislikesCount: row.dislikes_count ?? 0,
  commentsCount: row.comments_count ?? 0,
  status: row.status || 'voting',
  createdAt: row.created_at
});

const mapDbComment = (row: RawDbComment): SuggestionComment => ({
  id: row.id,
  suggestionId: row.suggestion_id,
  authorName: row.author_name || 'Anônimo',
  content: row.content,
  createdAt: row.created_at
});

// Mock inicial para quando a plataforma não estiver conectada ou estiver vazia
const INITIAL_MOCK_SUGGESTIONS: DebateSuggestion[] = [
  {
    id: 'mock-sugg-1',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeVideoId: 'dQw4w9WgXcQ',
    title: 'Debate: Inteligência Artificial e o Futuro do Trabalho no Brasil',
    description: 'Discussão entre economistas e pesquisadores sobre automação, produtividade e novas tecnologias.',
    debaters: 'Silvio Meira vs. Eduardo Giannetti',
    submittedBy: 'Carlos Mendes',
    likesCount: 24,
    dislikesCount: 2,
    commentsCount: 3,
    status: 'voting',
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString()
  },
  {
    id: 'mock-sugg-2',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeVideoId: 'dQw4w9WgXcQ',
    title: 'Roda Viva: Reforma Tributária e Segurança Jurídica',
    description: 'Análise profunda dos impactos da unificação de impostos no setor de serviços.',
    debaters: 'Bernard Appy e debatedores convidados',
    submittedBy: 'Mariana Costa',
    likesCount: 18,
    dislikesCount: 1,
    commentsCount: 1,
    status: 'under_review',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString()
  }
];

export const fetchSuggestions = async (options: {
  sort?: SuggestionSortOption;
  search?: string;
} = {}): Promise<DebateSuggestion[]> => {
  if (!isSupabaseConfigured) {
    let list = [...INITIAL_MOCK_SUGGESTIONS];
    if (options.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.debaters && s.debaters.toLowerCase().includes(q))
      );
    }
    if (options.sort === 'top') {
      list.sort((a, b) => b.likesCount - a.likesCount);
    } else if (options.sort === 'comments') {
      list.sort((a, b) => b.commentsCount - a.commentsCount);
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }

  try {
    let query = supabase.from('debate_suggestions').select('*');

    if (options.search && options.search.trim()) {
      const term = options.search.trim();
      query = query.or(`title.ilike.%${term}%,debaters.ilike.%${term}%`);
    }

    if (options.sort === 'top') {
      query = query.order('likes_count', { ascending: false }).order('created_at', { ascending: false });
    } else if (options.sort === 'comments') {
      query = query.order('comments_count', { ascending: false }).order('likes_count', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      // Fallback gracioso caso haja problema temporário de tabela
      return INITIAL_MOCK_SUGGESTIONS;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return (data as RawDbSuggestion[]).map(mapDbSuggestion);
  } catch {
    return INITIAL_MOCK_SUGGESTIONS;
  }
};

export const createSuggestion = async (
  input: SuggestionInput
): Promise<{ success: boolean; data?: DebateSuggestion; error?: string }> => {
  // Verificação de honeypot anti-bot
  if (input.honeypot && input.honeypot.trim() !== '') {
    return { success: false, error: 'Requisição inválida.' };
  }

  // Limitador de taxa
  if (!globalRateLimiter.allowRequest()) {
    return {
      success: false,
      error: 'Muitas solicitações recentemente. Aguarde um instante antes de sugerir outro debate.'
    };
  }

  const videoId = extractYouTubeVideoId(input.youtubeUrl);
  if (!videoId) {
    return {
      success: false,
      error: 'URL do YouTube inválida. Forneça um link de vídeo, Shorts ou transmissão do YouTube.'
    };
  }

  const sanitizedTitle = sanitizeText(input.title.trim()).slice(0, 200);
  if (!sanitizedTitle) {
    return { success: false, error: 'O título do debate é obrigatório.' };
  }

  const sanitizedDescription = input.description
    ? sanitizeText(input.description.trim()).slice(0, 1000)
    : null;

  const sanitizedDebaters = input.debaters
    ? sanitizeText(input.debaters.trim()).slice(0, 250)
    : null;

  const sanitizedSubmitter = input.submittedBy
    ? sanitizeText(input.submittedBy.trim()).slice(0, 80)
    : 'Anônimo';

  const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;

  if (!isSupabaseConfigured) {
    const newMock: DebateSuggestion = {
      id: `local-${Date.now()}`,
      youtubeUrl: cleanUrl,
      youtubeVideoId: videoId,
      title: sanitizedTitle,
      description: sanitizedDescription,
      debaters: sanitizedDebaters,
      submittedBy: sanitizedSubmitter,
      likesCount: 0,
      dislikesCount: 0,
      commentsCount: 0,
      status: 'voting',
      createdAt: new Date().toISOString()
    };
    INITIAL_MOCK_SUGGESTIONS.unshift(newMock);
    return { success: true, data: newMock };
  }

  try {
    const { data, error } = await supabase
      .from('debate_suggestions')
      .insert({
        youtube_url: cleanUrl,
        youtube_video_id: videoId,
        title: sanitizedTitle,
        description: sanitizedDescription,
        debaters: sanitizedDebaters,
        submitted_by: sanitizedSubmitter,
        likes_count: 0,
        dislikes_count: 0,
        comments_count: 0,
        status: 'voting'
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: 'Não foi possível salvar a sugestão no servidor.' };
    }

    return { success: true, data: mapDbSuggestion(data as RawDbSuggestion) };
  } catch {
    return { success: false, error: 'Erro inesperado ao salvar sugestão. Tente novamente mais tarde.' };
  }
};

export const voteSuggestion = async (
  suggestionId: string,
  voteType: VoteType | null,
  prevVote: VoteType | null
): Promise<{ success: boolean; data?: VoteResult; error?: string }> => {
  if (!isSupabaseConfigured) {
    return {
      success: true,
      data: {
        likesCount: voteType === 'like' ? 1 : 0,
        dislikesCount: voteType === 'dislike' ? 1 : 0
      }
    };
  }

  try {
    const { data, error } = await supabase.rpc('vote_suggestion', {
      p_suggestion_id: suggestionId,
      p_vote_type: voteType,
      p_prev_vote: prevVote
    });

    if (error) {
      return { success: false, error: 'Falha ao registrar voto.' };
    }

    const row = Array.isArray(data) && data[0] ? data[0] : (data as { new_likes?: number; new_dislikes?: number });
    return {
      success: true,
      data: {
        likesCount: row?.new_likes ?? 0,
        dislikesCount: row?.new_dislikes ?? 0
      }
    };
  } catch {
    return { success: false, error: 'Erro ao comunicar voto ao servidor.' };
  }
};

export const fetchComments = async (
  suggestionId: string
): Promise<SuggestionComment[]> => {
  if (!isSupabaseConfigured) {
    return [
      {
        id: `mock-comm-${suggestionId}-1`,
        suggestionId,
        authorName: 'Debatedor Curioso',
        content: 'Excelente indicação! Esse debate teve momentos chave de refutação retórica.',
        createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString()
      }
    ];
  }

  try {
    const { data, error } = await supabase
      .from('suggestion_comments')
      .select('*')
      .eq('suggestion_id', suggestionId)
      .order('created_at', { ascending: true });

    if (error || !data) {
      return [];
    }

    return (data as RawDbComment[]).map(mapDbComment);
  } catch {
    return [];
  }
};

export const addComment = async (
  input: CommentInput
): Promise<{ success: boolean; data?: SuggestionComment; error?: string }> => {
  if (input.honeypot && input.honeypot.trim() !== '') {
    return { success: false, error: 'Requisição inválida.' };
  }

  if (!globalRateLimiter.allowRequest()) {
    return {
      success: false,
      error: 'Muitos comentários enviados recentemente. Aguarde um minuto.'
    };
  }

  const sanitizedContent = sanitizeText(input.content.trim()).slice(0, 1000);
  if (!sanitizedContent) {
    return { success: false, error: 'O comentário não pode ser vazio.' };
  }

  const sanitizedAuthor = input.authorName
    ? sanitizeText(input.authorName.trim()).slice(0, 80)
    : 'Anônimo';

  if (!isSupabaseConfigured) {
    const newMockComment: SuggestionComment = {
      id: `local-comm-${Date.now()}`,
      suggestionId: input.suggestionId,
      authorName: sanitizedAuthor,
      content: sanitizedContent,
      createdAt: new Date().toISOString()
    };
    return { success: true, data: newMockComment };
  }

  try {
    const { data, error } = await supabase
      .from('suggestion_comments')
      .insert({
        suggestion_id: input.suggestionId,
        author_name: sanitizedAuthor,
        content: sanitizedContent
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: 'Não foi possível publicar seu comentário.' };
    }

    return { success: true, data: mapDbComment(data as RawDbComment) };
  } catch {
    return { success: false, error: 'Erro inesperado ao salvar comentário.' };
  }
};
