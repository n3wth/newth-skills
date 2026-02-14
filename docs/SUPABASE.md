# Supabase Setup

Supabase powers auth, upvotes, and comments for skills.newth.ai.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values. Minimum for Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these from your [Supabase project](https://supabase.com/dashboard) → Settings → API.

### GitHub OAuth (Sign in with GitHub)

1. **Supabase** → Authentication → URL Configuration:
   - Site URL: `https://skills.newth.ai` (or your domain)
   - Redirect URLs: add `https://skills.newth.ai/auth/callback`

2. **Supabase** → Authentication → Providers → GitHub:
   - Enable GitHub
   - Create a [GitHub OAuth App](https://github.com/settings/developers) (Authorization callback: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`)
   - Add Client ID and Client Secret to Supabase

**Vercel + custom prefix:** If you set a custom prefix (e.g. `SKILLS`) for the Database integration, the app checks `SKILLS_POSTGRES_URL` (and related `SKILLS_*` vars) automatically.

## Migrations

Apply migrations to your Supabase database:

### Option A: Supabase CLI (recommended)

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF  # from dashboard URL
npx supabase db push
# or: npm run supabase:push
```

No Docker required for `db push` — it deploys to your remote project. Docker is only needed for local Supabase.

### Option B: SQL Editor

Copy each migration from `supabase/migrations/` into the SQL Editor and run:

1. `001_profiles.sql` – profiles table, RLS, triggers
2. `002_upvotes.sql` – upvotes table
3. `003_comments.sql` – comments table

## Verify Connection

### From the CLI

```bash
npm run verify:supabase
```

Requires `.env.local` with Supabase credentials. Checks that `upvotes`, `comments`, and `profiles` tables exist and are reachable.

### From the API

With the dev server running:

```bash
curl http://localhost:3000/api/health/supabase
```

Or in production:

```bash
curl https://skills.newth.ai/api/health/supabase
```

Response:

```json
{
  "ok": true,
  "tables": {
    "upvotes": { "ok": true },
    "comments": { "ok": true },
    "profiles": { "ok": true }
  }
}
```

If a table is missing, you'll see `ok: false` and an error message for that table.
