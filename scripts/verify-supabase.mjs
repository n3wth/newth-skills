#!/usr/bin/env node
/**
 * Verify Supabase connection and migrations.
 * Run: npm run verify:supabase
 * Or: node --env-file=.env.local scripts/verify-supabase.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

function loadEnvLocal() {
  const path = resolve(process.cwd(), '.env.local')
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SKILLS_SUPABASE_URL) {
  loadEnvLocal()
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SKILLS_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SKILLS_SUPABASE_ANON_KEY

function log(msg, ok = true) {
  console.log(ok ? `✓ ${msg}` : `✗ ${msg}`)
}

async function main() {
  console.log('\nSupabase verification\n')

  if (!url || !anonKey) {
    log('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set', false)
    console.log('  Load from .env.local: node --env-file=.env.local scripts/verify-supabase.mjs')
    process.exit(1)
  }
  log('Env vars present')
  console.log(`  URL: ${url.replace(/https?:\/\//, '')}`)

  const supabase = createClient(url, anonKey)

  try {
    const { data, error } = await supabase.from('upvotes').select('id').limit(1)
    if (error) throw error
    log('upvotes table reachable')
  } catch (e) {
    log(`upvotes table: ${e.message}`, false)
    console.log('  Run: supabase db push (or apply migrations in Supabase dashboard)')
  }

  try {
    const { data, error } = await supabase.from('comments').select('id').limit(1)
    if (error) throw error
    log('comments table reachable')
  } catch (e) {
    log(`comments table: ${e.message}`, false)
  }

  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1)
    if (error) throw error
    log('profiles table reachable')
  } catch (e) {
    log(`profiles table: ${e.message}`, false)
  }

  console.log('')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
