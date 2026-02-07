'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Nav, Footer } from '@/src/components'
import { skills } from '@/src/data/skills'

interface SkillAnalytics {
  skill_id: string
  views: number
  copies: number
}

type TabType = 'popular' | 'installed'

export function AnalyticsClient() {
  const [analyticsData, setAnalyticsData] = useState<SkillAnalytics[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('popular')

  // Fetch global analytics from API
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics')
        if (res.ok) {
          const data = await res.json()
          setAnalyticsData(data)
        }
      } catch {
        // API error
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  // Compute summary stats
  const summary = useMemo(() => {
    const totalViews = analyticsData.reduce((sum, item) => sum + (item.views || 0), 0)
    const totalInstalls = analyticsData.reduce((sum, item) => sum + (item.copies || 0), 0)
    const uniqueViewed = analyticsData.filter(item => item.views > 0).length
    const uniqueInstalled = analyticsData.filter(item => item.copies > 0).length

    return { totalViews, totalInstalls, uniqueViewed, uniqueInstalled }
  }, [analyticsData])

  // Get sorted lists
  const mostViewed = useMemo(() => {
    return [...analyticsData]
      .filter(item => item.views > 0)
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)
  }, [analyticsData])

  const mostInstalled = useMemo(() => {
    return [...analyticsData]
      .filter(item => item.copies > 0)
      .sort((a, b) => b.copies - a.copies)
      .slice(0, 10)
  }, [analyticsData])

  const getSkillName = (skillId: string): string => {
    const skill = skills.find(s => s.id === skillId)
    return skill?.name || skillId
  }

  const getSkillCategory = (skillId: string): string => {
    const skill = skills.find(s => s.id === skillId)
    return skill?.category || 'unknown'
  }

  return (
    <div className="min-h-screen relative content-loaded">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <Nav />

      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 text-sm hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-grey-400)' }}
          >
            <span>&larr;</span> Back to skills
          </Link>

          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
            Community Analytics
          </h1>
          <p className="text-lg mb-12" style={{ color: 'var(--color-grey-300)' }}>
            Discover which skills are popular across all users.
          </p>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card p-4 md:p-6 animate-pulse">
                  <div className="h-3 w-16 rounded mb-3" style={{ backgroundColor: 'var(--glass-border)' }} />
                  <div className="h-8 w-12 rounded" style={{ backgroundColor: 'var(--glass-border)' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="glass-card p-4 md:p-6 overflow-hidden">
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-grey-400)' }}>
                  Total Views
                </p>
                <p className="text-2xl md:text-3xl font-semibold text-white tabular-nums">
                  {summary.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="glass-card p-4 md:p-6 overflow-hidden">
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-grey-400)' }}>
                  Total Installs
                </p>
                <p className="text-2xl md:text-3xl font-semibold text-white tabular-nums">
                  {summary.totalInstalls.toLocaleString()}
                </p>
              </div>
              <div className="glass-card p-4 md:p-6 overflow-hidden">
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-grey-400)' }}>
                  Skills Viewed
                </p>
                <p className="text-2xl md:text-3xl font-semibold text-white tabular-nums">
                  {summary.uniqueViewed}
                </p>
              </div>
              <div className="glass-card p-4 md:p-6 overflow-hidden">
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-grey-400)' }}>
                  Skills Installed
                </p>
                <p className="text-2xl md:text-3xl font-semibold text-white tabular-nums">
                  {summary.uniqueInstalled}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveTab('popular')}
              className={`glass-pill px-4 py-2 text-sm font-medium transition-all ${
                activeTab === 'popular' ? 'ring-2 ring-white/30' : ''
              }`}
              style={{
                color: activeTab === 'popular' ? 'var(--color-white)' : 'var(--color-grey-400)',
                backgroundColor: activeTab === 'popular' ? 'var(--glass-highlight)' : 'transparent'
              }}
            >
              Most Viewed
            </button>
            <button
              onClick={() => setActiveTab('installed')}
              className={`glass-pill px-4 py-2 text-sm font-medium transition-all ${
                activeTab === 'installed' ? 'ring-2 ring-white/30' : ''
              }`}
              style={{
                color: activeTab === 'installed' ? 'var(--color-white)' : 'var(--color-grey-400)',
                backgroundColor: activeTab === 'installed' ? 'var(--glass-highlight)' : 'transparent'
              }}
            >
              Most Installed
            </button>
          </div>

          {activeTab === 'popular' && (
            <div className="glass-card p-6 md:p-8 mb-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-1">Most Viewed Skills</h2>
                <p className="text-sm" style={{ color: 'var(--color-grey-400)' }}>
                  Skills with the highest view counts across all users
                </p>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--glass-bg)' }} />
                  ))}
                </div>
              ) : mostViewed.length > 0 ? (
                <div className="space-y-3">
                  {mostViewed.map((item, index) => (
                    <Link
                      key={item.skill_id}
                      href={`/skill/${item.skill_id}`}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors"
                      style={{ backgroundColor: 'var(--glass-bg)' }}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold"
                          style={{
                            backgroundColor: index === 0 ? '#22c55e' : index === 1 ? '#a855f7' : index === 2 ? '#3b82f6' : 'var(--glass-border)',
                            color: index < 3 ? 'white' : 'var(--color-grey-300)'
                          }}
                        >
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-white font-medium">{getSkillName(item.skill_id)}</p>
                          <p className="text-xs capitalize" style={{ color: 'var(--color-grey-500)' }}>
                            {getSkillCategory(item.skill_id)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            color: '#22c55e',
                            backgroundColor: 'rgba(34, 197, 94, 0.15)',
                            border: '1px solid rgba(34, 197, 94, 0.3)'
                          }}
                        >
                          {item.views.toLocaleString()} views
                        </span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          style={{ color: 'var(--color-grey-500)' }}
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p style={{ color: 'var(--color-grey-400)' }}>
                    No view data yet. Be the first to explore!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'installed' && (
            <div className="glass-card p-6 md:p-8 mb-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-1">Most Installed Skills</h2>
                <p className="text-sm" style={{ color: 'var(--color-grey-400)' }}>
                  Skills with the highest install counts across all users
                </p>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--glass-bg)' }} />
                  ))}
                </div>
              ) : mostInstalled.length > 0 ? (
                <div className="space-y-3">
                  {mostInstalled.map((item, index) => (
                    <Link
                      key={item.skill_id}
                      href={`/skill/${item.skill_id}`}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors"
                      style={{ backgroundColor: 'var(--glass-bg)' }}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold"
                          style={{
                            backgroundColor: index === 0 ? '#3b82f6' : index === 1 ? '#a855f7' : index === 2 ? '#f97316' : 'var(--glass-border)',
                            color: index < 3 ? 'white' : 'var(--color-grey-300)'
                          }}
                        >
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-white font-medium">{getSkillName(item.skill_id)}</p>
                          <p className="text-xs capitalize" style={{ color: 'var(--color-grey-500)' }}>
                            {getSkillCategory(item.skill_id)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            color: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.15)',
                            border: '1px solid rgba(59, 130, 246, 0.3)'
                          }}
                        >
                          {item.copies.toLocaleString()} installs
                        </span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          style={{ color: 'var(--color-grey-500)' }}
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p style={{ color: 'var(--color-grey-400)' }}>
                    No install data yet. Try installing a skill!
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <p className="text-sm" style={{ color: 'var(--color-grey-400)' }}>
              Analytics show aggregated data across all users. Individual usage is not tracked.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
