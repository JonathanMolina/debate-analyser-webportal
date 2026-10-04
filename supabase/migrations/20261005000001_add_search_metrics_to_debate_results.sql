-- Migração: Adiciona coluna search_metrics na tabela debate_results
-- Armazena séries temporais e consolidação de repercussão de buscas do Google Trends (via SerpApi)
ALTER TABLE public.debate_results
ADD COLUMN IF NOT EXISTS search_metrics JSONB NOT NULL DEFAULT '{}'::jsonb;
