export function SkillCardSkeleton() {
  return (
    <div className="glass-card p-5 md:p-6 animate-pulse">
      <div className="mb-3 md:mb-4">
        <div
          className="w-3 h-3 rounded-full skeleton-shimmer"
          style={{ backgroundColor: 'var(--glass-highlight)' }}
        />
      </div>

      <div
        className="h-4 md:h-5 rounded skeleton-shimmer mb-2"
        style={{ backgroundColor: 'var(--glass-highlight)', width: '70%' }}
      />

      <div className="space-y-2 mb-3 md:mb-4">
        <div
          className="h-3 md:h-3.5 rounded skeleton-shimmer"
          style={{ backgroundColor: 'var(--glass-bg)', width: '100%' }}
        />
        <div
          className="h-3 md:h-3.5 rounded skeleton-shimmer"
          style={{ backgroundColor: 'var(--glass-bg)', width: '85%' }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="h-3 rounded skeleton-shimmer"
            style={{
              backgroundColor: 'var(--glass-bg)',
              width: `${40 + i * 10}px`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
