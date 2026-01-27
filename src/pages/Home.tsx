import { useState, useLayoutEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skills, categories } from '../data/skills'
import { Nav, Footer, Hero, InstallSection, SkillCard, CategoryFilter } from '../components'

export function Home() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredSkills = activeCategory === 'all'
    ? skills
    : skills.filter(s => s.category === activeCategory)

  useLayoutEffect(() => {
    ScrollTrigger.refresh()
  }, [activeCategory])

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

        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-24 label">
            No skills in this category yet.
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
