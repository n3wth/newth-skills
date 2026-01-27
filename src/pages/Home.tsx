import { useState, useLayoutEffect, useMemo } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skills, categories } from '../data/skills'
import { Nav, Footer, Hero, InstallSection, SkillCard, CategoryFilter, SearchInput } from '../components'

export function Home() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

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

    return result
  }, [activeCategory, searchQuery])

  useLayoutEffect(() => {
    ScrollTrigger.refresh()
  }, [activeCategory, searchQuery])

  return (
    <div className="min-h-screen relative">
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
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-24">
            <p className="label mb-2">
              {searchQuery.trim()
                ? 'No skills match your search'
                : 'No skills in this category yet'}
            </p>
            {searchQuery.trim() && (
              <button
                onClick={() => setSearchQuery('')}
                className="glass-pill px-4 py-2 rounded-full text-sm font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
