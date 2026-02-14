'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { createClient } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  github_url: string | null
  twitter_url: string | null
  website_url: string | null
  reputation: number
  streak: number
  role: 'user' | 'maker' | 'admin'
  created_at: string
  updated_at: string
}

export interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [supabase] = useState(() => createClient())

  const loadProfile = useCallback(async (userId: string) => {
    if (!supabase) return
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (fetchError) {
        console.error('Profile fetch failed:', fetchError.message)
        setError(fetchError.message)
      }
      setProfile(data as Profile | null)
    } catch (e) {
      console.error('Profile fetch error:', e)
      setError(e instanceof Error ? e.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        console.error('Session error:', sessionError.message)
        setError(sessionError.message)
        setLoading(false)
        return
      }
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setError(null)
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, loadProfile])

  const signIn = async () => {
    if (!supabase) return
    setError(null)
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (signInError) {
      console.error('Sign in error:', signInError.message)
      setError(signInError.message)
    }
  }

  const signOut = async () => {
    if (!supabase) return
    setError(null)
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      console.error('Sign out error:', signOutError.message)
      setError(signOutError.message)
      return
    }
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
