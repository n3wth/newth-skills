import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HoverPreview } from './HoverPreview'
import type { Skill } from '../data/skills'

vi.mock('../lib/analytics', () => ({
  trackCopyEvent: vi.fn(),
}))

const mockSkill: Skill = {
  id: 'test-skill',
  name: 'Test Skill',
  description: 'A test skill.',
  category: 'development',
  tags: ['test'],
  icon: '◎',
  color: 'oklch(0.75 0.18 145)',
  version: '1.0.0',
  lastUpdated: '2026-01-01',
  features: ['Feature one', 'Feature two'],
}

const mockRect = new DOMRect(100, 100, 200, 40)

describe('HoverPreview', () => {
  it('renders nothing when not visible', () => {
    const { container } = render(
      <HoverPreview skill={mockSkill} isVisible={false} anchorRect={null} onClose={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders skill name when visible', () => {
    render(
      <HoverPreview skill={mockSkill} isVisible={true} anchorRect={mockRect} onClose={vi.fn()} />
    )
    expect(screen.getByText('Test Skill')).toBeInTheDocument()
  })

  it('uses fixed positioning', () => {
    const { container } = render(
      <HoverPreview skill={mockSkill} isVisible={true} anchorRect={mockRect} onClose={vi.fn()} />
    )
    const preview = container.querySelector('.hover-preview')
    expect(preview).toHaveStyle({ position: 'fixed' })
  })

  it('renders copy button', () => {
    render(
      <HoverPreview skill={mockSkill} isVisible={true} anchorRect={mockRect} onClose={vi.fn()} />
    )
    expect(screen.getByText('Copy Install Command')).toBeInTheDocument()
  })

  it('closes on Escape key', () => {
    const onClose = vi.fn()
    render(
      <HoverPreview skill={mockSkill} isVisible={true} anchorRect={mockRect} onClose={onClose} />
    )
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })
})
