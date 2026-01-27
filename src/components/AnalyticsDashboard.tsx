import { useState, useCallback } from 'react'
import { 
  getTotalCopyCount, 
  getMostPopularSkills, 
  getRecentCopyEvents,
  clearAnalytics,
  type CopyEvent
} from '../lib/analytics'
import { skills } from '../data/skills'

interface PopularSkill {
  skillId: string
  count: number
}

export function AnalyticsDashboard() {
  const [isOpen, setIsOpen] = useState(false)
  const [totalCopies, setTotalCopies] = useState(0)
  const [popularSkills, setPopularSkills] = useState<PopularSkill[]>([])
  const [recentEvents, setRecentEvents] = useState<CopyEvent[]>([])

  const refreshData = useCallback(() => {
    setTotalCopies(getTotalCopyCount())
    setPopularSkills(getMostPopularSkills(5))
    setRecentEvents(getRecentCopyEvents(5))
  }, [])

  const handleOpen = () => {
    refreshData()
    setIsOpen(true)
  }

  const handleClear = () => {
    if (confirm('Clear all analytics data?')) {
      clearAnalytics()
      refreshData()
    }
  }

  const getSkillName = (skillId: string): string => {
    const skill = skills.find(s => s.id === skillId)
    return skill?.name || skillId
  }

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 glass-pill px-4 py-2 text-sm"
        style={{ color: 'var(--color-grey-300)' }}
        aria-label="Open analytics dashboard"
      >
        Stats
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      <div className="relative glass-card w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Your Stats</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-grey-400 hover:text-white transition-colors"
            aria-label="Close dashboard"
          >
            &times;
          </button>
        </div>

        <div className="glass-card p-4 mb-6" style={{ backgroundColor: 'var(--glass-bg)' }}>
          <p className="text-sm mb-1" style={{ color: 'var(--color-grey-400)' }}>
            Total Installs Copied
          </p>
          <p className="text-3xl font-semibold text-white">{totalCopies}</p>
        </div>

        {popularSkills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-grey-400)' }}>
              Most Copied Skills
            </h3>
            <div className="space-y-2">
              {popularSkills.map((item, index) => (
                <div 
                  key={item.skillId}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--glass-bg)' }}
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: index === 0 ? 'var(--color-accent)' : 'var(--glass-border)',
                        color: index === 0 ? 'var(--color-bg)' : 'var(--color-grey-300)'
                      }}
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm text-white">{getSkillName(item.skillId)}</span>
                  </div>
                  <span className="text-sm" style={{ color: 'var(--color-grey-400)' }}>
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentEvents.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-grey-400)' }}>
              Recent Activity
            </h3>
            <div className="space-y-2">
              {recentEvents.map((event, index) => (
                <div 
                  key={`${event.skillId}-${event.timestamp}-${index}`}
                  className="flex items-center justify-between p-3 rounded-lg text-sm"
                  style={{ backgroundColor: 'var(--glass-bg)' }}
                >
                  <span className="text-white">{getSkillName(event.skillId)}</span>
                  <span style={{ color: 'var(--color-grey-500)' }}>
                    {formatTime(event.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalCopies === 0 && (
          <p className="text-center py-8" style={{ color: 'var(--color-grey-400)' }}>
            No activity yet. Copy an install command to get started!
          </p>
        )}

        <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
          <button
            onClick={refreshData}
            className="flex-1 glass-pill px-4 py-2 text-sm"
            style={{ color: 'var(--color-grey-300)' }}
          >
            Refresh
          </button>
          <button
            onClick={handleClear}
            className="flex-1 glass-pill px-4 py-2 text-sm"
            style={{ color: 'var(--color-grey-400)' }}
          >
            Clear Data
          </button>
        </div>

        <p className="text-xs mt-4 text-center" style={{ color: 'var(--color-grey-500)' }}>
          Stats are stored locally in your browser. No data is sent to any server.
        </p>
      </div>
    </div>
  )
}
