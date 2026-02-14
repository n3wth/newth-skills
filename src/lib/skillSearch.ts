import type { Skill } from '../data/skills'

export type SortOption = 'name-asc' | 'name-desc' | 'category' | 'recently-updated'

export interface FilterSortOptions {
  category: string
  query: string
  sort: SortOption
}

/**
 * Pure function: filter and sort skills by category, search query, and sort option.
 * Extracted for testability and reuse.
 */
export function filterAndSortSkills(
  skills: Skill[],
  options: FilterSortOptions
): Skill[] {
  const { category, query, sort } = options

  const searchIndex = skills.map((skill) => ({
    skill,
    searchText: [skill.name, skill.description, ...skill.tags].join(' ').toLowerCase(),
  }))

  let indexed = category === 'all'
    ? [...searchIndex]
    : searchIndex.filter(({ skill }) => skill.category === category)

  if (query.trim()) {
    const q = query.toLowerCase().trim()
    indexed = indexed.filter(({ searchText }) => searchText.includes(q))
  }

  const filtered = indexed.map(({ skill }) => skill)

  switch (sort) {
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'category':
      filtered.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
      break
    case 'recently-updated':
      filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      break
  }

  return filtered
}
