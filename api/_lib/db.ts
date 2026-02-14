import { neon } from '@neondatabase/serverless'

// Support multiple env var names: Neon integration, Supabase integration, or custom prefix (e.g. SKILLS_)
const pgHost =
  process.env.PGHOST ||
  process.env.PGHOST_UNPOOLED ||
  process.env.POSTGRES_HOST ||
  process.env.SKILLS_POSTGRES_HOST

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NO_SSL ||
  process.env.SKILLS_POSTGRES_URL ||
  process.env.SKILLS_POSTGRES_PRISMA_URL ||
  (pgHost &&
  (process.env.PGUSER || process.env.SKILLS_POSTGRES_USER) &&
  (process.env.PGPASSWORD || process.env.SKILLS_POSTGRES_PASSWORD) &&
  (process.env.PGDATABASE || process.env.SKILLS_POSTGRES_DATABASE)
    ? `postgresql://${process.env.PGUSER || process.env.SKILLS_POSTGRES_USER}:${process.env.PGPASSWORD || process.env.SKILLS_POSTGRES_PASSWORD}@${pgHost}/${process.env.PGDATABASE || process.env.SKILLS_POSTGRES_DATABASE}?sslmode=require`
    : '')

if (!connectionString) {
  console.error(
    'No database connection string found. Set DATABASE_URL, POSTGRES_URL, or SKILLS_POSTGRES_URL.'
  )
}

export const sql = neon(connectionString)
