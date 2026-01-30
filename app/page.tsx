'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'
import { skills, categories } from '../src/data/skills'
import { Nav } from '../src/components/Nav'
import { Footer } from '../src/components/Footer'
import { Hero } from '../src/components/Hero'
import { InstallSection } from '../src/components/InstallSection'
import { StatsRow } from '../src/components/StatsRow'
import { SkillCard } from '../src/components/SkillCard'
import { CategoryFilter } from '../src/components/CategoryFilter'
import { SearchInput } from '../src/components/SearchInput'
import { KeyboardShortcutsHelp } from '../src/components/KeyboardShortcutsHelp'
import { SortDropdown } from '../src/components/SortDropdown'
import { TaskInput } from '../src/components/TaskInput'
import { SkillRecommendations } from '../src/components/SkillRecommendations'
import { ComparisonBar } from '../src/components/ComparisonBar'
import { useKeyboardShortcuts, useAIRecommendations, useSkillSearch, useSkillNavigation, useScrollReveal, useCardAnimation, usePageTransition } from '../src/hooks'
import { getSkillBadgeStatus } from '../src/lib/analytics'

export default function Home() {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const pageRef = usePageTransition()
  const gridRef = useCardAnimation({ stagger: 0.08, enableHoverLift: true })
  const recommendationsRef = useScrollReveal({ direction: 'up', distance: 30, stagger: 0.12 })
  const browseHeaderRef = useScrollReveal({ direction: 'up', distance: 20, delay: 0.1 })

  // Search, filter, and sort
  const {
    category,
    query,
    sort,
    results: filteredSkills,
    setCategory,
    setQuery,
    setSort,
    clearSearch,
  } = useSkillSearch(skills)

  // AI recommendations
  const [taskQuery, setTaskQuery] = useState('')
  const [showRecommendations, setShowRecommendations] = useState(false)
  const { results: recommendations, isLoading: isLoadingRecommendations } = useAIRecommendations(taskQuery, 6)

  const handleTaskChange = useCallback((value: string) => {
    setTaskQuery(value)
    setShowRecommendations(value.trim().length > 0)
  }, [])

  const handleClearRecommendations = useCallback(() => {
    setTaskQuery('')
    setShowRecommendations(false)
  }, [])

  // Keyboard navigation
  const { selectedIndex, setCardRef } = useSkillNavigation({
    skills: filteredSkills,
  })

  const { showHelp, setShowHelp } = useKeyboardShortcuts({
    onFocusSearch: () => searchInputRef.current?.focus(),
    onClearSearch: clearSearch,
    onCategoryChange: setCategory,
    filteredSkillsCount: filteredSkills.length,
  })

  // Badge status (memoized)
  const badgeStatus = useMemo(() => getSkillBadgeStatus(), [])

  return (
    <div ref={pageRef} className="min-h-screen relative content-loaded">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      <Nav />
      <Hero />

      <main className="px-6 md:px-12 pb-24">
        {/* AI Recommendations Section */}
        <section ref={recommendationsRef} className="mb-16 md:mb-20">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-medium mb-2 text-white">
              What do you need your AI to do?
            </h2>
            <p className="label">
              Tell us. We'll show you the skills that actually solve it.
            </p>
          </div>
          <TaskInput value={taskQuery} onChange={handleTaskChange} />
          <SkillRecommendations
            recommendations={recommendations}
            isVisible={showRecommendations}
            isLoading={isLoadingRecommendations}
            onClose={handleClearRecommendations}
          />
        </section>

        <InstallSection />

        <StatsRow />

        {/* Browse Section Header */}
        <div ref={browseHeaderRef} className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-medium mb-2 text-white">
              What works right now
            </h2>
            <p className="label">
              {skills.length} tested skills across {categories.length - 1} categories. All community-built.
            </p>
          </div>
          <Link
            href="/request-skill"
            className="glass-pill px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity md:self-start"
          >
            Request a Skill
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-10">
          <CategoryFilter activeCategory={category} onCategoryChange={setCategory} />
          <div className="flex items-center gap-3">
            <SortDropdown value={sort} onChange={setSort} />
            <SearchInput ref={searchInputRef} value={query} onChange={setQuery} />
          </div>
        </div>

        {/* Skills Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill, index) => (
            <div key={skill.id} data-card>
              <SkillCard
                ref={setCardRef(index)}
                skill={skill}
                isSelected={selectedIndex === index}
                isTrending={badgeStatus.trendingSkillIds.has(skill.id)}
                isPopular={badgeStatus.popularSkillIds.has(skill.id)}
              />
            </div>
          ))}
        </div>

        {/* Empty State - Delightful */}
        {filteredSkills.length === 0 && (
          <div className="text-center py-24">
            <div className="empty-state-icon inline-block mb-6">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: 'var(--color-grey-400)' }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
                <path d="M8 8l6 6" />
                <path d="M14 8l-6 6" />
              </svg>
            </div>
            <p className="text-lg text-white mb-2">
              {query.trim() ? 'Nothing fits that description' : 'This category is empty right now'}
            </p>
            <p className="label mb-4">
              {query.trim() ? 'Try something broader, or skip straight to browsing all skills' : 'Check back soon or explore what exists'}
            </p>
            {query.trim() && (
              <button onClick={clearSearch} className="glass-pill btn-press px-4 py-2 rounded-full text-sm font-medium">
                See all skills
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />
      <KeyboardShortcutsHelp isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <ComparisonBar />
    </div>
  )
}
