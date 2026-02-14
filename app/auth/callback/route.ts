import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/src/lib/supabase-server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  const isRelativePath = next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/@')
  const safeNext = isRelativePath ? next : '/'

  if (code) {
    const supabase = await createServerSupabaseClient()
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${origin}${safeNext}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`)
}
