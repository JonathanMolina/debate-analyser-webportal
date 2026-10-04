-- Migração: Adiciona coluna proposals na tabela debate_results
-- Permite armazenar a lista de propostas e soluções citadas pelos debatedores.
ALTER TABLE public.debate_results
ADD COLUMN IF NOT EXISTS proposals JSONB NOT NULL DEFAULT '[]'::jsonb;
