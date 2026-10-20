-- ==============================================================================
-- PROJETO ARGUMETA: MODO SABATINA & CADASTRO DE ENTREVISTADORES
-- Data: 2026-10-17
-- Objetivo:
--   1. Adicionar flag 'is_interviewer' na tabela 'debaters' para indicar entrevistadores/sabatinadores.
--   2. Adicionar coluna 'debate_type' na tabela 'debate_jobs' ('debate' ou 'sabatina').
--   3. Criar índices para consultas otimizadas no portal e no ETL.
-- ==============================================================================

-- 1. Flag de entrevistador na tabela debaters
ALTER TABLE public.debaters
ADD COLUMN IF NOT EXISTS is_interviewer BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.debaters.is_interviewer IS 'Indica se o participante atua prioritariamente como entrevistador / sabatinador';

-- Índice para buscas e filtros rápidos por tipo de participante
CREATE INDEX IF NOT EXISTS idx_debaters_is_interviewer
ON public.debaters(is_interviewer);

-- 2. Tipo do evento (debate vs sabatina) na tabela debate_jobs
ALTER TABLE public.debate_jobs
ADD COLUMN IF NOT EXISTS debate_type TEXT NOT NULL DEFAULT 'debate';

-- Restrição para garantir apenas valores aceitos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'check_debate_jobs_debate_type'
  ) THEN
    ALTER TABLE public.debate_jobs
    ADD CONSTRAINT check_debate_jobs_debate_type
    CHECK (debate_type IN ('debate', 'sabatina'));
  END IF;
END $$;

COMMENT ON COLUMN public.debate_jobs.debate_type IS 'Modalidade do evento: debate (confronto direto) ou sabatina (entrevistadores e sabatinado)';

-- Índice para filtros de ranking e feed por modalidade
CREATE INDEX IF NOT EXISTS idx_debate_jobs_debate_type
ON public.debate_jobs(debate_type);

CREATE INDEX IF NOT EXISTS idx_debate_jobs_type_status_active
ON public.debate_jobs(debate_type, status, is_active);
