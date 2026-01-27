import { categories } from '../data/skills'
import { CategoryShape } from './CategoryShape'

interface CategoryFilterProps {
  activeCategory: string
  onCategoryChange: (id: string) => void
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`glass-pill px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-2 ${
            activeCategory === cat.id ? 'active' : ''
          }`}
        >
          {cat.id !== 'all' && <CategoryShape category={cat.id} size={10} />}
          {cat.name}
        </button>
      ))}
    </div>
  )
}
