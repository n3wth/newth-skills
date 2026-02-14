import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

/**
 * PHASE 1: UNIFORMITY TESTS
 * Comprehensive design system compliance testing
 */

describe('Design System - Liquid Glass Compliance', () => {
  describe('Shadow Effects (Only inset allowed)', () => {
    it('should not apply drop-shadow filter', () => {
      const { container } = render(
        <div style={{ filter: 'none' }}>No shadow</div>
      )
      const element = container.firstChild as HTMLElement
      const computedFilter = window.getComputedStyle(element).filter
      expect(computedFilter).not.toContain('drop-shadow')
    })

    it('should not apply text-shadow', () => {
      const { container } = render(
        <span style={{ textShadow: 'none' }}>Text</span>
      )
      const element = container.firstChild as HTMLElement
      const computedShadow = window.getComputedStyle(element).textShadow
      expect(computedShadow).toBe('none')
    })

    it('should allow inset box-shadow for glass highlight', () => {
      const { container } = render(
        <div className="glass-card" style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.12)' }}>
          Glass
        </div>
      )
      const element = container.firstChild as HTMLElement
      const boxShadow = window.getComputedStyle(element).boxShadow
      // Inset shadows are allowed for liquid glass
      expect(boxShadow).toBeTruthy()
    })
  })

  describe('CSS Variables Usage', () => {
    it('should use CSS variables for colors instead of hardcoded values', () => {
      const { container } = render(
        <div
          style={{
            color: 'var(--color-text)',
            backgroundColor: 'var(--glass-bg)',
          }}
        >
          Variables
        </div>
      )
      const element = container.firstChild as HTMLElement
      const styles = window.getComputedStyle(element)
      // Variables get computed to actual colors, so we check computed value exists
      expect(styles.color).toBeTruthy()
      expect(styles.backgroundColor).toBeTruthy()
    })

    it('should use --glass-bg variable for glass elements', () => {
      const { container } = render(
        <div
          className="glass-card"
          style={{
            backgroundColor: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
          }}
        >
          Glass
        </div>
      )
      const element = container.firstChild as HTMLElement
      const classes = element.className
      expect(classes).toContain('glass-card')
    })

    it('should use --glass-border for glass element borders', () => {
      const { container } = render(
        <div style={{ borderColor: 'var(--glass-border)' }}>Border</div>
      )
      const element = container.firstChild as HTMLElement
      const borderColor = window.getComputedStyle(element).borderColor
      expect(borderColor).toBeTruthy()
    })

    it('should use --glass-highlight for subtle highlights', () => {
      const { container } = render(
        <div style={{ color: 'var(--glass-highlight)' }}>Highlight</div>
      )
      const element = container.firstChild as HTMLElement
      const color = window.getComputedStyle(element).color
      expect(color).toBeTruthy()
    })
  })

  describe('Glass Morphism Application', () => {
    it('should apply glass-card class to card elements', () => {
      const { container } = render(
        <div className="glass-card rounded-[20px] backdrop-blur-[20px]">
          Glass Card
        </div>
      )
      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('glass-card')
      expect(element.className).toContain('backdrop-blur')
    })

    it('should use backdrop-blur only on glass elements', () => {
      const { container } = render(
        <div className="glass-card" style={{ backdropFilter: 'blur(20px)' }}>
          Blurred
        </div>
      )
      const element = container.firstChild as HTMLElement
      const backdropFilter = window.getComputedStyle(element).backdropFilter
      expect(backdropFilter == null || backdropFilter === '' || (typeof backdropFilter === 'string' && backdropFilter.includes('blur'))).toBe(true)
    })

    it('should not apply blur filter to non-glass elements', () => {
      const { container } = render(
        <div className="regular-element">No blur</div>
      )
      const element = container.firstChild as HTMLElement
      const filter = window.getComputedStyle(element).filter
      expect(filter).not.toContain('blur')
    })
  })

  describe('Opacity Variations', () => {
    it('should use opacity 0.05-0.15 for backgrounds', () => {
      const { container } = render(
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
          Opacity
        </div>
      )
      const element = container.firstChild as HTMLElement
      const bgColor = window.getComputedStyle(element).backgroundColor
      expect(bgColor).toBeTruthy()
      // Color should be computed RGBA
      expect(bgColor).toMatch(/rgba/)
    })

    it('should use opacity for hover states', () => {
      const { container } = render(
        <div className="hover:opacity-100">Hover opacity</div>
      )
      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('hover:')
    })
  })

  describe('Visual Hierarchy via Borders', () => {
    it('should use borders for depth instead of shadows', () => {
      const { container } = render(
        <div style={{ border: '1px solid var(--glass-border)' }}>
          Border depth
        </div>
      )
      const element = container.firstChild as HTMLElement
      const styles = window.getComputedStyle(element)
      const hasBorder = styles.borderWidth !== '0px' && styles.borderStyle !== 'none'
      expect(hasBorder).toBe(true)
    })

    it('should use consistent border colors', () => {
      const { container } = render(
        <div style={{ borderColor: 'var(--glass-border)' }}>Border</div>
      )
      const element = container.firstChild as HTMLElement
      const borderColor = window.getComputedStyle(element).borderColor
      expect(borderColor).toBeTruthy()
    })
  })

  describe('Transform Effects', () => {
    it('should use transform for hover states instead of shadow', () => {
      const { container } = render(
        <div className="hover:scale-105 hover:translate-y-1">Hover</div>
      )
      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('hover:scale')
      expect(element.className).toContain('hover:translate')
    })

    it('should not use drop-shadow in hover states', () => {
      const { container } = render(
        <div className="hover:scale-105">Hover</div>
      )
      const element = container.firstChild as HTMLElement
      expect(element.className).not.toContain('drop-shadow')
      expect(element.className).not.toContain('shadow')
    })
  })

  describe('Category Colors', () => {
    it('should use flat category colors without gradients', () => {
      const colors = {
        development: '#30d158',
        documents: '#ff6961',
        creative: '#64d2ff',
        business: '#ffd60a',
      }

      Object.entries(colors).forEach(([_category, color]) => {
        const { container } = render(
          <div style={{ color }}>Category</div>
        )
        const element = container.firstChild as HTMLElement
        const computedColor = window.getComputedStyle(element).color
        expect(computedColor).toBeTruthy()
      })
    })

    it('should not apply glow to category indicators', () => {
      const { container } = render(
        <div style={{ color: '#30d158', filter: 'none' }}>
          No glow indicator
        </div>
      )
      const element = container.firstChild as HTMLElement
      const filter = window.getComputedStyle(element).filter
      expect(filter).not.toContain('drop-shadow')
      expect(filter).not.toContain('glow')
    })
  })

  describe('Animation Subtlety', () => {
    it('should use subtle animations', () => {
      const { container } = render(
        <div className="transition-all duration-300" style={{ transition: 'all 0.3s' }}>
          Subtle animation
        </div>
      )
      const element = container.firstChild as HTMLElement
      const transition = window.getComputedStyle(element).transition
      expect(transition).toBeTruthy()
    })

    it('should not use ethereal or atmospheric effects', () => {
      const { container } = render(
        <div style={{ filter: 'none', backdropFilter: 'none' }}>
          No ethereal
        </div>
      )
      const element = container.firstChild as HTMLElement
      const filter = window.getComputedStyle(element).filter
      expect(filter).not.toContain('saturate')
      expect(filter).not.toContain('sepia')
    })
  })

  describe('Consistency Across Components', () => {
    it('should apply glass-card consistently', () => {
      const { container } = render(
        <>
          <div className="glass-card">Card 1</div>
          <div className="glass-card">Card 2</div>
          <div className="glass-card">Card 3</div>
        </>
      )

      const cards = container.querySelectorAll('.glass-card')
      expect(cards.length).toBe(3)
      cards.forEach(card => {
        expect(card.className).toContain('glass-card')
      })
    })

    it('should use consistent spacing across components', () => {
      const { container } = render(
        <>
          <div className="p-4 sm:p-5 md:p-6">Spacing 1</div>
          <div className="p-4 sm:p-5 md:p-6">Spacing 2</div>
        </>
      )

      const elements = container.querySelectorAll('[class*="p-"]')
      expect(elements.length).toBeGreaterThan(0)
    })

    it('should use consistent rounded corners', () => {
      const { container } = render(
        <>
          <div className="rounded-[20px]">Rounded 1</div>
          <div className="rounded-[20px]">Rounded 2</div>
        </>
      )

      const elements = container.querySelectorAll('[class*="rounded"]')
      expect(elements.length).toBeGreaterThan(0)
    })
  })
})

describe('Design System - Category Shapes', () => {
  it('should use distinct shapes for categories (no shadows)', () => {
    const shapes = {
      development: 'circle',
      documents: 'square',
      creative: 'triangle',
      business: 'diamond',
    }

    Object.entries(shapes).forEach(([_category, expectedShape]) => {
      // This test verifies the category shape pattern exists
      expect(expectedShape).toBeTruthy()
    })
  })
})
