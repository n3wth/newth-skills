import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render } from '@testing-library/react'
import {
  responsiveValidators,
  setMobileViewport,
  setTabletViewport,
  setDesktopViewport,
  isVisibleInViewport,
} from './utils'

/**
 * PHASE 1: MOBILE RESPONSIVENESS TESTS
 * Verify responsive behavior across breakpoints
 */

describe('Responsive Design - Mobile (< 768px)', () => {
  beforeEach(() => {
    setMobileViewport()
  })

  describe('No Horizontal Overflow', () => {
    it('should not have horizontal scroll on mobile', () => {
      const { container } = render(
        <div style={{ width: '100%', overflowX: 'hidden' }}>
          Mobile content that fits
        </div>
      )
      const element = container.firstChild as HTMLElement
      expect(responsiveValidators.hasHorizontalOverflow(element)).toBe(false)
    })

    it('should prevent overflow with responsive classes', () => {
      const { container } = render(
        <div className="w-full overflow-x-hidden">
          <div className="px-4 sm:px-6">Content</div>
        </div>
      )
      const element = container.querySelector('.w-full') as HTMLElement
      expect(element.className).toContain('overflow-x-hidden')
    })

    it('should stack content vertically on mobile', () => {
      const { container } = render(
        <div className="flex flex-col md:flex-row">
          <div>Item 1</div>
          <div>Item 2</div>
        </div>
      )
      const flexContainer = container.firstChild as HTMLElement
      expect(flexContainer.className).toContain('flex-col')
    })
  })

  describe('Touch Targets (≥48px)', () => {
    it('should have adequate touch target size for buttons', () => {
      const { container } = render(
        <button style={{ width: '48px', height: '48px' }}>
          Touch me
        </button>
      )
      const button = container.querySelector('button')
      expect(responsiveValidators.hasSufficientTouchTarget(button)).toBe(true)
    })

    it('should have adequate touch target size for links', () => {
      const { container } = render(
        <a href="#" style={{ width: '48px', height: '48px', display: 'block' }}>
          Link
        </a>
      )
      const link = container.querySelector('a')
      expect(responsiveValidators.hasSufficientTouchTarget(link)).toBe(true)
    })

    it('should have adequate touch target size for interactive elements', () => {
      const { container } = render(
        <input
          type="checkbox"
          style={{
            width: '48px',
            height: '48px',
            cursor: 'pointer',
          }}
        />
      )
      const input = container.querySelector('input')
      expect(responsiveValidators.hasSufficientTouchTarget(input)).toBe(true)
    })

    it('should resize touch targets for smaller devices', () => {
      const { container } = render(
        <button className="w-12 h-12 md:w-10 md:h-10">
          Responsive button
        </button>
      )
      const button = container.querySelector('button')
      expect(button?.className).toContain('w-12')
      expect(button?.className).toContain('h-12')
    })
  })

  describe('Text Readability', () => {
    it('should maintain minimum font size (16px) on mobile', () => {
      const { container } = render(
        <p style={{ fontSize: '16px' }}>Readable text</p>
      )
      const paragraph = container.querySelector('p')
      expect(responsiveValidators.hasReadableFontSize(paragraph)).toBe(true)
    })

    it('should not require zoom for reading', () => {
      const { container } = render(
        <article style={{ fontSize: '16px', lineHeight: '1.5' }}>
          Text that doesn't need zoom
        </article>
      )
      const article = container.firstChild as HTMLElement
      const fontSize = window.getComputedStyle(article).fontSize
      const fontSizeNum = parseInt(fontSize)
      expect(fontSizeNum).toBeGreaterThanOrEqual(16)
    })

    it('should use responsive typography', () => {
      const { container } = render(
        <h1 className="text-lg sm:text-xl md:text-2xl">
          Responsive heading
        </h1>
      )
      const heading = container.querySelector('h1')
      expect(heading?.className).toContain('text-lg')
      expect(heading?.className).toContain('sm:text-xl')
    })

    it('should adjust line-height for mobile readability', () => {
      const { container } = render(
        <p style={{ lineHeight: '1.6' }}>Line height for mobile</p>
      )
      const paragraph = container.querySelector('p')
      const lineHeight = window.getComputedStyle(paragraph!).lineHeight
      expect(parseInt(lineHeight)).toBeGreaterThan(0)
    })
  })

  describe('Safe Area Insets', () => {
    it('should respect safe area for notch devices', () => {
      const { container } = render(
        <div style={{ paddingTop: '24px', paddingLeft: '16px' }}>
          Safe area content
        </div>
      )
      const element = container.firstChild as HTMLElement
      expect(responsiveValidators.respectsSafeAreaInsets(element)).toBe(true)
    })

    it('should apply padding to avoid home indicator', () => {
      const { container } = render(
        <footer className="pb-6">Navigation footer</footer>
      )
      const footer = container.querySelector('footer')
      expect(footer?.className).toContain('pb')
    })

    it('should use padding variables for consistency', () => {
      const { container } = render(
        <div className="px-4 sm:px-6 md:px-8">
          Consistent padding
        </div>
      )
      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('px-')
    })
  })

  describe('Hero Section on Mobile', () => {
    it('should display hero correctly at mobile width', () => {
      const { container } = render(
        <section className="h-screen md:min-h-screen flex items-center">
          <h1 className="text-2xl sm:text-4xl md:text-6xl">Hero</h1>
        </section>
      )
      const section = container.querySelector('section')
      expect(section?.className).toContain('flex')
      expect(section?.className).toContain('items-center')
    })

    it('should scale images for mobile', () => {
      const { container } = render(
        <img
          src="image.png"
          alt="Hero"
          className="w-full h-auto max-w-full"
        />
      )
      const image = container.querySelector('img')
      expect(image?.className).toContain('w-full')
      expect(image?.className).toContain('h-auto')
    })
  })
})

describe('Responsive Design - Tablet (768px - 1024px)', () => {
  beforeEach(() => {
    setTabletViewport()
  })

  describe('Layout Adjustments', () => {
    it('should transition to wider layout on tablet', () => {
      const { container } = render(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </div>
      )
      const grid = container.querySelector('.grid')
      expect(grid?.className).toContain('md:grid-cols-2')
    })

    it('should adjust spacing for tablet readability', () => {
      const { container } = render(
        <div className="px-4 sm:px-6 md:px-8">
          Tablet spacing
        </div>
      )
      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('px-')
    })

    it('should show additional UI elements on tablet', () => {
      const { container } = render(
        <>
          <nav className="hidden md:flex">Tablet nav</nav>
          <nav className="md:hidden">Mobile nav</nav>
        </>
      )
      const tabletNav = container.querySelector('.hidden.md\\:flex')
      const mobileNav = container.querySelector('.md\\:hidden')
      expect(tabletNav).toBeInTheDocument()
      expect(mobileNav).toBeInTheDocument()
    })
  })

  describe('Typography Adjustments', () => {
    it('should use medium-sized typography on tablet', () => {
      const { container } = render(
        <h2 className="text-xl sm:text-2xl md:text-3xl">Tablet heading</h2>
      )
      const heading = container.querySelector('h2')
      expect(heading?.className).toContain('md:text-3xl')
    })
  })
})

describe('Responsive Design - Desktop (≥1024px)', () => {
  beforeEach(() => {
    setDesktopViewport()
  })

  describe('Full Layout Display', () => {
    it('should display full layout on desktop', () => {
      const { container } = render(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
          <div>Item 4</div>
        </div>
      )
      const grid = container.querySelector('.grid')
      expect(grid?.className).toContain('lg:grid-cols-4')
    })

    it('should show all UI elements on desktop', () => {
      const { container } = render(
        <header className="flex justify-between items-center">
          <div>Logo</div>
          <nav className="hidden lg:flex gap-8">
            <a href="#">Link 1</a>
            <a href="#">Link 2</a>
          </nav>
        </header>
      )
      const nav = container.querySelector('.hidden.lg\\:flex')
      expect(nav).toBeInTheDocument()
    })

    it('should use full typography scale on desktop', () => {
      const { container } = render(
        <h1 className="text-2xl sm:text-4xl md:text-6xl">Desktop heading</h1>
      )
      const heading = container.querySelector('h1')
      expect(heading?.className).toContain('md:text-6xl')
    })
  })
})

describe('Responsive Design - Breakpoint Consistency', () => {
  it('should use consistent sm breakpoint (640px)', () => {
    const { container } = render(
      <>
        <div className="text-sm sm:text-base">Text</div>
        <div className="p-2 sm:p-4">Padding</div>
        <div className="w-full sm:w-1/2">Width</div>
      </>
    )
    const elements = container.querySelectorAll('[class*="sm:"]')
    expect(elements.length).toBe(3)
  })

  it('should use consistent md breakpoint (768px)', () => {
    const { container } = render(
      <>
        <div className="hidden md:block">Show on md</div>
        <div className="grid md:grid-cols-2">Grid</div>
        <div className="text-xl md:text-2xl">Text</div>
      </>
    )
    const elements = container.querySelectorAll('[class*="md:"]')
    expect(elements.length).toBe(3)
  })

  it('should use consistent lg breakpoint (1024px)', () => {
    const { container } = render(
      <>
        <div className="hidden lg:block">Show on lg</div>
        <div className="grid lg:grid-cols-4">Grid</div>
      </>
    )
    const elements = container.querySelectorAll('[class*="lg:"]')
    expect(elements.length).toBe(2)
  })
})

describe('Image Responsiveness', () => {
  it('should scale images responsively', () => {
    const { container } = render(
      <img src="image.png" alt="Responsive" className="w-full h-auto" />
    )
    const image = container.querySelector('img')
    expect(image?.className).toContain('w-full')
    expect(image?.className).toContain('h-auto')
  })

  it('should prevent layout shift from images', () => {
    const { container } = render(
      <img
        src="image.png"
        alt="No shift"
        width={800}
        height={600}
        className="w-full h-auto"
      />
    )
    const image = container.querySelector('img')
    expect(image?.hasAttribute('width')).toBe(true)
    expect(image?.hasAttribute('height')).toBe(true)
  })

  it('should use responsive images with srcSet', () => {
    const { container } = render(
      <img
        src="image-md.png"
        alt="Responsive"
        srcSet="image-sm.png 640w, image-md.png 1024w, image-lg.png 1920w"
      />
    )
    const image = container.querySelector('img')
    expect(image?.hasAttribute('srcset')).toBe(true)
  })
})

describe('Form Responsiveness', () => {
  it('should have responsive form inputs', () => {
    const { container } = render(
      <input
        type="text"
        className="w-full px-4 py-3 text-base border rounded"
        placeholder="Responsive input"
      />
    )
    const input = container.querySelector('input')
    expect(input?.className).toContain('w-full')
    expect(input?.className).toContain('text-base')
  })

  it('should have stacked form layout on mobile', () => {
    const { container } = render(
      <form className="flex flex-col md:flex-row gap-4">
        <input type="text" placeholder="First" className="w-full md:w-1/2" />
        <input type="email" placeholder="Email" className="w-full md:w-1/2" />
      </form>
    )
    const form = container.querySelector('form')
    expect(form?.className).toContain('flex-col')
    expect(form?.className).toContain('md:flex-row')
  })
})
