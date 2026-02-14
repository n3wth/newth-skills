import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * GET /api/health/supabase
 * Verifies Supabase connection and that migrations (upvotes, comments, profiles) are applied.
 * Safe to call from production — returns status only, no secrets.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SKILLS_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SKILLS_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return NextResponse.json(
      { ok: false, error: 'Supabase not configured', tables: {} },
      { status: 503 }
    )
  }

  const supabase = createClient(url, anonKey)
  const tables: Record<string, { ok: boolean; error?: string }> = {}

  for (const table of ['upvotes', 'comments', 'profiles']) {
    const { error } = await supabase.from(table).select('*').limit(1)
    tables[table] = error ? { ok: false, error: error.message } : { ok: true }
  }

  const allOk = Object.values(tables).every((t) => t.ok)

  return NextResponse.json(
    {
      ok: allOk,
      tables,
    },
    { status: allOk ? 200 : 503 }
  )
}
