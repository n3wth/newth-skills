'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'

interface Comment {
  id: string
  body: string
  created_at: string
  username: string
  display_name?: string
}

interface SkillCommentsProps {
  skillId: string
  className?: string
}

export function SkillComments({ skillId, className = '' }: SkillCommentsProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newBody, setNewBody] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/comments?skillId=${encodeURIComponent(skillId)}`)
        const data = await res.json()
        setComments(data.comments || [])
      } catch {
        setComments([])
      } finally {
        setLoading(false)
      }
    }
    fetchComments()
  }, [skillId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBody.trim() || !user) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId, body: newBody.trim() }),
      })
      const data = await res.json()
      if (data.comment) {
        setComments([
          {
            id: data.comment.id,
            body: data.comment.body,
            created_at: data.comment.created_at,
            username: data.comment.username || 'You',
            display_name: data.comment.display_name,
          },
          ...comments,
        ])
        setNewBody('')
      }
    } catch {
      // Error - could toast
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={className}>
      <h2 className="section-title mb-4">Discussions</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newBody}
            onChange={e => setNewBody(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg text-sm resize-none mb-3"
            style={{
              backgroundColor: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--color-white)',
            }}
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={!newBody.trim() || submitting}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
            style={{
              backgroundColor: 'var(--glass-highlight)',
              border: '1px solid var(--glass-border)',
              color: 'var(--color-white)',
            }}
          >
            {submitting ? 'Posting...' : 'Post comment'}
          </button>
        </form>
      ) : (
        <p className="text-sm mb-6" style={{ color: 'var(--color-grey-400)' }}>
          Sign in with GitHub to join the discussion.
        </p>
      )}

      {loading ? (
        <p className="text-sm" style={{ color: 'var(--color-grey-400)' }}>Loading...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--color-grey-400)' }}>No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {comments.map(c => (
            <div
              key={c.id}
              className="p-4 rounded-lg"
              style={{
                backgroundColor: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-white">
                  {c.display_name || c.username}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-grey-400)' }}>
                  {new Date(c.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--color-grey-200)' }}>
                {c.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
