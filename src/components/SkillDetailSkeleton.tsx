import { Nav } from './Nav'
import { Footer } from './Footer'

export function SkillDetailSkeleton() {
  return (
    <div className="min-h-screen relative">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <Nav />

      <main className="pt-28 md:pt-32 pb-24 animate-pulse">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="max-w-4xl">
          <div
            className="h-4 rounded skeleton-shimmer mb-8"
            style={{ backgroundColor: 'var(--glass-bg)', width: '80px' }}
          />

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div
              className="w-6 h-6 rounded-full skeleton-shimmer"
              style={{ backgroundColor: 'var(--glass-highlight)' }}
            />
            <div
              className="h-6 rounded-full skeleton-shimmer"
              style={{ backgroundColor: 'var(--glass-bg)', width: '100px' }}
            />
          </div>

          <div
            className="h-10 md:h-12 lg:h-14 rounded skeleton-shimmer mb-6"
            style={{ backgroundColor: 'var(--glass-highlight)', width: '60%' }}
          />

          <div className="space-y-3 mb-6">
            <div
              className="h-5 md:h-6 rounded skeleton-shimmer"
              style={{ backgroundColor: 'var(--glass-bg)', width: '100%' }}
            />
            <div
              className="h-5 md:h-6 rounded skeleton-shimmer"
              style={{ backgroundColor: 'var(--glass-bg)', width: '90%' }}
            />
          </div>

          <div className="space-y-2 mb-8">
            <div
              className="h-4 md:h-5 rounded skeleton-shimmer"
              style={{ backgroundColor: 'var(--glass-bg)', width: '100%' }}
            />
            <div
              className="h-4 md:h-5 rounded skeleton-shimmer"
              style={{ backgroundColor: 'var(--glass-bg)', width: '95%' }}
            />
            <div
              className="h-4 md:h-5 rounded skeleton-shimmer"
              style={{ backgroundColor: 'var(--glass-bg)', width: '80%' }}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-12">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="h-7 rounded-full skeleton-shimmer"
                style={{
                  backgroundColor: 'var(--glass-bg)',
                  width: `${50 + i * 15}px`,
                }}
              />
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="glass-card p-6 md:p-8">
              <div
                className="h-5 rounded skeleton-shimmer mb-5"
                style={{ backgroundColor: 'var(--glass-highlight)', width: '100px' }}
              />
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="mt-1.5 w-1.5 h-1.5 rounded-full skeleton-shimmer shrink-0"
                      style={{ backgroundColor: 'var(--glass-highlight)' }}
                    />
                    <div
                      className="h-4 rounded skeleton-shimmer flex-1"
                      style={{ backgroundColor: 'var(--glass-bg)', width: `${70 + i * 5}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 md:p-8">
              <div
                className="h-5 rounded skeleton-shimmer mb-5"
                style={{ backgroundColor: 'var(--glass-highlight)', width: '100px' }}
              />
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="mt-1.5 w-1.5 h-1.5 rounded-full skeleton-shimmer shrink-0"
                      style={{ backgroundColor: 'var(--glass-highlight)' }}
                    />
                    <div
                      className="h-4 rounded skeleton-shimmer flex-1"
                      style={{ backgroundColor: 'var(--glass-bg)', width: `${65 + i * 7}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-6 md:p-8">
            <div
              className="h-5 rounded skeleton-shimmer mb-4"
              style={{ backgroundColor: 'var(--glass-highlight)', width: '140px' }}
            />
            <div className="command-box p-4">
              <div
                className="h-4 rounded skeleton-shimmer"
                style={{ backgroundColor: 'var(--glass-bg)', width: '80%' }}
              />
            </div>
          </div>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
