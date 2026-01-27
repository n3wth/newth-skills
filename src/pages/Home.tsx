import { useState, useRef, useCallback, useMemo } from 'react'
import { skills, categories } from '../data/skills'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { InstallSection } from '../components/InstallSection'
import { SkillCard } from '../components/SkillCard'
import { CategoryFilter } from '../components/CategoryFilter'
import { SearchInput } from '../components/SearchInput'
import { KeyboardShortcutsHelp } from '../components/KeyboardShortcutsHelp'
import { SEO } from '../components/SEO'
import { SortDropdown } from '../components/SortDropdown'
import { TaskInput } from '../components/TaskInput'
import { SkillRecommendations } from '../components/SkillRecommendations'
import { ComparisonBar } from '../components/ComparisonBar'
import { useKeyboardShortcuts, useAIRecommendations, useSkillSearch, useSkillNavigation } from '../hooks'
import { getSkillBadgeStatus } from '../lib/analytics'

const SEO_KEYWORDS = ['AI skills', 'Gemini CLI', 'Claude Code', 'AI coding assistant', 'developer tools']

export function Home() {
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
      <SEO
        title="Skills for AI Coding Assistants - Gemini CLI & Claude Code"
        description="Teach your AI to build animations, generate documents, and create art. Skills for Gemini CLI and Claude Code. One command to install, works offline."
        canonicalUrl="/"
        keywords={SEO_KEYWORDS}
      />
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      <Nav />
      <Hero />

      <main className="px-6 md:px-12 pb-24">
        {/* AI Recommendations Section */}
        <section className="mb-16 md:mb-20">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-medium mb-2 text-white">
              What do you want to build?
            </h2>
            <p className="label">
              Describe your project and see which skills can help
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

        {/* Browse Section Header */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-medium mb-2 text-white">
            Browse Skills
          </h2>
          <p className="label">
            {skills.length} skills across {categories.length - 1} categories
          </p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill, index) => (
            <SkillCard
              key={skill.id}
              ref={setCardRef(index)}
              skill={skill}
              isSelected={selectedIndex === index}
              isTrending={badgeStatus.trendingSkillIds.has(skill.id)}
              isPopular={badgeStatus.popularSkillIds.has(skill.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredSkills.length === 0 && (
          <div className="text-center py-24">
            <p className="text-lg text-white mb-2">
              {query.trim() ? 'No matches' : 'Nothing here yet'}
            </p>
            <p className="label mb-4">
              {query.trim() ? 'Try broader keywords or clear the filter' : 'This category is coming soon'}
            </p>
            {query.trim() && (
              <button onClick={clearSearch} className="glass-pill px-4 py-2 rounded-full text-sm font-medium">
                Show all skills
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
