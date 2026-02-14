import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/src/lib/supabase-server'

/** GET /api/comments?skillId=x - list comments for a skill (flat, newest first) */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const skillId = searchParams.get('skillId')
  if (!skillId) {
    return NextResponse.json({ error: 'skillId required' }, { status: 400 })
  }

  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    return NextResponse.json({ comments: [] })
  }

  const { data, error } = await supabase
    .from('comments')
    .select('id, body, created_at, user_id')
    .eq('skill_id', skillId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Fetch profiles for user_ids
  const userIds = [...new Set((data || []).map((c: { user_id: string }) => c.user_id))]
  const profileMap: Record<string, { username: string; display_name?: string }> = {}
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, display_name')
      .in('id', userIds)
    for (const p of profiles || []) {
      profileMap[p.id] = { username: p.username, display_name: p.display_name }
    }
  }

  return NextResponse.json({
    comments: (data || []).map((c: { id: string; body: string; created_at: string; user_id: string }) => ({
      id: c.id,
      body: c.body,
      created_at: c.created_at,
      username: profileMap[c.user_id]?.username || 'Anonymous',
      display_name: profileMap[c.user_id]?.display_name,
    })),
  })
}

/** POST /api/comments - create comment (auth required) */
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 503 })
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Sign in to comment' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const { skillId, body: commentBody, parentId } = body as { skillId?: string; body?: string; parentId?: string }
  if (!skillId || !commentBody?.trim()) {
    return NextResponse.json({ error: 'skillId and body required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: user.id,
      skill_id: skillId,
      parent_id: parentId || null,
      body: commentBody.trim(),
    })
    .select('id, body, created_at, user_id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name')
    .eq('id', user.id)
    .single()

  return NextResponse.json({
    comment: {
      ...data,
      username: profile?.username || user.user_metadata?.user_name || 'User',
      display_name: profile?.display_name || user.user_metadata?.full_name,
    },
  })
}
