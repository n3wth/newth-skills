import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VoteButton } from './VoteButton'

vi.mock('./AuthProvider', () => ({
  useAuth: () => ({ user: null }),
}))

vi.mock('../lib/fingerprint', () => ({
  getFingerprint: () => 'test-fingerprint-123',
}))

describe('VoteButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    vi.mocked(localStorage.setItem).mockClear()
    global.fetch = vi.fn()
  })

  it('renders with loading state initially', () => {
    vi.mocked(fetch).mockImplementation(
      () => new Promise(() => {}) as never
    )
    render(<VoteButton skillId="test-skill" />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows vote count after fetch', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ count: 42 }),
    } as Response)
    render(<VoteButton skillId="test-skill" />)
    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument()
    })
  })

  it('has accessible aria-label', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ count: 5 }),
    } as Response)
    render(<VoteButton skillId="test-skill" />)
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Vote for')
      )
    })
  })

  it('calls POST on click when not voted', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ count: 0 }) } as Response)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ count: 1 }) } as Response)
    render(<VoteButton skillId="test-skill" />)
    await waitFor(() => expect(screen.getByText('0')).toBeInTheDocument())
    const btn = screen.getByRole('button')
    await userEvent.click(btn)
    expect(fetch).toHaveBeenLastCalledWith(
      expect.stringContaining('/api/vote'),
      expect.objectContaining({ method: 'POST' })
    )
  })
})
