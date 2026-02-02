'use client'
import { useState, useCallback, useEffect } from 'react'
import { getFingerprint } from '../lib/fingerprint'

interface VoteButtonProps {
  skillId: string
  className?: string
  size?: 'sm' | 'md'
}

// Track user's votes locally (for UI state only)
const USER_VOTES_KEY = 'newth-skills-user-votes'

function getUserVotes(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(USER_VOTES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function setUserVote(skillId: string, hasVoted: boolean): void {
  if (typeof window === 'undefined') return
  try {
    const votes = getUserVotes()
    if (hasVoted && !votes.includes(skillId)) {
      votes.push(skillId)
    } else if (!hasVoted) {
      const idx = votes.indexOf(skillId)
      if (idx > -1) votes.splice(idx, 1)
    }
    localStorage.setItem(USER_VOTES_KEY, JSON.stringify(votes))
  } catch {
    // Storage error
  }
}

export function VoteButton({ skillId, className = '', size = 'md' }: VoteButtonProps) {
  const [votes, setVotes] = useState(0)
  const [hasVoted, setHasVoted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch global vote count from API on mount
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const res = await fetch(`/api/vote?skillId=${skillId}`)
        if (res.ok) {
          const data = await res.json()
          setVotes(data.count || 0)
        }
      } catch {
        // API error - keep at 0
      } finally {
        setIsLoading(false)
      }
    }

    // Check local state for hasVoted
    setHasVoted(getUserVotes().includes(skillId))
    fetchVotes()
  }, [skillId])

  const handleVote = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAnimating(true)
    const fingerprint = getFingerprint()
    const willVote = !hasVoted

    // Optimistic update
    setVotes(prev => willVote ? prev + 1 : Math.max(0, prev - 1))
    setHasVoted(willVote)
    setUserVote(skillId, willVote)

    try {
      const res = await fetch(`/api/vote?skillId=${skillId}`, {
        method: willVote ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fingerprint }),
      })

      if (res.ok) {
        const data = await res.json()
        setVotes(data.count || 0)
      }
    } catch {
      // Revert on error
      setVotes(prev => willVote ? prev - 1 : prev + 1)
      setHasVoted(!willVote)
      setUserVote(skillId, !willVote)
    }

    setTimeout(() => setIsAnimating(false), 300)
  }, [skillId, hasVoted])

  const sizeClasses = size === 'sm'
    ? 'px-2.5 py-1.5 text-xs gap-1 min-h-[36px]'
    : 'px-3 py-2 sm:py-1.5 text-sm gap-1.5 min-h-[44px] sm:min-h-[36px]'

  const iconSize = size === 'sm' ? 12 : 14

  return (
    <button
      onClick={handleVote}
      disabled={isLoading}
      className={`inline-flex items-center rounded-full transition-all ${sizeClasses} ${className} ${isAnimating ? 'scale-110' : ''} ${isLoading ? 'opacity-50' : ''}`}
      style={{
        backgroundColor: hasVoted ? 'rgba(168, 85, 247, 0.2)' : 'var(--glass-bg)',
        border: `1px solid ${hasVoted ? 'rgba(168, 85, 247, 0.4)' : 'var(--glass-border)'}`,
        color: hasVoted ? '#a855f7' : 'var(--color-grey-300)',
      }}
      title={hasVoted ? 'Remove vote' : 'Vote for this skill'}
      aria-label={`${hasVoted ? 'Remove vote from' : 'Vote for'} skill. Current votes: ${votes}`}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={hasVoted ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform ${isAnimating ? 'scale-125' : ''}`}
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
      <span className="font-medium">{votes}</span>
    </button>
  )
}
