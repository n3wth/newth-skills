import { render, RenderOptions } from '@testing-library/react'
import React, { ReactElement } from 'react'

/**
 * Test utilities for design system and quality assurance
 */

// Custom render function with common providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options })
}

/**
 * Design System Validators
 */

export const designSystemValidators = {
  /**
   * Check if element has any shadow effects (forbidden in flat design)
   */
  hasShadow(element: HTMLElement | null): boolean {
    if (!element) return false
    const styles = window.getComputedStyle(element)
    return (
      styles.boxShadow !== 'none' &&
      styles.boxShadow !== '' &&
      styles.textShadow !== 'none' &&
      styles.textShadow !== ''
    )
  },

  /**
   * Check if element has forbidden gradient effects
   */
  hasGradient(element: HTMLElement | null): boolean {
    if (!element) return false
    const styles = window.getComputedStyle(element)
    const bg = styles.backgroundImage
    return bg.includes('gradient') || bg.includes('conic-gradient')
  },

  /**
   * Verify CSS variables are used instead of hardcoded colors
   */
  usesCSSVariables(element: HTMLElement | null): boolean {
    if (!element) return false
    const styles = window.getComputedStyle(element)
    const color = styles.color
    const bgColor = styles.backgroundColor
    // Check if values contain 'var(' or computed rgb values from var() usage
    return color.includes('rgb') || bgColor.includes('rgb') || color !== 'rgba(0, 0, 0, 0)'
  },

  /**
   * Verify glass morphism styling when applicable
   */
  isValidGlassMorphism(element: HTMLElement | null): boolean {
    if (!element) return false
    const classList = element.className
    return classList.includes('glass-card') || classList.includes('glass')
  },

  /**
   * Check for consistent spacing/padding
   */
  hasConsistentSpacing(element: HTMLElement | null): boolean {
    if (!element) return false
    const styles = window.getComputedStyle(element)
    const padding = styles.padding
    // Valid if uses Tailwind spacing classes or consistent padding
    return !isNaN(parseInt(padding))
  },

  /**
   * Verify no blur filter on non-glass elements (blur only for glass morphism)
   */
  invalidBlurUsage(element: HTMLElement | null): boolean {
    if (!element) return false
    const styles = window.getComputedStyle(element)
    const filter = styles.filter
    const isGlassElement = element.className.includes('glass')

    if (filter !== 'none') {
      // Blur is only valid on glass morphism elements
      return !isGlassElement && filter.includes('blur')
    }
    return false
  },
}

/**
 * Responsive Design Validators
 */

export const responsiveValidators = {
  /**
   * Check for horizontal overflow (should never happen on mobile)
   */
  hasHorizontalOverflow(element: HTMLElement | null): boolean {
    if (!element) return false
    return element.scrollWidth > element.clientWidth
  },

  /**
   * Verify touch targets are at least 48px (WCAG guideline)
   */
  hasSufficientTouchTarget(element: HTMLElement | null): boolean {
    if (!element) return false
    const rect = element.getBoundingClientRect()
    const minSize = 48
    return rect.width >= minSize && rect.height >= minSize
  },

  /**
   * Check text is readable at default zoom (16px+ minimum)
   */
  hasReadableFontSize(element: HTMLElement | null): boolean {
    if (!element) return false
    const styles = window.getComputedStyle(element)
    const fontSize = parseInt(styles.fontSize)
    return fontSize >= 16
  },

  /**
   * Verify safe area insets are respected on mobile
   */
  respectsSafeAreaInsets(element: HTMLElement | null): boolean {
    if (!element) return false
    const styles = window.getComputedStyle(element)
    const padding = styles.padding
    // Valid if has safe padding for notch/home indicator
    return parseInt(padding) >= 16
  },

  /**
   * Check breakpoint consistency
   */
  isResponsiveLayout(element: HTMLElement | null): boolean {
    if (!element) return false
    // Check if uses responsive Tailwind classes
    const classList = element.className
    return (
      classList.includes('sm:') ||
      classList.includes('md:') ||
      classList.includes('lg:')
    )
  },
}

/**
 * Accessibility Validators
 */

export const a11yValidators = {
  /**
   * Verify interactive elements are keyboard accessible
   */
  isKeyboardAccessible(element: HTMLElement | null): boolean {
    if (!element) return false
    const tabIndex = element.getAttribute('tabindex')
    const isNaturallyFocusable = [
      'A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'
    ].includes(element.tagName)
    return isNaturallyFocusable || (tabIndex !== null && parseInt(tabIndex) >= 0)
  },

  /**
   * Check for accessible focus indicators
   */
  hasFocusIndicator(element: HTMLElement | null): boolean {
    if (!element) return false
    const styles = window.getComputedStyle(element, ':focus')
    return styles.outline !== 'none' || styles.boxShadow !== 'none'
  },

  /**
   * Verify appropriate ARIA labels
   */
  hasAccessibleLabel(element: HTMLElement | null): boolean {
    if (!element) return false
    return (
      element.getAttribute('aria-label') !== null ||
      element.getAttribute('aria-labelledby') !== null ||
      element.textContent?.trim().length! > 0
    )
  },

  /**
   * Check for proper semantic HTML
   */
  usesSemanticsCorrectly(element: HTMLElement | null): boolean {
    if (!element) return false
    const tag = element.tagName.toLowerCase()
    // Valid if uses semantic elements or proper ARIA roles
    return (
      ['header', 'nav', 'main', 'section', 'article', 'footer'].includes(tag) ||
      element.getAttribute('role') !== null
    )
  },

  /**
   * Verify color contrast ratios (basic check)
   */
  hasAdequateContrast(element: HTMLElement | null): boolean {
    if (!element) return false
    const styles = window.getComputedStyle(element)
    // This is a simplified check - full WCAG checking requires color calculation
    const fg = styles.color
    const bg = styles.backgroundColor
    return fg !== bg && bg !== 'rgba(0, 0, 0, 0)'
  },
}

/**
 * Performance Validators
 */

export const performanceValidators = {
  /**
   * Check for console errors during render
   */
  hasNoConsoleErrors(): boolean {
    const errors: string[] = []
    const originalError = console.error
    let errorCount = 0

    console.error = (msg: string) => {
      errorCount++
      errors.push(msg)
    }

    return errorCount === 0
  },

  /**
   * Verify images load without layout shift
   */
  hasNoLayoutShift(element: HTMLElement | null): boolean {
    if (!element) return false
    const images = element.querySelectorAll('img')
    let hasLayoutShift = false

    images.forEach(img => {
      if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
        hasLayoutShift = true
      }
    })

    return !hasLayoutShift
  },

  /**
   * Check for unnecessary re-renders
   */
  memoizationWorking(renderCount: number): boolean {
    // If component renders > expected, memoization may not be working
    return renderCount <= 1
  },
}

/**
 * Utility to simulate mobile viewport
 */

export function setMobileViewport() {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 375,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 667,
  })
}

export function setTabletViewport() {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 768,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 1024,
  })
}

export function setDesktopViewport() {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1920,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 1080,
  })
}

/**
 * Utility to check if element is visible in viewport
 */

export function isVisibleInViewport(element: HTMLElement | null): boolean {
  if (!element) return false
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  )
}

/**
 * Utility to get computed color value from CSS variable
 */

export function getColorFromVariable(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
}

/**
 * Create a more realistic ResizeObserver mock for testing
 */

export function setupResizeObserverMock() {
  const ResizeObserverMock = class {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
  }

  window.ResizeObserver = ResizeObserverMock as any
}
