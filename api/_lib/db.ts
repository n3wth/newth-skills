import { neon } from '@neondatabase/serverless'

// Support multiple env var names from Neon integration
const pgHost = process.env.PGHOST || process.env.PGHOST_UNPOOLED || process.env.POSTGRES_HOST

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NO_SSL ||
  (pgHost && process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE
    ? `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${pgHost}/${process.env.PGDATABASE}?sslmode=require`
    : '')

if (!connectionString) {
  console.error('No database connection string found. Set DATABASE_URL or connect Neon integration.')
}

export const sql = neon(connectionString)
