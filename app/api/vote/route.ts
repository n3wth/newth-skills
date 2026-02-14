import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/src/lib/supabase-server'

async function getNeonSql() {
  const hasDb =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.SKILLS_POSTGRES_URL
  if (!hasDb) return null
  const { sql } = await import('@/api/_lib/db')
  return sql
}

/** GET /api/vote?skillId=x - returns { count } from Supabase + Neon */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const skillId = searchParams.get('skillId')
  if (!skillId) {
    return NextResponse.json({ error: 'skillId required' }, { status: 400 })
  }

  let total = 0

  // Supabase upvotes (authenticated users)
  const supabase = await createServerSupabaseClient()
  if (supabase) {
    const { count } = await supabase
      .from('upvotes')
      .select('*', { count: 'exact', head: true })
      .eq('skill_id', skillId)
    total += count ?? 0
  }

  // Neon votes (fingerprint / legacy)
  const sql = await getNeonSql()
  if (sql) {
    try {
      const result = await sql`SELECT COUNT(*) as count FROM votes WHERE skill_id = ${skillId}`
      total += parseInt(String(result[0]?.count ?? 0), 10)
    } catch {
      /* Neon table missing or error - ignore */
    }
  }

  return NextResponse.json({ count: total })
}

/** POST /api/vote - add vote. Auth: Supabase. Anonymous: Neon fingerprint */
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const skillId = searchParams.get('skillId')
  if (!skillId) {
    return NextResponse.json({ error: 'skillId required' }, { status: 400 })
  }

  const supabase = await createServerSupabaseClient()
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase.from('upvotes').upsert(
        { user_id: user.id, skill_id: skillId },
        { onConflict: 'user_id,skill_id', ignoreDuplicates: true }
      )
      if (!error) {
        const { count } = await supabase
          .from('upvotes')
          .select('*', { count: 'exact', head: true })
          .eq('skill_id', skillId)
        let total = count ?? 0
        const sql = await getNeonSql()
        if (sql) {
          try {
            const r = await sql`SELECT COUNT(*) as c FROM votes WHERE skill_id = ${skillId}`
            total += parseInt(String(r[0]?.c ?? 0), 10)
          } catch { /* ignore Neon errors */ }
        }
        return NextResponse.json({ count: total })
      }
    }
  }

  // Anonymous: Neon fingerprint
  const body = await request.json().catch(() => ({}))
  const fingerprint = body?.fingerprint
  if (!fingerprint) {
    return NextResponse.json({ error: 'fingerprint required when not authenticated' }, { status: 400 })
  }
  const neonSql = await getNeonSql()
  if (!neonSql) {
    return NextResponse.json({ error: 'Vote storage not configured' }, { status: 503 })
  }
  await neonSql`
    INSERT INTO votes (skill_id, fingerprint)
    VALUES (${skillId}, ${fingerprint})
    ON CONFLICT (skill_id, fingerprint) DO NOTHING
  `
  const result = await neonSql`SELECT COUNT(*) as count FROM votes WHERE skill_id = ${skillId}`
  let total = parseInt(String(result[0]?.count ?? 0), 10)
  if (supabase) {
    const { count } = await supabase
      .from('upvotes')
      .select('*', { count: 'exact', head: true })
      .eq('skill_id', skillId)
    total += count ?? 0
  }
  return NextResponse.json({ count: total })
}

/** DELETE /api/vote - remove vote */
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const skillId = searchParams.get('skillId')
  if (!skillId) {
    return NextResponse.json({ error: 'skillId required' }, { status: 400 })
  }

  const supabase = await createServerSupabaseClient()
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('upvotes').delete().eq('user_id', user.id).eq('skill_id', skillId)
      let total = 0
      const { count } = await supabase
        .from('upvotes')
        .select('*', { count: 'exact', head: true })
        .eq('skill_id', skillId)
      total += count ?? 0
      const neonSql = await getNeonSql()
      if (neonSql) {
        try {
          const r = await neonSql`SELECT COUNT(*) as c FROM votes WHERE skill_id = ${skillId}`
          total += parseInt(String(r[0]?.c ?? 0), 10)
        } catch { /* ignore Neon errors */ }
      }
      return NextResponse.json({ count: total })
    }
  }

  const body = await request.json().catch(() => ({}))
  const fingerprint = body?.fingerprint
  if (!fingerprint) {
    return NextResponse.json({ error: 'fingerprint required when not authenticated' }, { status: 400 })
  }
  const neonSql = await getNeonSql()
  if (!neonSql) {
    return NextResponse.json({ error: 'Vote storage not configured' }, { status: 503 })
  }
  await neonSql`DELETE FROM votes WHERE skill_id = ${skillId} AND fingerprint = ${fingerprint}`
  const result = await neonSql`SELECT COUNT(*) as count FROM votes WHERE skill_id = ${skillId}`
  let total = parseInt(String(result[0]?.count ?? 0), 10)
  if (supabase) {
    const { count } = await supabase
      .from('upvotes')
      .select('*', { count: 'exact', head: true })
      .eq('skill_id', skillId)
    total += count ?? 0
  }
  return NextResponse.json({ count: total })
}
