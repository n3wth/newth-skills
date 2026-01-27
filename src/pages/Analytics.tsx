import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Nav, Footer, SEO } from '../components'
import { skills } from '../data/skills'
import { 
  getAnalyticsSummary, 
  type AnalyticsSummary, 
  type TrendingPeriod,
  clearAnalytics
} from '../lib/analytics'

type TabType = 'trending' | 'popular'

function getInitialSummary(): AnalyticsSummary {
  return getAnalyticsSummary()
}

export function Analytics() {
  const [summary, setSummary] = useState<AnalyticsSummary>(getInitialSummary)
  const [activeTab, setActiveTab] = useState<TabType>('trending')
  const [trendingPeriod, setTrendingPeriod] = useState<TrendingPeriod>('weekly')

  const refreshData = useCallback(() => {
    setSummary(getAnalyticsSummary())
  }, [])

  const handleClear = () => {
    if (confirm('Clear all analytics data? This cannot be undone.')) {
      clearAnalytics()
      refreshData()
    }
  }

  const getSkillName = (skillId: string): string => {
    const skill = skills.find(s => s.id === skillId)
    return skill?.name || skillId
  }

  const getSkillCategory = (skillId: string): string => {
    const skill = skills.find(s => s.id === skillId)
    return skill?.category || 'unknown'
  }

  const getTrendingData = () => {
    switch (trendingPeriod) {
      case 'daily':
        return summary.trendingDaily
      case 'weekly':
        return summary.trendingWeekly
      case 'monthly':
        return summary.trendingMonthly
    }
  }

  const trendingData = getTrendingData()

  return (
    <div className="min-h-screen relative content-loaded">
      <SEO
        title="Analytics - newth.ai skills"
        description="See which skills are trending and popular. Track skill views and discover what's hot in the AI coding assistant ecosystem."
        canonicalUrl="/analytics"
      />
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <Nav />

      <main className="px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 text-sm hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-grey-400)' }}
          >
            <span>&larr;</span> Back to skills
          </Link>

          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
            Skill Analytics
          </h1>
          <p className="text-lg mb-12" style={{ color: 'var(--color-grey-300)' }}>
            Discover trending and popular skills based on community activity.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="glass-card p-4 md:p-6">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-grey-400)' }}>
                Total Views
              </p>
              <p className="text-2xl md:text-3xl font-semibold text-white">
                {summary?.totalViews || 0}
              </p>
            </div>
            <div className="glass-card p-4 md:p-6">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-grey-400)' }}>
                Total Installs
              </p>
              <p className="text-2xl md:text-3xl font-semibold text-white">
                {summary?.totalCopies || 0}
              </p>
            </div>
            <div className="glass-card p-4 md:p-6">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-grey-400)' }}>
                Skills Viewed
              </p>
              <p className="text-2xl md:text-3xl font-semibold text-white">
                {summary?.uniqueSkillsViewed || 0}
              </p>
            </div>
            <div className="glass-card p-4 md:p-6">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-grey-400)' }}>
                Skills Installed
              </p>
              <p className="text-2xl md:text-3xl font-semibold text-white">
                {summary?.uniqueSkillsCopied || 0}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveTab('trending')}
              className={`glass-pill px-4 py-2 text-sm font-medium transition-all ${
                activeTab === 'trending' ? 'ring-2 ring-white/30' : ''
              }`}
              style={{ 
                color: activeTab === 'trending' ? 'var(--color-white)' : 'var(--color-grey-400)',
                backgroundColor: activeTab === 'trending' ? 'var(--glass-highlight)' : 'transparent'
              }}
            >
              Trending
            </button>
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
              Most Popular
            </button>
          </div>

          {activeTab === 'trending' && (
            <div className="glass-card p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">Trending Skills</h2>
                  <p className="text-sm" style={{ color: 'var(--color-grey-400)' }}>
                    Skills with the most activity recently
                  </p>
                </div>
                <div className="flex gap-2">
                  {(['daily', 'weekly', 'monthly'] as TrendingPeriod[]).map(period => (
                    <button
                      key={period}
                      onClick={() => setTrendingPeriod(period)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                        trendingPeriod === period ? 'ring-1 ring-white/20' : ''
                      }`}
                      style={{
                        color: trendingPeriod === period ? 'var(--color-white)' : 'var(--color-grey-400)',
                        backgroundColor: trendingPeriod === period ? 'var(--glass-highlight)' : 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)'
                      }}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {trendingData.length > 0 ? (
                <div className="space-y-3">
                  {trendingData.map((item, index) => (
                    <Link
                      key={item.skillId}
                      to={`/skill/${item.skillId}`}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors"
                      style={{ backgroundColor: 'var(--glass-bg)' }}
                    >
                      <div className="flex items-center gap-4">
                        <span 
                          className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold"
                          style={{ 
                            backgroundColor: index === 0 ? '#f97316' : index === 1 ? '#a855f7' : index === 2 ? '#3b82f6' : 'var(--glass-border)',
                            color: index < 3 ? 'white' : 'var(--color-grey-300)'
                          }}
                        >
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-white font-medium">{getSkillName(item.skillId)}</p>
                          <p className="text-xs capitalize" style={{ color: 'var(--color-grey-500)' }}>
                            {getSkillCategory(item.skillId)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span 
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ 
                            color: '#f97316',
                            backgroundColor: 'rgba(249, 115, 22, 0.15)',
                            border: '1px solid rgba(249, 115, 22, 0.3)'
                          }}
                        >
                          {item.viewCount} views
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
                    No trending data yet. Browse some skills to see trends!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'popular' && (
            <div className="glass-card p-6 md:p-8 mb-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-1">Most Popular Skills</h2>
                <p className="text-sm" style={{ color: 'var(--color-grey-400)' }}>
                  Skills with the highest total views and installs
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--color-grey-300)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Most Viewed
                  </h3>
                  {summary?.mostViewed && summary.mostViewed.length > 0 ? (
                    <div className="space-y-2">
                      {summary.mostViewed.map((item, index) => (
                        <Link
                          key={item.skillId}
                          to={`/skill/${item.skillId}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                          style={{ backgroundColor: 'var(--glass-bg)' }}
                        >
                          <div className="flex items-center gap-3">
                            <span 
                              className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: index === 0 ? '#22c55e' : 'var(--glass-border)',
                                color: index === 0 ? 'white' : 'var(--color-grey-300)'
                              }}
                            >
                              {index + 1}
                            </span>
                            <span className="text-sm text-white">{getSkillName(item.skillId)}</span>
                          </div>
                          <span className="text-xs" style={{ color: 'var(--color-grey-400)' }}>
                            {item.count} views
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm py-4" style={{ color: 'var(--color-grey-500)' }}>
                      No view data yet
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--color-grey-300)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Most Installed
                  </h3>
                  {summary?.mostCopied && summary.mostCopied.length > 0 ? (
                    <div className="space-y-2">
                      {summary.mostCopied.map((item, index) => (
                        <Link
                          key={item.skillId}
                          to={`/skill/${item.skillId}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                          style={{ backgroundColor: 'var(--glass-bg)' }}
                        >
                          <div className="flex items-center gap-3">
                            <span 
                              className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: index === 0 ? '#3b82f6' : 'var(--glass-border)',
                                color: index === 0 ? 'white' : 'var(--color-grey-300)'
                              }}
                            >
                              {index + 1}
                            </span>
                            <span className="text-sm text-white">{getSkillName(item.skillId)}</span>
                          </div>
                          <span className="text-xs" style={{ color: 'var(--color-grey-400)' }}>
                            {item.count} installs
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm py-4" style={{ color: 'var(--color-grey-500)' }}>
                      No install data yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
            <div>
              <p className="text-sm text-white mb-1">Your analytics data</p>
              <p className="text-xs" style={{ color: 'var(--color-grey-500)' }}>
                All data is stored locally in your browser. No data is sent to any server.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={refreshData}
                className="glass-pill px-4 py-2 text-sm"
                style={{ color: 'var(--color-grey-300)' }}
              >
                Refresh
              </button>
              <button
                onClick={handleClear}
                className="glass-pill px-4 py-2 text-sm"
                style={{ color: 'var(--color-grey-500)' }}
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
