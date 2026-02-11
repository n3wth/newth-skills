'use client'
import { forwardRef, useCallback, memo } from 'react'
import Link from 'next/link'
import { type Skill } from '../data/skills'
import { CategoryShape } from './CategoryShape'
import { CompatibilityMatrix } from './CompatibilityMatrix'
import { getCopyCount } from '../lib/analytics'
import { HoverPreview } from './HoverPreview'
import { useHoverPreview } from '../hooks'

interface SkillCardProps {
  skill: Skill
  isSelected?: boolean
  showPopularity?: boolean
  isTrending?: boolean
  isPopular?: boolean
  showContributor?: boolean
}

function isRecentlyUpdated(lastUpdated: string): boolean {
  const updateDate = new Date(lastUpdated)
  const now = new Date()
  const daysDiff = Math.floor((now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24))
  return daysDiff <= 30
}

export const SkillCard = memo(forwardRef<HTMLAnchorElement, SkillCardProps>(
  function SkillCard({ skill, isSelected = false, showPopularity = false, isTrending = false, isPopular = false, showContributor = true }, ref) {
    const copyCount = showPopularity ? getCopyCount(skill.id) : 0
    const isNew = isRecentlyUpdated(skill.lastUpdated)

    const {
      showPreview,
      anchorRect,
      elementRef,
      triggerProps,
      previewProps,
      closePreview,
    } = useHoverPreview()

    // Combine refs
    const setRefs = useCallback(
      (element: HTMLAnchorElement | null) => {
        elementRef.current = element
        if (typeof ref === 'function') {
          ref(element)
        } else if (ref) {
          ref.current = element
        }
      },
      [ref, elementRef]
    )

    return (
      <div className="relative h-full" onMouseEnter={triggerProps.onMouseEnter} onMouseLeave={triggerProps.onMouseLeave}>
        <Link
          ref={setRefs}
          href={`/skill/${skill.id}`}
          className={`skill-card glass-card group cursor-pointer p-4 sm:p-5 md:p-6 flex flex-col h-full ${isSelected ? 'ring-2 ring-white/40' : ''}`}
          aria-current={isSelected ? 'true' : undefined}
          onTouchStart={triggerProps.onTouchStart}
        >
          {/* Header with badges */}
          <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryShape category={skill.category} size={12} />
              {isTrending && <Badge color="#f97316" icon="trending">Trending</Badge>}
              {isPopular && !isTrending && <Badge color="#a855f7" icon="popular">Popular</Badge>}
              {isNew && !isTrending && !isPopular && <Badge color="#22c55e">New</Badge>}
            </div>
            {showPopularity && copyCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: 'var(--color-grey-300)', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                {copyCount} {copyCount === 1 ? 'install' : 'installs'}
              </span>
            )}
          </div>

          <h3 className="text-sm md:text-base font-semibold mb-2 text-white">{skill.name}</h3>

          <p className="text-[11px] sm:text-xs md:text-sm leading-relaxed mb-2 sm:mb-3 md:mb-4 line-clamp-3" style={{ color: 'var(--color-grey-200)' }}>
            {skill.description}
          </p>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            {skill.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-grey-400)' }}>
                {tag}
              </span>
            ))}
          </div>

          {skill.compatibility && skill.compatibility.length > 0 && (
            <div className="mb-3">
              <CompatibilityMatrix compatibility={skill.compatibility} size="sm" />
            </div>
          )}

          {showContributor && skill.contributor && (
            <div className="flex items-center gap-2 pt-3 mt-auto" style={{ borderTop: '1px solid var(--glass-border)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-grey-500)' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-[10px]" style={{ color: 'var(--color-grey-400)' }}>by {skill.contributor.name}</span>
            </div>
          )}
        </Link>

        {showPreview && (
          <div {...previewProps}>
            <HoverPreview skill={skill} isVisible={showPreview} anchorRect={anchorRect} onClose={closePreview} />
          </div>
        )}
      </div>
    )
  }
))

// Badge sub-component - subtle text indicator, no pill background
function Badge({ color, icon, children }: { color: string; icon?: 'trending' | 'popular'; children: React.ReactNode }) {
  return (
    <span
      className="text-[9px] font-medium flex items-center gap-1 uppercase tracking-wider"
      style={{ color }}
    >
      {icon === 'trending' && (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 23c-3.65 0-7.68-2.91-7.97-8.03-.06-1.06.56-1.97 1.47-2.47.85-.47 1.89-.45 2.7.11l.08.06c.05-.67.18-1.43.43-2.2.61-1.92 1.84-3.6 3.29-5.47l2-2.57 2 2.57c1.45 1.87 2.68 3.55 3.29 5.47.25.77.38 1.53.43 2.2l.08-.06c.81-.56 1.85-.58 2.7-.11.91.5 1.53 1.41 1.47 2.47C20.68 20.09 15.65 23 12 23z" />
        </svg>
      )}
      {icon === 'popular' && (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      )}
      {children}
    </span>
  )
}
