-- ==============================================================================
-- CORREÇÃO: Sincronização do comments_count nas sugestões de debate
-- Data: 2026-09-28
-- Descrição: Adiciona SECURITY DEFINER e search_path à função do trigger
-- para que usuários anônimos (sob RLS) possam atualizar a contagem ao comentar.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.sync_suggestion_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Recalcular e sincronizar comentários existentes
UPDATE public.debate_suggestions s
SET comments_count = (
    SELECT count(*)
    FROM public.suggestion_comments c
    WHERE c.suggestion_id = s.id
);
