import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { SkillCard } from './SkillCard'
import type { Skill } from '../data/skills'

vi.mock('../lib/analytics', () => ({
  getCopyCount: vi.fn().mockReturnValue(5),
}))

const mockSkill: Skill = {
  id: 'test-skill',
  name: 'Test Skill',
  description: 'A test skill for unit testing purposes.',
  category: 'development',
  tags: ['test', 'unit', 'vitest'],
  icon: '◎',
  color: 'oklch(0.75 0.18 145)',
  version: '1.0.0',
  lastUpdated: '2026-01-01',
}

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('SkillCard', () => {
  it('renders skill name', () => {
    renderWithRouter(<SkillCard skill={mockSkill} />)
    expect(screen.getByText('Test Skill')).toBeInTheDocument()
  })

  it('renders skill description', () => {
    renderWithRouter(<SkillCard skill={mockSkill} />)
    expect(screen.getByText('A test skill for unit testing purposes.')).toBeInTheDocument()
  })

  it('renders skill tags (up to 3)', () => {
    renderWithRouter(<SkillCard skill={mockSkill} />)
    expect(screen.getByText('test')).toBeInTheDocument()
    expect(screen.getByText('unit')).toBeInTheDocument()
    expect(screen.getByText('vitest')).toBeInTheDocument()
  })

  it('limits tags to 3', () => {
    const skillWithManyTags: Skill = {
      ...mockSkill,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    }
    renderWithRouter(<SkillCard skill={skillWithManyTags} />)

    expect(screen.getByText('tag1')).toBeInTheDocument()
    expect(screen.getByText('tag2')).toBeInTheDocument()
    expect(screen.getByText('tag3')).toBeInTheDocument()
    expect(screen.queryByText('tag4')).not.toBeInTheDocument()
    expect(screen.queryByText('tag5')).not.toBeInTheDocument()
  })

  it('links to skill detail page', () => {
    renderWithRouter(<SkillCard skill={mockSkill} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/skill/test-skill')
  })

  it('applies selected styles when isSelected is true', () => {
    renderWithRouter(<SkillCard skill={mockSkill} isSelected={true} />)
    const link = screen.getByRole('link')
    expect(link).toHaveClass('ring-2')
    expect(link).toHaveAttribute('aria-current', 'true')
  })

  it('does not apply selected styles when isSelected is false', () => {
    renderWithRouter(<SkillCard skill={mockSkill} isSelected={false} />)
    const link = screen.getByRole('link')
    expect(link).not.toHaveClass('ring-2')
    expect(link).not.toHaveAttribute('aria-current')
  })

  it('shows popularity count when showPopularity is true and count > 0', () => {
    renderWithRouter(<SkillCard skill={mockSkill} showPopularity={true} />)
    expect(screen.getByText('5 installs')).toBeInTheDocument()
  })

  it('does not show popularity count when showPopularity is false', () => {
    renderWithRouter(<SkillCard skill={mockSkill} showPopularity={false} />)
    expect(screen.queryByText(/installs/)).not.toBeInTheDocument()
  })

  it('shows singular "install" when count is 1', async () => {
    const { getCopyCount } = await import('../lib/analytics')
    vi.mocked(getCopyCount).mockReturnValue(1)

    renderWithRouter(<SkillCard skill={mockSkill} showPopularity={true} />)
    expect(screen.getByText('1 install')).toBeInTheDocument()
  })

  it('renders category shape', () => {
    const { container } = renderWithRouter(<SkillCard skill={mockSkill} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })
})
