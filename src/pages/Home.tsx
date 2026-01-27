import { useState, useLayoutEffect, useMemo } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skills, categories } from '../data/skills'
import { Nav, Footer, Hero, InstallSection, SkillCard, CategoryFilter, SearchInput, SEO } from '../components'
import { useFavorites } from '../hooks'

export function Home() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  const filteredSkills = useMemo(() => {
    let result = activeCategory === 'all'
      ? skills
      : skills.filter(s => s.category === activeCategory)

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(skill =>
        skill.name.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query) ||
        skill.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    if (showFavoritesOnly) {
      result = result.filter(skill => favorites.includes(skill.id))
    }

    return result
  }, [activeCategory, searchQuery, showFavoritesOnly, favorites])

  useLayoutEffect(() => {
    ScrollTrigger.refresh()
  }, [activeCategory, searchQuery])

  return (
    <div className="min-h-screen relative content-loaded">
      <SEO
        title="newth.ai skills - Extend Your AI Coding Assistant"
        description="Browse and install skills for Gemini CLI, Claude Code, and more. Extend your AI coding assistant with specialized capabilities in development, documents, creative, and business domains."
        canonicalUrl="/"
        keywords={['AI skills', 'Gemini CLI', 'Claude Code', 'AI coding assistant', 'developer tools']}
      />
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      <Nav />
      <Hero />

      <main className="px-6 md:px-12 pb-24">
        <InstallSection />

        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-medium mb-2 text-white">
            Browse Skills
          </h2>
          <p className="label">
            {skills.length} skills across {categories.length - 1} categories
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-10">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`glass-pill px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-2 ${
                showFavoritesOnly ? 'active' : ''
              }`}
              aria-label={showFavoritesOnly ? 'Show all skills' : 'Show favorites only'}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={showFavoritesOnly ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: showFavoritesOnly ? 'var(--color-coral)' : 'currentColor' }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Favorites{favorites.length > 0 && ` (${favorites.length})`}
            </button>
          </div>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              isFavorite={isFavorite(skill.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-24">
            <p className="label mb-2">
              {showFavoritesOnly
                ? 'No favorites yet'
                : searchQuery.trim()
                  ? 'No skills match your search'
                  : 'No skills in this category yet'}
            </p>
            {(searchQuery.trim() || showFavoritesOnly) && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setShowFavoritesOnly(false)
                }}
                className="glass-pill px-4 py-2 rounded-full text-sm font-medium"
              >
                {showFavoritesOnly ? 'Show all skills' : 'Clear search'}
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
