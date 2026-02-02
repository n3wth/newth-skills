'use client'
import { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CategoryShape } from './CategoryShape'
import type { Skill } from '../data/skills'

interface RecommendationResult {
  skill: Skill
  score: number
  matchedTerms: string[]
  aiReason?: string
}

interface SkillRecommendationsProps {
  recommendations: RecommendationResult[]
  isVisible: boolean
  isLoading?: boolean
  onClose: () => void
}

export function SkillRecommendations({ recommendations, isVisible, isLoading, onClose }: SkillRecommendationsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLAnchorElement[]>([])

  useGSAP(() => {
    if (!containerRef.current) return

    if (isVisible && recommendations.length > 0) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      )

      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
          delay: 0.1
        }
      )
    }
  }, { scope: containerRef, dependencies: [isVisible, recommendations] })

  if (!isVisible || recommendations.length === 0) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-4xl mx-auto mt-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: 'var(--color-sage)' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              Recommended Skills
              {isLoading && (
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ color: 'var(--color-sage)' }}
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
            </h3>
            <p className="text-xs" style={{ color: 'var(--color-grey-400)' }}>
              {recommendations.length} skill{recommendations.length !== 1 ? 's' : ''} match your task
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="glass-pill px-3 py-1.5 rounded-full text-sm"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {recommendations.map((result, index) => (
            <Link
              key={result.skill.id}
              ref={(el) => { if (el) cardsRef.current[index] = el }}
              href={`/skill/${result.skill.id}`}
              className="glass-card skill-card p-4 sm:p-5 block group"
            >
              <div className="flex items-center gap-2 mb-3">
                <CategoryShape category={result.skill.category} size={12} />
              </div>

              <h4 className="text-sm font-semibold text-white mb-2 group-hover:text-white/90 transition-colors">
                {result.skill.name}
              </h4>

              <p
                className="text-xs leading-relaxed mb-3"
                style={{ color: 'var(--color-grey-200)' }}
              >
                {result.skill.description}
              </p>

              {result.aiReason ? (
                <p
                  className="text-xs italic"
                  style={{ color: 'var(--color-sage)' }}
                >
                  {result.aiReason}
                </p>
              ) : result.matchedTerms.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedTerms.slice(0, 3).map((term) => (
                    <span
                      key={term}
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: 'var(--color-grey-400)' }}
                    >
                      {term}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {result.skill.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: 'var(--color-grey-400)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
        ))}
      </div>
    </div>
  )
}
