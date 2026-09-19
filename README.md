# Argumeta — Plataforma de Inteligência e Análise de Debates

Plataforma independente de análise algorítmica de debates audiovisuais, verificação factual, mapeamento de falácias e ranking técnico comparativo.

---

## 🎯 Princípios da Plataforma

- **100% Algorítmico & Imparcial**: Todas as métricas, pontuações, detecções de falácias e checagens factuais são geradas de forma estritamente automatizada por inteligência artificial auditável. Não há interferência ou alteração manual de dados por humanos.
- **Acesso Livre**: Não exige cadastro ou autenticação de usuários para consulta.
- **Segurança Reforçada**: Blindado por políticas de Row Level Security (RLS) no Supabase, modo somente-leitura restritivo, proteções anti-scraping/robôs e sanitização contra injeções.

---

## 🚀 Tecnologias

- **React 19** + **TypeScript**
- **Vite 6** + **Tailwind CSS v4** (Identidade visual Ônix & Sálvia)
- **TanStack Query v5** (React Query)
- **React Router v7** (com code splitting via `React.lazy`)
- **Supabase** (PostgreSQL + Storage + RLS)
- **DOMPurify** (Prevenção de XSS)
- **Vitest** + **Testing Library**

---

## 📦 Como Rodar Localmente

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente**:
   Copie `.env.example` para `.env` e defina as chaves anônimas públicas do Supabase:
   ```env
   VITE_SUPABASE_URL=https://<seu-projeto>.supabase.co
   VITE_SUPABASE_ANON_KEY=<sua-anon-key>
   ```

3. **Executar em desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Rodar testes**:
   ```bash
   npm run test
   ```

5. **Build de produção**:
   ```bash
   npm run build
   ```

---

## 🛡️ Segurança no Supabase (RLS)

Execute o script [`supabase/migrations/20260919000002_argumeta_public_security_rls.sql`](supabase/migrations/20260919000002_argumeta_public_security_rls.sql) no SQL Editor do Supabase para garantir que usuários anônimos tenham apenas permissão de leitura (`SELECT`) em debates concluídos e debatedores, bloqueando qualquer mutação pública.
