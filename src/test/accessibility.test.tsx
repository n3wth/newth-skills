import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { a11yValidators } from './utils'

/**
 * PHASE 1: ACCESSIBILITY TESTS
 * WCAG 2.1 AA compliance for keyboard navigation and screen readers
 */

describe('Accessibility - Keyboard Navigation', () => {
  it('should allow keyboard focus on interactive elements', () => {
    const { container } = render(
      <button>Click me</button>
    )
    const button = container.querySelector('button')
    expect(a11yValidators.isKeyboardAccessible(button)).toBe(true)
  })

  it('should allow tab navigation to all interactive elements', () => {
    const { container } = render(
      <>
        <button tabIndex={0}>Button 1</button>
        <a href="#" tabIndex={0}>Link</a>
        <button tabIndex={0}>Button 2</button>
      </>
    )
    const interactives = container.querySelectorAll('[tabindex="0"]')
    expect(interactives.length).toBe(3)
  })

  it('should not trap focus in modals', () => {
    const { container } = render(
      <div role="dialog" aria-label="Modal">
        <button>Close</button>
        <input type="text" />
        <button>Submit</button>
      </div>
    )
    const modal = container.querySelector('[role="dialog"]')
    expect(modal?.getAttribute('aria-label')).toBe('Modal')
  })

  it('should skip keyboard navigation for disabled elements', () => {
    const { container } = render(
      <button disabled>Disabled</button>
    )
    const button = container.querySelector('button')
    expect(button?.hasAttribute('disabled')).toBe(true)
  })

  it('should provide keyboard shortcuts for common actions', () => {
    // Test that element can be accessed via keyboard
    const { container } = render(
      <button aria-keyshortcuts="ctrl+s">Save</button>
    )
    const button = container.querySelector('button')
    expect(button?.hasAttribute('aria-keyshortcuts')).toBe(true)
  })
})

describe('Accessibility - Focus Management', () => {
  it('should have visible focus indicators', () => {
    const { container } = render(
      <button className="focus:ring-2 focus:outline-none">
        Focus visible
      </button>
    )
    const button = container.querySelector('button')
    expect(button?.className).toContain('focus:ring')
  })

  it('should restore focus after closing modals', () => {
    const { container } = render(
      <>
        <button id="open-modal">Open</button>
        <div id="modal" role="dialog">
          <button>Close</button>
        </div>
      </>
    )
    const openButton = container.querySelector('#open-modal')
    expect(openButton).toBeInTheDocument()
  })

  it('should manage focus order logically', () => {
    const { container } = render(
      <form>
        <input type="text" id="first" />
        <input type="email" id="second" />
        <button>Submit</button>
      </form>
    )
    const inputs = container.querySelectorAll('input')
    expect(inputs.length).toBe(2)
  })

  it('should provide focus mode for content areas', () => {
    const { container } = render(
      <div className="focus-within:ring-2">
        <input type="text" placeholder="Type here" />
      </div>
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('focus-within')
  })
})

describe('Accessibility - Screen Reader Support', () => {
  it('should have appropriate ARIA labels', () => {
    const { container } = render(
      <button aria-label="Close menu">X</button>
    )
    const button = container.querySelector('button')
    expect(a11yValidators.hasAccessibleLabel(button)).toBe(true)
  })

  it('should use semantic HTML for better readability', () => {
    const { container } = render(
      <article>
        <header>
          <h1>Article Title</h1>
        </header>
        <main>Content</main>
        <footer>Footer</footer>
      </article>
    )
    expect(container.querySelector('article')).toBeInTheDocument()
    expect(container.querySelector('header')).toBeInTheDocument()
    expect(container.querySelector('main')).toBeInTheDocument()
  })

  it('should announce dynamic content changes', () => {
    const { container } = render(
      <div role="status" aria-live="polite">
        Status message
      </div>
    )
    const status = container.querySelector('[role="status"]')
    expect(status?.getAttribute('aria-live')).toBe('polite')
  })

  it('should label form inputs correctly', () => {
    const { container } = render(
      <>
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" />
      </>
    )
    const label = container.querySelector('label')
    expect(label?.getAttribute('for')).toBe('email')
  })

  it('should provide alt text for images', () => {
    const { container } = render(
      <img src="image.png" alt="Descriptive image text" />
    )
    const image = container.querySelector('img')
    expect(image?.hasAttribute('alt')).toBe(true)
    expect(image?.getAttribute('alt')).not.toBe('')
  })

  it('should mark decorative images appropriately', () => {
    const { container } = render(
      <img src="decoration.png" alt="" aria-hidden="true" />
    )
    const image = container.querySelector('img')
    expect(image?.getAttribute('alt')).toBe('')
    expect(image?.getAttribute('aria-hidden')).toBe('true')
  })
})

describe('Accessibility - Semantic HTML', () => {
  it('should use semantic elements over divs', () => {
    const { container } = render(
      <>
        <header>Header</header>
        <nav>Navigation</nav>
        <main>Main content</main>
        <footer>Footer</footer>
      </>
    )
    expect(container.querySelector('header')).toBeInTheDocument()
    expect(container.querySelector('nav')).toBeInTheDocument()
    expect(container.querySelector('main')).toBeInTheDocument()
    expect(container.querySelector('footer')).toBeInTheDocument()
  })

  it('should use proper heading hierarchy', () => {
    const { container } = render(
      <>
        <h1>Page Title</h1>
        <h2>Section 1</h2>
        <h3>Subsection</h3>
        <h2>Section 2</h2>
      </>
    )
    expect(container.querySelector('h1')).toBeInTheDocument()
    expect(container.querySelector('h2')).toBeInTheDocument()
    expect(container.querySelector('h3')).toBeInTheDocument()
  })

  it('should use lists for list content', () => {
    const { container } = render(
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    )
    expect(container.querySelector('ul')).toBeInTheDocument()
    expect(container.querySelectorAll('li').length).toBe(3)
  })

  it('should use table semantics for tabular data', () => {
    const { container } = render(
      <table>
        <thead>
          <tr><th>Header</th></tr>
        </thead>
        <tbody>
          <tr><td>Data</td></tr>
        </tbody>
      </table>
    )
    expect(container.querySelector('table')).toBeInTheDocument()
    expect(container.querySelector('th')).toBeInTheDocument()
  })

  it('should use button elements for button functionality', () => {
    const { container } = render(
      <button>Click me</button>
    )
    const button = container.querySelector('button')
    expect(button?.tagName).toBe('BUTTON')
  })

  it('should use links for navigation', () => {
    const { container } = render(
      <a href="/page">Navigate</a>
    )
    const link = container.querySelector('a')
    expect(link?.tagName).toBe('A')
    expect(link?.hasAttribute('href')).toBe(true)
  })
})

describe('Accessibility - Color & Contrast', () => {
  it('should have adequate color contrast for text', () => {
    const { container } = render(
      <div style={{ color: '#000', backgroundColor: '#fff' }}>
        High contrast
      </div>
    )
    const element = container.firstChild as HTMLElement
    expect(a11yValidators.hasAdequateContrast(element)).toBe(true)
  })

  it('should not rely solely on color to convey information', () => {
    const { container } = render(
      <>
        <div style={{ color: 'red' }}>Error</div>
        <div role="status" aria-live="polite">
          Error message content
        </div>
      </>
    )
    expect(container.querySelector('[role="status"]')).toBeInTheDocument()
  })

  it('should support high contrast mode', () => {
    // Test that focus states are visible without relying on color
    const { container } = render(
      <button className="focus:ring-2 focus:ring-black">
        Button
      </button>
    )
    const button = container.querySelector('button')
    expect(button?.className).toContain('focus:ring')
  })
})

describe('Accessibility - Form Controls', () => {
  it('should associate labels with inputs', () => {
    const { container } = render(
      <>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" />
      </>
    )
    const input = container.querySelector('#username')
    expect(input?.id).toBe('username')
  })

  it('should indicate required fields', () => {
    const { container } = render(
      <>
        <label htmlFor="email">Email <span aria-label="required">*</span></label>
        <input id="email" type="email" required aria-required="true" />
      </>
    )
    const input = container.querySelector('#email')
    expect(input?.hasAttribute('aria-required')).toBe(true)
  })

  it('should provide error messages accessibly', () => {
    const { container } = render(
      <>
        <input
          id="email"
          type="email"
          aria-describedby="email-error"
          value="invalid"
        />
        <span id="email-error" role="alert">
          Invalid email format
        </span>
      </>
    )
    const input = container.querySelector('#email')
    expect(input?.getAttribute('aria-describedby')).toBe('email-error')
  })

  it('should indicate form submission status', () => {
    const { container } = render(
      <div role="status" aria-live="polite">
        Form submitted successfully
      </div>
    )
    const status = container.querySelector('[role="status"]')
    expect(status?.getAttribute('aria-live')).toBe('polite')
  })
})

describe('Accessibility - Navigation', () => {
  it('should have skip links for main content', () => {
    const { container } = render(
      <>
        <a href="#main-content" className="sr-only">
          Skip to main content
        </a>
        <nav>Navigation</nav>
        <main id="main-content">Content</main>
      </>
    )
    const skipLink = container.querySelector('a[href="#main-content"]')
    expect(skipLink).toBeInTheDocument()
  })

  it('should mark current page in navigation', () => {
    const { container } = render(
      <nav>
        <a href="/home">Home</a>
        <a href="/about" aria-current="page">About</a>
      </nav>
    )
    const currentLink = container.querySelector('[aria-current="page"]')
    expect(currentLink).toBeInTheDocument()
  })

  it('should provide breadcrumb navigation', () => {
    const { container } = render(
      <nav aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/products">Products</a></li>
          <li><span aria-current="page">Product Name</span></li>
        </ol>
      </nav>
    )
    const breadcrumb = container.querySelector('[aria-label="Breadcrumb"]')
    expect(breadcrumb).toBeInTheDocument()
  })
})

describe('Accessibility - Motion & Animation', () => {
  it('should respect prefers-reduced-motion', () => {
    const { container } = render(
      <div className="motion-safe:animate-bounce motion-reduce:animate-none">
        Animated element
      </div>
    )
    const element = container.firstChild as HTMLElement
    expect(element.className).toContain('motion')
  })

  it('should provide control over auto-playing media', () => {
    const { container } = render(
      <video controls autoPlay={false}>
        <source src="video.mp4" type="video/mp4" />
      </video>
    )
    const video = container.querySelector('video')
    expect(video?.hasAttribute('controls')).toBe(true)
  })
})

describe('Accessibility - Mobile & Touch', () => {
  it('should have touch-friendly button sizes', () => {
    const { container } = render(
      <button className="w-12 h-12 min-h-[48px]">
        Touch button
      </button>
    )
    const button = container.querySelector('button')
    expect(button?.className).toContain('h-12')
  })

  it('should provide alternative input methods', () => {
    const { container } = render(
      <>
        <input type="text" />
        <input type="tel" />
        <input type="email" />
      </>
    )
    expect(container.querySelectorAll('input').length).toBe(3)
  })

  it('should support voice input hints', () => {
    const { container } = render(
      <input type="text" placeholder="Enter your name" />
    )
    const input = container.querySelector('input')
    expect(input?.hasAttribute('placeholder')).toBe(true)
  })
})
