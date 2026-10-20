-- ==============================================================================
-- PROJETO ARGUMETA: SUPORTE A NICKNAMES / APELIDOS DE DEBATEDORES
-- Data: 2026-10-20
-- Objetivo:
--   Permitir cadastrar até 2 nicknames/apelidos por debatedor para
--   consolidação e soma de buscas no Google Trends.
-- ==============================================================================

ALTER TABLE public.debaters
ADD COLUMN IF NOT EXISTS nicknames TEXT[] DEFAULT ARRAY[]::text[];

COMMENT ON COLUMN public.debaters.nicknames IS 'Lista de até 2 apelidos/nicknames do debatedor para consolidação em buscas no Google Trends.';
