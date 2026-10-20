# VolunTable
Sistema feito para gerenciamento de múltiplos projetos.

Stack: Next.js (App Router), Tailwind CSS 4, Supabase (Postgres + Auth). Identidade visual: design-system Volund (tokens em `src/app/globals.css`).

## Rodando local
1. Crie um projeto no Supabase e execute `supabase/migrations/0001_projects.sql` no SQL editor.
2. Crie um usuário em Authentication > Users.
3. `cp .env.example .env.local` e preencha URL e publishable key.
4. `npm install && npm run dev`
