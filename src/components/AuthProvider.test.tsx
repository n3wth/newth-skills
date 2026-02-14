import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthProvider'

const mockSubscription = { unsubscribe: vi.fn() }
let authStateCallback: (event: string, session: unknown) => void

const mockSupabase = {
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    onAuthStateChange: vi.fn().mockImplementation((cb) => {
      authStateCallback = cb
      return { data: { subscription: mockSubscription } }
    }),
    signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    }),
  }),
}

vi.mock('../lib/supabase', () => ({
  createClient: () => mockSupabase,
}))

function TestConsumer() {
  const { user, profile, loading, error, signIn, signOut } = useAuth()
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? 'authenticated' : 'none'}</span>
      <span data-testid="profile">{profile?.username ?? 'none'}</span>
      <span data-testid="error">{error ?? 'none'}</span>
      <button onClick={signIn}>Sign In</button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    mockSupabase.auth.signInWithOAuth.mockResolvedValue({ error: null })
    mockSupabase.auth.signOut.mockResolvedValue({ error: null })
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    })
  })

  it('starts in loading state', () => {
    mockSupabase.auth.getSession.mockImplementation(() => new Promise(() => {}))
    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    )
    expect(screen.getByTestId('loading')).toHaveTextContent('true')
    expect(screen.getByTestId('user')).toHaveTextContent('none')
  })

  it('resolves to unauthenticated when no session', async () => {
    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })
    expect(screen.getByTestId('user')).toHaveTextContent('none')
    expect(screen.getByTestId('profile')).toHaveTextContent('none')
  })

  it('loads user and profile when session exists', async () => {
    const mockUser = { id: 'user-1', user_metadata: { user_name: 'testuser' } }
    const mockProfile = { id: 'user-1', username: 'testuser' }

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    })
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        }),
      }),
    })

    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })
    expect(screen.getByTestId('user')).toHaveTextContent('authenticated')
    expect(screen.getByTestId('profile')).toHaveTextContent('testuser')
  })

  it('handles session error gracefully', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: { message: 'Session expired' },
    })

    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })
    expect(screen.getByTestId('error')).toHaveTextContent('Session expired')
  })

  it('handles profile fetch error gracefully', async () => {
    const mockUser = { id: 'user-1', user_metadata: {} }
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    })
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Profile not found' } }),
        }),
      }),
    })

    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })
    expect(screen.getByTestId('error')).toHaveTextContent('Profile not found')
  })

  it('calls signInWithOAuth on signIn', async () => {
    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    await userEvent.click(screen.getByText('Sign In'))

    expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'github',
      options: { redirectTo: expect.stringContaining('/auth/callback') },
    })
  })

  it('handles signIn error', async () => {
    mockSupabase.auth.signInWithOAuth.mockResolvedValue({
      error: { message: 'OAuth failed' },
    })

    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    await userEvent.click(screen.getByText('Sign In'))

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('OAuth failed')
    })
  })

  it('clears user and profile on signOut', async () => {
    const mockUser = { id: 'user-1', user_metadata: {} }
    const mockProfile = { id: 'user-1', username: 'testuser' }

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    })
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        }),
      }),
    })

    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('authenticated')
    })

    await userEvent.click(screen.getByText('Sign Out'))

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('none')
      expect(screen.getByTestId('profile')).toHaveTextContent('none')
    })
  })

  it('handles signOut error', async () => {
    const mockUser = { id: 'user-1', user_metadata: {} }
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    })
    mockSupabase.auth.signOut.mockResolvedValue({
      error: { message: 'Sign out failed' },
    })

    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    await userEvent.click(screen.getByText('Sign Out'))

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Sign out failed')
    })
    // User should remain authenticated when signOut fails
    expect(screen.getByTestId('user')).toHaveTextContent('authenticated')
  })

  it('responds to auth state changes', async () => {
    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    const mockUser = { id: 'user-2', user_metadata: {} }
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { id: 'user-2', username: 'newuser' }, error: null }),
        }),
      }),
    })

    await act(async () => {
      authStateCallback('SIGNED_IN', { user: mockUser })
    })

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('authenticated')
      expect(screen.getByTestId('profile')).toHaveTextContent('newuser')
    })
  })

  it('clears state on SIGNED_OUT auth state change', async () => {
    const mockUser = { id: 'user-1', user_metadata: {} }
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    })

    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('authenticated')
    })

    await act(async () => {
      authStateCallback('SIGNED_OUT', null)
    })

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('none')
      expect(screen.getByTestId('profile')).toHaveTextContent('none')
    })
  })

  it('unsubscribes on unmount', async () => {
    const { unmount } = render(
      <AuthProvider><TestConsumer /></AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    unmount()
    expect(mockSubscription.unsubscribe).toHaveBeenCalled()
  })
})
