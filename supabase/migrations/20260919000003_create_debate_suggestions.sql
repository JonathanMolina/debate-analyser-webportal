-- ==============================================================================
-- PROJETO ARGUMETA: SUGESTÕES DE DEBATES PELA COMUNIDADE
-- Data: 2026-09-19
-- ==============================================================================

-- 1. Tabela: public.debate_suggestions
CREATE TABLE IF NOT EXISTS public.debate_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    youtube_url TEXT NOT NULL,
    youtube_video_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    debaters TEXT,
    submitted_by TEXT NOT NULL DEFAULT 'Anônimo',
    likes_count INTEGER NOT NULL DEFAULT 0,
    dislikes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'voting', -- 'voting', 'under_review', 'accepted', 'rejected'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tabela: public.suggestion_comments
CREATE TABLE IF NOT EXISTS public.suggestion_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    suggestion_id UUID NOT NULL REFERENCES public.debate_suggestions(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL DEFAULT 'Anônimo',
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Índices de performance
CREATE INDEX IF NOT EXISTS idx_debate_suggestions_created ON public.debate_suggestions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_debate_suggestions_likes ON public.debate_suggestions(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_debate_suggestions_status ON public.debate_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_suggestion_comments_suggestion ON public.suggestion_comments(suggestion_id, created_at ASC);

-- 4. Função & Trigger para sincronizar comments_count
CREATE OR REPLACE FUNCTION public.sync_suggestion_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.debate_suggestions
        SET comments_count = comments_count + 1
        WHERE id = NEW.suggestion_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.debate_suggestions
        SET comments_count = GREATEST(0, comments_count - 1)
        WHERE id = OLD.suggestion_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_suggestion_comments ON public.suggestion_comments;
CREATE TRIGGER trg_sync_suggestion_comments
AFTER INSERT OR DELETE ON public.suggestion_comments
FOR EACH ROW
EXECUTE FUNCTION public.sync_suggestion_comments_count();

-- 5. RPC para votação atômica (Like/Dislike)
CREATE OR REPLACE FUNCTION public.vote_suggestion(
    p_suggestion_id UUID,
    p_vote_type TEXT,
    p_prev_vote TEXT DEFAULT NULL
)
RETURNS TABLE (new_likes INT, new_dislikes INT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    delta_likes INT := 0;
    delta_dislikes INT := 0;
    res_likes INT := 0;
    res_dislikes INT := 0;
BEGIN
    -- Reverter voto anterior se aplicável
    IF p_prev_vote = 'like' THEN
        delta_likes := delta_likes - 1;
    ELSIF p_prev_vote = 'dislike' THEN
        delta_dislikes := delta_dislikes - 1;
    END IF;

    -- Aplicar novo voto se fornecido
    IF p_vote_type = 'like' THEN
        delta_likes := delta_likes + 1;
    ELSIF p_vote_type = 'dislike' THEN
        delta_dislikes := delta_dislikes + 1;
    END IF;

    UPDATE public.debate_suggestions
    SET 
        likes_count = GREATEST(0, likes_count + delta_likes),
        dislikes_count = GREATEST(0, dislikes_count + delta_dislikes)
    WHERE id = p_suggestion_id
    RETURNING likes_count, dislikes_count INTO res_likes, res_dislikes;

    RETURN QUERY SELECT res_likes, res_dislikes;
END;
$$;

-- 6. Row Level Security (RLS)
ALTER TABLE public.debate_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestion_comments ENABLE ROW LEVEL SECURITY;

-- Permissões de Leitura Pública
DROP POLICY IF EXISTS "anon_read_suggestions" ON public.debate_suggestions;
CREATE POLICY "anon_read_suggestions"
ON public.debate_suggestions
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "anon_read_comments" ON public.suggestion_comments;
CREATE POLICY "anon_read_comments"
ON public.suggestion_comments
FOR SELECT
TO anon, authenticated
USING (true);

-- Permissões de Inserção Pública com Validações
DROP POLICY IF EXISTS "anon_insert_suggestions" ON public.debate_suggestions;
CREATE POLICY "anon_insert_suggestions"
ON public.debate_suggestions
FOR INSERT
TO anon, authenticated
WITH CHECK (
    length(title) > 0 AND length(title) <= 200 AND
    length(youtube_video_id) = 11 AND
    length(youtube_url) <= 500
);

DROP POLICY IF EXISTS "anon_insert_comments" ON public.suggestion_comments;
CREATE POLICY "anon_insert_comments"
ON public.suggestion_comments
FOR INSERT
TO anon, authenticated
WITH CHECK (
    length(content) > 0 AND length(content) <= 1000
);

-- Garantir acesso de execução na função RPC
GRANT EXECUTE ON FUNCTION public.vote_suggestion(UUID, TEXT, TEXT) TO anon, authenticated;
