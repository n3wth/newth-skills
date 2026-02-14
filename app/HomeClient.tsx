'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'
import { skills, categories } from '../src/data/skills'
import { Nav } from '../src/components/Nav'
import { Footer } from '../src/components/Footer'
import { Hero } from '../src/components/Hero'
import { InstallSection } from '../src/components/InstallSection'
import { TerminalDemo } from '../src/components/TerminalDemo'
import { StatsRow } from '../src/components/StatsRow'
import { SkillCard } from '../src/components/SkillCard'
import { CategoryFilter } from '../src/components/CategoryFilter'
import { SearchInput } from '../src/components/SearchInput'
import { KeyboardShortcutsHelp } from '../src/components/KeyboardShortcutsHelp'
import { SortDropdown } from '../src/components/SortDropdown'
import { TaskInput } from '../src/components/TaskInput'
import { SkillRecommendations } from '../src/components/SkillRecommendations'
import { ComparisonBar } from '../src/components/ComparisonBar'
import { FeaturedSkills } from '../src/components/FeaturedSkills'
import { SkillOfTheDay } from '../src/components/SkillOfTheDay'
import { useKeyboardShortcuts, useAIRecommendations, useSkillSearch, useSkillNavigation } from '../src/hooks'
import { getSkillBadgeStatus } from '../src/lib/analytics'

export default function HomeClient() {
  const searchInputRef = useRef<HTMLInputElement>(null)

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
    <div className="min-h-screen relative content-loaded">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      <Nav />
      <Hero />

      <main id="main-content" className="max-w-6xl mx-auto px-6 md:px-12 pb-24">
        {/* AI Recommendations Section */}
        <section className="mb-16 md:mb-24">
          <div className="text-center mb-6">
            <h2 className="section-title mb-2">
              What do you want your AI to ship today?
            </h2>
            <p className="label">
              Describe your goal and we'll surface the skills that get you there.
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

        <FeaturedSkills />

        <StatsRow />

        <InstallSection />
        <TerminalDemo />

        <SkillOfTheDay />

        {/* Browse Section Header */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="section-title mb-2">
              All skills
            </h2>
            <p className="label">
              {skills.length} skills across {categories.length - 1} categories
            </p>
          </div>
          <Link
            href="/request-skill"
            className="glass-pill px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity md:self-start"
          >
            Request a new skill
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredSkills.map((skill, index) => (
            <div
              key={skill.id}
              className="h-full"
              style={{
                contentVisibility: index > 11 ? 'auto' : 'visible',
                containIntrinsicSize: index > 11 ? '0 200px' : undefined,
              }}
            >
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
          <div className="text-center py-20 md:py-28">
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
            <p className="section-title mb-2">
              {query.trim() ? 'No skills match that yet' : 'No skills in this category yet'}
            </p>
            <p className="label mb-6">
              {query.trim() ? 'Try a broader search, or browse all skills.' : 'Explore the full catalog or check back soon.'}
            </p>
            {query.trim() && (
              <button onClick={clearSearch} className="glass-pill btn-press px-4 py-2 rounded-full text-sm font-medium">
                Browse all skills
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
