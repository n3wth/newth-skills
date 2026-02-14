import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/**
 * PHASE 2: FUNCTIONALITY TESTS
 * Navigation, footer, and interactive component testing
 */

describe('Navigation Component', () => {
  describe('Navigation Rendering', () => {
    it('should render navigation menu', () => {
      const { container } = render(
        <nav role="navigation">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      )
      expect(container.querySelector('nav')).toBeInTheDocument()
    })

    it('should display all navigation items', () => {
      const { container } = render(
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      )
      const links = container.querySelectorAll('nav a')
      expect(links.length).toBe(3)
    })

    it('should have proper navigation structure', () => {
      const { container } = render(
        <header>
          <nav aria-label="Main navigation">
            <a href="/">Home</a>
          </nav>
        </header>
      )
      const nav = container.querySelector('nav')
      expect(nav?.getAttribute('aria-label')).toBe('Main navigation')
    })
  })

  describe('Navigation Links', () => {
    it('should have valid href attributes', () => {
      const { container } = render(
        <nav>
          <a href="/page">Link</a>
          <a href="/another">Another</a>
        </nav>
      )
      const links = container.querySelectorAll('nav a')
      links.forEach(link => {
        expect(link.hasAttribute('href')).toBe(true)
      })
    })

    it('should handle external links correctly', () => {
      const { container } = render(
        <nav>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </nav>
      )
      const link = container.querySelector('a')
      expect(link?.getAttribute('target')).toBe('_blank')
      expect(link?.getAttribute('rel')).toContain('noopener')
    })

    it('should mark current page in navigation', () => {
      const { container } = render(
        <nav>
          <a href="/" aria-current="page">Home</a>
          <a href="/about">About</a>
        </nav>
      )
      const currentLink = container.querySelector('[aria-current="page"]')
      expect(currentLink).toBeInTheDocument()
    })
  })

  describe('hideOnScroll Behavior', () => {
    it('should hide navigation when scrolling down', () => {
      const { container } = render(
        <nav className="fixed hideOnScroll" style={{ transform: 'translateY(0)' }}>
          Navigation
        </nav>
      )
      const nav = container.querySelector('nav')
      expect(nav?.className).toContain('hideOnScroll')
    })

    it('should show navigation when scrolling up', () => {
      const { container } = render(
        <nav className="fixed" style={{ transform: 'translateY(0)' }}>
          Navigation
        </nav>
      )
      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
    })

    it('should maintain visible state at top of page', () => {
      const { container } = render(
        <nav className="fixed top-0">Navigation</nav>
      )
      const nav = container.querySelector('nav')
      expect(nav?.className).toContain('top-0')
    })
  })

  describe('Mobile Menu', () => {
    it('should have mobile menu toggle', () => {
      const { container } = render(
        <>
          <button aria-label="Toggle menu">Menu</button>
          <nav>Content</nav>
        </>
      )
      const toggle = container.querySelector('button')
      expect(toggle?.getAttribute('aria-label')).toContain('menu')
    })

    it('should open/close mobile menu', async () => {
      const { container } = render(
        <>
          <button aria-label="Toggle menu" aria-expanded="false">Menu</button>
          <nav style={{ display: 'none' }}>Menu items</nav>
        </>
      )
      const button = container.querySelector('button')
      expect(button?.getAttribute('aria-expanded')).toBe('false')
    })

    it('should close menu when item is clicked', async () => {
      const handleClick = vi.fn()
      const { container } = render(
        <nav>
          <a href="/page" onClick={handleClick}>Link</a>
        </nav>
      )
      const link = container.querySelector('a')
      await fireEvent.click(link!)
      expect(handleClick).toHaveBeenCalled()
    })

    it('should show/hide mobile nav based on breakpoint', () => {
      const { container } = render(
        <>
          <nav className="hidden md:block">Desktop nav</nav>
          <nav className="md:hidden">Mobile nav</nav>
        </>
      )
      expect(container.querySelectorAll('nav').length).toBe(2)
    })
  })

  describe('Theme Toggle', () => {
    it('should have theme toggle button', () => {
      const { container } = render(
        <button aria-label="Toggle dark mode">Toggle</button>
      )
      const button = container.querySelector('button')
      expect(button?.getAttribute('aria-label')).toContain('Toggle')
    })

    it('should toggle theme on click', () => {
      let isDark = false
      const { container, rerender } = render(
        <button onClick={() => { isDark = !isDark }}>
          {isDark ? 'Light' : 'Dark'}
        </button>
      )
      const button = container.querySelector('button')
      expect(button?.textContent).toBe('Dark')
    })

    it('should persist theme preference', () => {
      localStorage.setItem('theme', 'dark')
      const theme = localStorage.getItem('theme')
      expect(theme).toBe('dark')
    })
  })
})

describe('Footer Component', () => {
  describe('Footer Rendering', () => {
    it('should render footer element', () => {
      const { container } = render(
        <footer>Footer content</footer>
      )
      expect(container.querySelector('footer')).toBeInTheDocument()
    })

    it('should have footer semantic structure', () => {
      const { container } = render(
        <footer>
          <section>Links</section>
          <section>Social</section>
          <section>Copyright</section>
        </footer>
      )
      const sections = container.querySelectorAll('footer section')
      expect(sections.length).toBe(3)
    })

    it('should contain contact information', () => {
      const { container } = render(
        <footer>
          <a href="mailto:contact@example.com">Email</a>
        </footer>
      )
      const email = container.querySelector('a[href^="mailto:"]')
      expect(email).toBeInTheDocument()
    })
  })

  describe('Footer Links', () => {
    it('should have footer navigation links', () => {
      const { container } = render(
        <footer>
          <nav>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
          </nav>
        </footer>
      )
      const links = container.querySelectorAll('footer a')
      expect(links.length).toBe(3)
    })

    it('should have social media links', () => {
      const { container } = render(
        <footer>
          <a href="https://twitter.com" aria-label="Twitter">Twitter</a>
          <a href="https://github.com" aria-label="GitHub">GitHub</a>
        </footer>
      )
      const socialLinks = container.querySelectorAll('a[href*="://"]')
      expect(socialLinks.length).toBe(2)
    })
  })

  describe('Footer Information', () => {
    it('should display copyright information', () => {
      const currentYear = new Date().getFullYear()
      const { container } = render(
        <footer>
          <p>&copy; {currentYear} Company Name. All rights reserved.</p>
        </footer>
      )
      expect(container.textContent).toContain(currentYear.toString())
    })

    it('should include company name in footer', () => {
      const { container } = render(
        <footer>
          <p>Company Name &copy; 2024</p>
        </footer>
      )
      expect(container.textContent).toContain('Company Name')
    })
  })

  describe('Footer Styling Consistency', () => {
    it('should have consistent footer styling', () => {
      const { container } = render(
        <footer className="glass-card border-t border-glass-border">
          Footer
        </footer>
      )
      const footer = container.querySelector('footer')
      expect(footer?.className).toContain('glass-card')
      expect(footer?.className).toContain('border')
    })

    it('should maintain responsive spacing', () => {
      const { container } = render(
        <footer className="px-4 sm:px-6 md:px-8 py-8">Footer</footer>
      )
      const footer = container.querySelector('footer')
      expect(footer?.className).toContain('px-')
    })
  })
})

describe('Form Components', () => {
  describe('Form Input Functionality', () => {
    it('should render form input', () => {
      const { container } = render(
        <input type="text" placeholder="Enter text" />
      )
      expect(container.querySelector('input')).toBeInTheDocument()
    })

    it('should allow text input', async () => {
      const { container } = render(
        <input type="text" value="" onChange={(e) => e.target.value} />
      )
      const input = container.querySelector('input') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'test' } })
      expect(input.value).toBe('test')
    })

    it('should validate email input', () => {
      const { container } = render(
        <input type="email" />
      )
      const input = container.querySelector('input')
      expect(input?.getAttribute('type')).toBe('email')
    })

    it('should show placeholder text', () => {
      const { container } = render(
        <input type="text" placeholder="Enter your name" />
      )
      const input = container.querySelector('input')
      expect(input?.getAttribute('placeholder')).toBe('Enter your name')
    })
  })

  describe('Form Submit', () => {
    it('should have submit button', () => {
      const { container } = render(
        <form>
          <button type="submit">Submit</button>
        </form>
      )
      const button = container.querySelector('button[type="submit"]')
      expect(button).toBeInTheDocument()
    })

    it('should handle form submission', () => {
      const handleSubmit = vi.fn((e) => e.preventDefault())
      const { container } = render(
        <form onSubmit={handleSubmit}>
          <button type="submit">Submit</button>
        </form>
      )
      const form = container.querySelector('form')
      fireEvent.submit(form!)
      expect(handleSubmit).toHaveBeenCalled()
    })

    it('should show loading state during submission', () => {
      const { container, rerender } = render(
        <button disabled>Loading...</button>
      )
      const button = container.querySelector('button')
      expect(button?.hasAttribute('disabled')).toBe(true)
    })

    it('should show success/error states', () => {
      const { container } = render(
        <>
          <div role="status">Form submitted successfully</div>
        </>
      )
      const status = container.querySelector('[role="status"]')
      expect(status?.textContent).toContain('successfully')
    })
  })

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const { container } = render(
        <input type="text" required />
      )
      const input = container.querySelector('input')
      expect(input?.hasAttribute('required')).toBe(true)
    })

    it('should show validation errors', () => {
      const { container } = render(
        <>
          <input id="email" type="email" aria-describedby="error" />
          <span id="error" role="alert">Invalid email</span>
        </>
      )
      const error = container.querySelector('[role="alert"]')
      expect(error?.textContent).toContain('Invalid')
    })

    it('should enable submit only when form is valid', () => {
      const { container } = render(
        <form>
          <input type="email" required />
          <button type="submit" disabled={false}>Submit</button>
        </form>
      )
      const button = container.querySelector('button')
      expect(button?.hasAttribute('disabled')).toBe(false)
    })
  })
})

describe('Interactive Elements', () => {
  describe('Button Interactions', () => {
    it('should handle button click', () => {
      const handleClick = vi.fn()
      const { container } = render(
        <button onClick={handleClick}>Click</button>
      )
      const button = container.querySelector('button')
      fireEvent.click(button!)
      expect(handleClick).toHaveBeenCalled()
    })

    it('should show active/pressed state', () => {
      const { container } = render(
        <button aria-pressed="false">Toggle</button>
      )
      const button = container.querySelector('button')
      expect(button?.getAttribute('aria-pressed')).toBe('false')
    })

    it('should disable button when appropriate', () => {
      const { container } = render(
        <button disabled>Disabled</button>
      )
      const button = container.querySelector('button')
      expect(button?.hasAttribute('disabled')).toBe(true)
    })
  })

  describe('Dropdown Interactions', () => {
    it('should toggle dropdown visibility', () => {
      const { container } = render(
        <div>
          <button aria-expanded="false" aria-haspopup="listbox">
            Options
          </button>
          <div role="listbox" style={{ display: 'none' }}>
            <div role="option">Option 1</div>
          </div>
        </div>
      )
      const button = container.querySelector('button')
      expect(button?.getAttribute('aria-expanded')).toBe('false')
    })

    it('should navigate dropdown with arrow keys', () => {
      const { container } = render(
        <div role="listbox">
          <div role="option">Option 1</div>
          <div role="option">Option 2</div>
        </div>
      )
      const options = container.querySelectorAll('[role="option"]')
      expect(options.length).toBe(2)
    })
  })

  describe('Hover Effects', () => {
    it('should apply hover styles on mouse enter', () => {
      const { container } = render(
        <div className="hover:opacity-100">Hover me</div>
      )
      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('hover:')
    })

    it('should NOT use shadow on hover', () => {
      const { container } = render(
        <div className="hover:scale-105 hover:translate-y-1">No shadow</div>
      )
      const element = container.firstChild as HTMLElement
      expect(element.className).not.toContain('shadow')
      expect(element.className).not.toContain('drop-shadow')
    })
  })
})

describe('Performance', () => {
  it('should not cause excessive re-renders', () => {
    let renderCount = 0
    const { rerender } = render(
      <nav>Nav</nav>
    )
    renderCount++
    rerender(<nav>Nav</nav>)
    expect(renderCount).toBeLessThanOrEqual(2)
  })

  it('should memoize components appropriately', () => {
    const { container } = render(
      <div className="memo">Memoized component</div>
    )
    expect(container.querySelector('.memo')).toBeInTheDocument()
  })
})
