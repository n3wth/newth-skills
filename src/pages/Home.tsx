import { useState, useLayoutEffect, useMemo, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skills, categories } from '../data/skills'
import { Nav, Footer, Hero, InstallSection, SkillCard, CategoryFilter, SearchInput, KeyboardShortcutsHelp, SEO, SortDropdown, TaskInput, SkillRecommendations } from '../components'
import type { SortOption } from '../components'
import { useKeyboardShortcuts } from '../hooks'
import { getRecommendations } from '../lib/recommendations'
import { getSkillBadgeStatus } from '../lib/analytics'

const SORT_STORAGE_KEY = 'newth-skills-sort-preference'

function getStoredSortPreference(): SortOption {
  if (typeof window === 'undefined') return 'name-asc'
  const stored = localStorage.getItem(SORT_STORAGE_KEY)
  if (stored && ['name-asc', 'name-desc', 'category', 'recently-updated'].includes(stored)) {
    return stored as SortOption
  }
  return 'name-asc'
}

export function Home() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>(getStoredSortPreference)
  const [taskQuery, setTaskQuery] = useState('')
  const [showRecommendations, setShowRecommendations] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const skillCardRefs = useRef<(HTMLAnchorElement | null)[]>([])

  const filteredSkills = useMemo(() => {
    let result = activeCategory === 'all'
      ? [...skills]
      : skills.filter(s => s.category === activeCategory)

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(skill =>
        skill.name.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query) ||
        skill.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    switch (sortOption) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'category':
        result.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
        break
      case 'recently-updated':
        result.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        break
    }

    return result
  }, [activeCategory, searchQuery, sortOption])

  const handleFocusSearch = useCallback(() => {
    searchInputRef.current?.focus()
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId)
  }, [])

  const handleSortChange = useCallback((newSortOption: SortOption) => {
    setSortOption(newSortOption)
    localStorage.setItem(SORT_STORAGE_KEY, newSortOption)
  }, [])

  const recommendations = useMemo(() => {
    return getRecommendations(taskQuery, 6)
  }, [taskQuery])

  const handleTaskChange = useCallback((value: string) => {
    setTaskQuery(value)
    setShowRecommendations(value.trim().length > 0)
  }, [])

  const handleClearRecommendations = useCallback(() => {
    setTaskQuery('')
    setShowRecommendations(false)
  }, [])

  const { showHelp, setShowHelp, selectedIndex, setSelectedIndex } = useKeyboardShortcuts({
    onFocusSearch: handleFocusSearch,
    onClearSearch: handleClearSearch,
    onCategoryChange: handleCategoryChange,
    filteredSkillsCount: filteredSkills.length,
  })

  useEffect(() => {
    const handleEnterKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !showHelp && selectedIndex >= 0 && selectedIndex < filteredSkills.length) {
        const activeElement = document.activeElement
        const isTyping = activeElement?.tagName.toLowerCase() === 'input' ||
                         activeElement?.tagName.toLowerCase() === 'textarea'
        if (!isTyping) {
          event.preventDefault()
          navigate(`/skill/${filteredSkills[selectedIndex].id}`)
        }
      }
    }
    window.addEventListener('keydown', handleEnterKey)
    return () => window.removeEventListener('keydown', handleEnterKey)
  }, [selectedIndex, filteredSkills, navigate, showHelp])

  useEffect(() => {
    if (selectedIndex >= 0 && skillCardRefs.current[selectedIndex]) {
      skillCardRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [selectedIndex])

  useEffect(() => {
    setSelectedIndex(-1)
  }, [activeCategory, searchQuery, setSelectedIndex])

  useLayoutEffect(() => {
    ScrollTrigger.refresh()
  }, [activeCategory, searchQuery])

  // Compute badge status once for all skills (performance optimization)
  const badgeStatus = useMemo(() => getSkillBadgeStatus(), [])

  return (
    <div className="min-h-screen relative content-loaded">
      <SEO
        title="Skills for AI Coding Assistants - Gemini CLI & Claude Code"
        description="Give your AI superpowers. Install skills that teach Gemini CLI and Claude Code to build animations, generate documents, create art, and more. One command to install."
        canonicalUrl="/"
        keywords={['AI skills', 'Gemini CLI', 'Claude Code', 'AI coding assistant', 'developer tools']}
      />
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      <Nav />
      <Hero />

      <main className="px-6 md:px-12 pb-24">
        <section className="mb-16 md:mb-20">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-medium mb-2 text-white">
              What do you want to build?
            </h2>
            <p className="label">
              Tell us your goal and we'll find the right skill
            </p>
          </div>
          <TaskInput
            value={taskQuery}
            onChange={handleTaskChange}
          />
          <SkillRecommendations
            recommendations={recommendations}
            isVisible={showRecommendations}
            onClose={handleClearRecommendations}
          />
        </section>

        <InstallSection />

        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-medium mb-2 text-white">
            All Skills
          </h2>
          <p className="label">
            {skills.length} ready-to-use skills in {categories.length - 1} categories
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-10">
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
          <div className="flex items-center gap-3">
            <SortDropdown
              value={sortOption}
              onChange={handleSortChange}
            />
            <SearchInput
              ref={searchInputRef}
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill, index) => (
            <SkillCard
              key={skill.id}
              ref={(el) => { skillCardRefs.current[index] = el }}
              skill={skill}
              isSelected={selectedIndex === index}
              isTrending={badgeStatus.trendingSkillIds.has(skill.id)}
              isPopular={badgeStatus.popularSkillIds.has(skill.id)}
            />
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-24">
            <p className="text-lg text-white mb-2">
              {searchQuery.trim()
                ? 'No matching skills found'
                : 'This category is empty'}
            </p>
            <p className="label mb-4">
              {searchQuery.trim()
                ? 'Try different keywords or browse all skills'
                : 'Check back soon for new skills'}
            </p>
            {searchQuery.trim() && (
              <button
                onClick={() => setSearchQuery('')}
                className="glass-pill px-4 py-2 rounded-full text-sm font-medium"
              >
                Show all skills
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />

      <KeyboardShortcutsHelp
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  )
}
