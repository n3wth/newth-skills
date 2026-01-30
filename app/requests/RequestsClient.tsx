'use client'

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Nav } from '@/src/components/Nav'
import { Footer } from '@/src/components/Footer'
import { CategoryShape } from '@/src/components/CategoryShape'
import {
  getAllRequests,
  createFeatureRequest,
  voteForRequest,
  getRequestVotes,
  type FeatureRequest
} from '@/src/lib/community'
import { categories } from '@/src/data/skills'

type SortOption = 'votes' | 'newest' | 'oldest'
type FilterStatus = 'all' | 'open' | 'planned' | 'completed'

export function RequestsClient() {
  const [requests, setRequests] = useState<FeatureRequest[]>(() => getAllRequests())
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newCategory, setNewCategory] = useState('development')
  const [sortBy, setSortBy] = useState<SortOption>('votes')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [voteStates, setVoteStates] = useState<Record<string, { votes: number; hasVoted: boolean }>>(() => {
    const allRequests = getAllRequests()
    const states: Record<string, { votes: number; hasVoted: boolean }> = {}
    allRequests.forEach(r => {
      states[r.id] = getRequestVotes(r.id)
    })
    return states
  })

  const handleCreateRequest = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newDescription.trim()) return

    const request = createFeatureRequest(newTitle.trim(), newDescription.trim(), newCategory)
    setRequests(getAllRequests())
    setVoteStates(prev => ({
      ...prev,
      [request.id]: { votes: 1, hasVoted: true }
    }))
    setNewTitle('')
    setNewDescription('')
    setNewCategory('development')
    setShowCreateForm(false)
  }, [newTitle, newDescription, newCategory])

  const handleVote = useCallback((requestId: string) => {
    const result = voteForRequest(requestId)
    setVoteStates(prev => ({
      ...prev,
      [requestId]: result
    }))
  }, [])

  const filteredAndSortedRequests = useMemo(() => {
    let result = [...requests]

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(r => r.status === filterStatus)
    }

    // Sort
    switch (sortBy) {
      case 'votes':
        result.sort((a, b) => (voteStates[b.id]?.votes || b.votes) - (voteStates[a.id]?.votes || a.votes))
        break
      case 'newest':
        result.sort((a, b) => b.createdAt - a.createdAt)
        break
      case 'oldest':
        result.sort((a, b) => a.createdAt - b.createdAt)
        break
    }

    return result
  }, [requests, sortBy, filterStatus, voteStates])

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    open: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' },
    planned: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' },
    completed: { bg: 'rgba(168, 85, 247, 0.15)', text: '#a855f7', border: 'rgba(168, 85, 247, 0.3)' },
  }

  return (
    <div className="min-h-screen relative content-loaded">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <Nav />

      <main className="px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 mb-4 text-sm hover:opacity-70 transition-opacity"
                style={{ color: 'var(--color-grey-400)' }}
              >
                <span>&larr;</span> All skills
              </Link>
              <h1 className="text-3xl md:text-4xl font-semibold text-white">
                Feature Requests
              </h1>
              <p className="mt-2" style={{ color: 'var(--color-grey-300)' }}>
                Submit ideas for new skills and vote on requests from the community
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90 flex items-center gap-2"
              style={{ backgroundColor: '#22c55e' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Request
            </button>
          </div>

          {showCreateForm && (
            <div className="glass-card p-6 mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">Submit a Feature Request</h2>
              <form onSubmit={handleCreateRequest}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Skill for Kubernetes deployment"
                    className="w-full px-4 py-3 rounded-lg text-sm bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20"
                    style={{ borderColor: 'var(--glass-border)' }}
                    autoFocus
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe what this skill should do and why it would be useful..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg text-sm bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
                    style={{ borderColor: 'var(--glass-border)' }}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-white mb-2">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.filter(c => c.id !== 'all').map(category => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setNewCategory(category.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
                          newCategory === category.id ? 'ring-1 ring-white/40' : ''
                        }`}
                        style={{
                          backgroundColor: newCategory === category.id ? 'var(--glass-highlight)' : 'var(--glass-bg)',
                          border: '1px solid var(--glass-border)',
                          color: 'var(--color-grey-200)',
                        }}
                      >
                        <CategoryShape category={category.id as 'development' | 'documents' | 'creative' | 'business'} size={10} />
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-70"
                    style={{ color: 'var(--color-grey-400)', border: '1px solid var(--glass-border)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newTitle.trim() || !newDescription.trim()}
                    className="px-6 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: '#22c55e' }}
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: 'var(--color-grey-400)' }}>Filter:</span>
              {(['all', 'open', 'planned', 'completed'] as FilterStatus[]).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    filterStatus === status ? 'ring-1 ring-white/40' : ''
                  }`}
                  style={{
                    backgroundColor: filterStatus === status ? 'var(--glass-highlight)' : 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--color-grey-200)',
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: 'var(--color-grey-400)' }}>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                style={{ borderColor: 'var(--glass-border)' }}
              >
                <option value="votes">Most Votes</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          {filteredAndSortedRequests.length === 0 ? (
            <div className="text-center py-16 glass-card">
              <p className="text-lg text-white mb-2">No requests yet</p>
              <p className="text-sm mb-4" style={{ color: 'var(--color-grey-400)' }}>
                Be the first to submit a feature request!
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#22c55e' }}
              >
                Submit Request
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedRequests.map(request => {
                const voteState = voteStates[request.id] || { votes: request.votes, hasVoted: false }
                const colors = statusColors[request.status]

                return (
                  <div key={request.id} className="glass-card p-5 flex gap-4">
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleVote(request.id)}
                        className={`p-2 rounded-lg transition-all ${voteState.hasVoted ? 'scale-105' : ''}`}
                        style={{
                          backgroundColor: voteState.hasVoted ? 'rgba(168, 85, 247, 0.2)' : 'var(--glass-bg)',
                          border: `1px solid ${voteState.hasVoted ? 'rgba(168, 85, 247, 0.4)' : 'var(--glass-border)'}`,
                          color: voteState.hasVoted ? '#a855f7' : 'var(--color-grey-300)',
                        }}
                        title={voteState.hasVoted ? 'Remove vote' : 'Vote for this request'}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={voteState.hasVoted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                      </button>
                      <span className="text-sm font-semibold mt-1" style={{ color: voteState.hasVoted ? '#a855f7' : 'var(--color-grey-200)' }}>
                        {voteState.votes}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-base font-semibold text-white">{request.title}</h3>
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          {request.status}
                        </span>
                      </div>

                      <p className="text-sm mb-3" style={{ color: 'var(--color-grey-300)' }}>
                        {request.description}
                      </p>

                      <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-grey-400)' }}>
                        <span className="flex items-center gap-1">
                          <CategoryShape category={request.category as 'development' | 'documents' | 'creative' | 'business'} size={10} />
                          {request.category}
                        </span>
                        <span>
                          {new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
