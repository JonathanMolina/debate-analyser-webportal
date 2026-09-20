-- ==============================================================================
-- PROJETO ARGUMETA: TABELA DE INSCRIÇÕES NA NEWSLETTER (E-MAIL OU WHATSAPP)
-- Data: 2026-09-20
-- Objetivo: Coletar e-mails e/ou contatos de WhatsApp para envio de novas análises
--           e checagens de fatos, armazenando metadados ricos dos debates visualizados.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_type TEXT NOT NULL CHECK (contact_type IN ('email', 'whatsapp', 'both')),
    email TEXT,
    whatsapp TEXT,
    name TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_newsletter_contact CHECK (email IS NOT NULL OR whatsapp IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_newsletter_created ON public.newsletter_subscriptions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscriptions(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_newsletter_whatsapp ON public.newsletter_subscriptions(whatsapp) WHERE whatsapp IS NOT NULL;

-- Habilita Row Level Security (RLS)
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Permitir inserção anônima e autenticada pelo portal público com validação rigorosa de formato/tamanho
DROP POLICY IF EXISTS "anon_insert_newsletter" ON public.newsletter_subscriptions;
CREATE POLICY "anon_insert_newsletter"
ON public.newsletter_subscriptions
FOR INSERT
TO anon, authenticated
WITH CHECK (
    (email IS NOT NULL AND length(email) <= 150) OR
    (whatsapp IS NOT NULL AND length(whatsapp) <= 30)
);

-- Leitura e gestão restrita à equipe técnica/administrativa (service_role)
DROP POLICY IF EXISTS "service_role_manage_newsletter" ON public.newsletter_subscriptions;
CREATE POLICY "service_role_manage_newsletter"
ON public.newsletter_subscriptions
FOR ALL
TO service_role
USING (true);
