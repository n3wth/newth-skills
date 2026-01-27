import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CategoryFilter } from './CategoryFilter'

vi.mock('../data/skills', () => ({
  categories: [
    { id: 'all', name: 'All', count: 18 },
    { id: 'development', name: 'Development', count: 5 },
    { id: 'documents', name: 'Documents', count: 4 },
    { id: 'creative', name: 'Creative', count: 4 },
    { id: 'business', name: 'Business', count: 5 },
  ],
}))

describe('CategoryFilter', () => {
  it('renders all category buttons', () => {
    const onCategoryChange = vi.fn()
    render(<CategoryFilter activeCategory="all" onCategoryChange={onCategoryChange} />)

    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('Documents')).toBeInTheDocument()
    expect(screen.getByText('Creative')).toBeInTheDocument()
    expect(screen.getByText('Business')).toBeInTheDocument()
  })

  it('calls onCategoryChange when a category is clicked', () => {
    const onCategoryChange = vi.fn()
    render(<CategoryFilter activeCategory="all" onCategoryChange={onCategoryChange} />)

    fireEvent.click(screen.getByText('Development'))
    expect(onCategoryChange).toHaveBeenCalledWith('development')
  })

  it('applies active class to selected category', () => {
    const onCategoryChange = vi.fn()
    render(<CategoryFilter activeCategory="development" onCategoryChange={onCategoryChange} />)

    const developmentButton = screen.getByText('Development').closest('button')
    expect(developmentButton).toHaveClass('active')

    const allButton = screen.getByText('All').closest('button')
    expect(allButton).not.toHaveClass('active')
  })

  it('renders category shapes for non-all categories', () => {
    const onCategoryChange = vi.fn()
    const { container } = render(<CategoryFilter activeCategory="all" onCategoryChange={onCategoryChange} />)

    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })
})
