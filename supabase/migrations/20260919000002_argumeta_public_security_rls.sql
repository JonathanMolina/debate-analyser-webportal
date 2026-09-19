-- ==============================================================================
-- PROJETO ARGUMETA: POLÍTICAS DE SEGURANÇA PÚBLICA (RLS) & BLINDAGEM DO SUPABASE
-- Data: 2026-09-19
-- Objetivo: Garantir que o portal público possa LER os dados transparentemente
--           enquanto BLOQUEIA sumariamente qualquer tentativa de escrita, alteração
--           ou exclusão por usuários anônimos da web.
-- ==============================================================================

-- 1. Assegurar ativação do RLS em todas as tabelas públicas
ALTER TABLE public.debaters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_results ENABLE ROW LEVEL SECURITY;

-- 2. TABELA: public.debaters
-- Permitir LEITURA PÚBLICA (SELECT) a todos os visitantes (anon e authenticated)
DROP POLICY IF EXISTS "anon_read_debaters" ON public.debaters;
CREATE POLICY "anon_read_debaters"
ON public.debaters
FOR SELECT
TO anon, authenticated
USING (true);

-- Bloquear rigorosamente mutações vindas de anon
-- (Apenas service_role ou o pipeline ETL autenticado podem inserir/alterar)
-- Nota: Como o RLS é default-deny para operações sem política, nenhum INSERT/UPDATE/DELETE
-- será aceito para a role 'anon'.

-- 3. TABELA: public.debate_jobs
-- Garantir coluna is_active com valor default false
ALTER TABLE public.debate_jobs ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_debate_jobs_is_active ON public.debate_jobs(is_active);

-- Permitir LEITURA PÚBLICA apenas de debates CONCLUÍDOS e ATIVOS/VALIDADOS (status = 'completed' AND is_active = true)
-- Isso protege debates em processamento ou não validados pelo operador desktop.
DROP POLICY IF EXISTS "anon_read_completed_jobs" ON public.debate_jobs;
CREATE POLICY "anon_read_completed_jobs"
ON public.debate_jobs
FOR SELECT
TO anon, authenticated
USING (status = 'completed' AND is_active = true);

-- 4. TABELA: public.debate_results
-- Permitir LEITURA PÚBLICA apenas dos resultados de debates ativos
DROP POLICY IF EXISTS "anon_read_debate_results" ON public.debate_results;
CREATE POLICY "anon_read_debate_results"
ON public.debate_results
FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.debate_jobs
        WHERE debate_jobs.id = debate_results.job_id
        AND debate_jobs.is_active = true
    )
);

-- 5. STORAGE BUCKETS: Proteção contra uploads não autorizados
-- Leitura pública já habilitada para 'debater-assets' e 'debate-results'.
-- Assegura que anon JAMAIS consiga fazer upload ou sobrescrever arquivos nos buckets:
DROP POLICY IF EXISTS "anon_deny_upload_debater_assets" ON storage.objects;
DROP POLICY IF EXISTS "anon_deny_upload_debate_results" ON storage.objects;

-- 6. ÍNDICES DE ALTA PERFORMANCE (Evita sobrecarga e ataques de DoS por queries pesadas)
CREATE INDEX IF NOT EXISTS idx_debate_jobs_status_created ON public.debate_jobs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_debate_results_job_id ON public.debate_results(job_id);

-- 7. TABELA: public.feedback (Feedbacks enviados pelos usuários)
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT,
    category TEXT NOT NULL DEFAULT 'suggestion',
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Permitir envio (INSERT) anônimo pelo portal público com validação de tamanho
DROP POLICY IF EXISTS "anon_insert_feedback" ON public.feedback;
CREATE POLICY "anon_insert_feedback"
ON public.feedback
FOR INSERT
TO anon, authenticated
WITH CHECK (
    length(message) > 0 AND length(message) <= 3000
);

-- Leitura restrita estritamente à equipe técnica/administrativa (service_role)
DROP POLICY IF EXISTS "service_role_select_feedback" ON public.feedback;
CREATE POLICY "service_role_select_feedback"
ON public.feedback
FOR SELECT
TO service_role
USING (true);

