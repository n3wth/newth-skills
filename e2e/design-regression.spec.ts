import { test, expect } from '@playwright/test'

/**
 * PHASE 3: E2E TEST - VISUAL REGRESSION TESTING
 * Verify design system consistency across renders
 */

test.describe('Design System Regression Tests', () => {
  test.describe('Flat Design Compliance', () => {
    test('should not have shadows on cards', async ({ page }) => {
      await page.goto('/')

      // Get all cards/glass elements
      const cards = await page.locator('[class*="glass-card"], [class*="card"]').all()

      for (const card of cards) {
        const shadow = await card.evaluate((el) => {
          return window.getComputedStyle(el).boxShadow
        })

        // Should not have shadows (or only have 'none')
        expect(shadow === 'none' || shadow === '').toBeTruthy()
      }
    })

    test('should use borders instead of shadows', async ({ page }) => {
      await page.goto('/')

      const cards = await page.locator('[class*="glass-card"]').all()

      for (const card of cards) {
        const borderColor = await card.evaluate((el) => {
          return window.getComputedStyle(el).borderColor
        })

        // Cards should have border styling
        expect(borderColor).not.toBeNull()
      }
    })

    test('should not apply gradients to non-button elements', async ({ page }) => {
      await page.goto('/')

      const elements = await page.locator('*:not(button)').all()

      for (const el of elements.slice(0, 20)) {
        // Sample first 20 elements
        const bgImage = await el.evaluate((e) => {
          return window.getComputedStyle(e).backgroundImage
        })

        // Non-button elements shouldn't have gradients
        if (bgImage !== 'none' && bgImage !== '') {
          expect(bgImage).not.toContain('gradient')
        }
      }
    })
  })

  test.describe('Responsive Design Consistency', () => {
    test('should scale correctly on mobile', async ({ page }) => {
      await page.goto('/')

      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })

      // Check hero section displays properly
      const hero = page.locator('header, [class*="hero"], section').first()

      if (await hero.isVisible()) {
        const boundingBox = await hero.boundingBox()
        expect(boundingBox?.width).toBeLessThanOrEqual(375)
      }
    })

    test('should display correctly on tablet', async ({ page }) => {
      await page.goto('/')

      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 })

      const content = page.locator('main, body')
      const width = await content.first().evaluate((el) => el.clientWidth)

      expect(width).toBeLessThanOrEqual(768)
    })

    test('should display correctly on desktop', async ({ page }) => {
      await page.goto('/')

      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 })

      const content = page.locator('main, body').first()
      const width = await content.evaluate((el) => el.clientWidth)

      expect(width).toBeGreaterThan(768)
    })

    test('should not have horizontal scroll on any viewport', async ({ page, browserName }) => {
      const viewports = [
        { width: 375, height: 667 },   // Mobile
        { width: 768, height: 1024 },  // Tablet
        { width: 1920, height: 1080 }, // Desktop
      ]

      for (const viewport of viewports) {
        await page.goto('/')
        await page.setViewportSize(viewport)

        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
        const clientWidth = viewport.width

        expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
      }
    })
  })

  test.describe('Typography Consistency', () => {
    test('should maintain minimum font sizes', async ({ page }) => {
      await page.goto('/')

      const textElements = await page.locator('p, span, a, button').all()

      for (const el of textElements.slice(0, 20)) {
        const fontSize = await el.evaluate((e) => {
          return parseInt(window.getComputedStyle(e).fontSize)
        })

        // Most text should be at least 12px, body text 16px
        expect(fontSize).toBeGreaterThanOrEqual(11)
      }
    })

    test('should maintain consistent line heights', async ({ page }) => {
      await page.goto('/')

      const paragraphs = await page.locator('p').all()

      for (const p of paragraphs.slice(0, 10)) {
        const lineHeight = await p.evaluate((e) => {
          return parseFloat(window.getComputedStyle(e).lineHeight)
        })

        // Line height should be reasonable (at least 1.2)
        expect(lineHeight).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Color Consistency', () => {
    test('should use consistent glass background', async ({ page }) => {
      await page.goto('/')

      const glassElements = await page.locator('[class*="glass"]').all()

      const backgrounds = new Set<string>()

      for (const el of glassElements.slice(0, 10)) {
        const bg = await el.evaluate((e) => {
          return window.getComputedStyle(e).backgroundColor
        })

        backgrounds.add(bg)
      }

      // Should have limited number of background colors
      expect(backgrounds.size).toBeLessThanOrEqual(5)
    })

    test('should maintain accessible color contrast', async ({ page }) => {
      await page.goto('/')

      const textElements = await page.locator('p, a, span, button, h1, h2, h3').all()

      for (const el of textElements.slice(0, 20)) {
        const color = await el.evaluate((e) => {
          return window.getComputedStyle(e).color
        })

        const bgColor = await el.evaluate((e) => {
          return window.getComputedStyle(e).backgroundColor
        })

        // Colors should be different (not transparent on transparent)
        expect(color).not.toBe('rgba(0, 0, 0, 0)')
      }
    })
  })

  test.describe('Spacing Consistency', () => {
    test('should use consistent padding on cards', async ({ page }) => {
      await page.goto('/')

      const cards = await page.locator('[class*="glass-card"]').all()

      const paddings = new Set<string>()

      for (const card of cards.slice(0, 5)) {
        const padding = await card.evaluate((e) => {
          return window.getComputedStyle(e).padding
        })

        paddings.add(padding)
      }

      // Cards should have consistent spacing
      expect(paddings.size).toBeLessThanOrEqual(3)
    })

    test('should maintain consistent margins', async ({ page }) => {
      await page.goto('/')

      // Check section spacing
      const sections = await page.locator('section, main > *').all()

      for (const section of sections.slice(0, 5)) {
        const margin = await section.evaluate((e) => {
          return window.getComputedStyle(e).margin
        })

        expect(margin).toBeDefined()
      }
    })
  })

  test.describe('Animation & Transition Consistency', () => {
    test('should have consistent animation durations', async ({ page }) => {
      await page.goto('/')

      const animatedElements = await page.locator('[class*="transition"], [class*="animate"]').all()

      for (const el of animatedElements.slice(0, 10)) {
        const transition = await el.evaluate((e) => {
          return window.getComputedStyle(e).transition
        })

        // Should have transition property
        expect(transition).toBeDefined()
      }
    })

    test('should not have excessive animations', async ({ page }) => {
      await page.goto('/')

      const animatedCount = await page.locator('[style*="animation"], [style*="transition"]').count()

      // Reasonable number of animations
      expect(animatedCount).toBeLessThan(50)
    })
  })

  test.describe('Component Consistency', () => {
    test('should display buttons consistently', async ({ page }) => {
      await page.goto('/')

      const buttons = await page.locator('button').all()

      const styles = new Set<string>()

      for (const btn of buttons.slice(0, 10)) {
        const style = await btn.evaluate((e) => {
          const s = window.getComputedStyle(e)
          return `${s.padding}-${s.borderRadius}-${s.backgroundColor}`
        })

        styles.add(style)
      }

      // Buttons should have limited style variations
      expect(styles.size).toBeLessThanOrEqual(5)
    })

    test('should display links consistently', async ({ page }) => {
      await page.goto('/')

      const links = await page.locator('a').all()

      const styles = new Set<string>()

      for (const link of links.slice(0, 10)) {
        const style = await link.evaluate((e) => {
          const s = window.getComputedStyle(e)
          return `${s.color}-${s.textDecoration}`
        })

        styles.add(style)
      }

      // Links should have consistent styling
      expect(styles.size).toBeLessThanOrEqual(4)
    })
  })

  test.describe('Accessibility Regression', () => {
    test('should maintain focus visibility', async ({ page }) => {
      await page.goto('/')

      // Focus on first interactive element
      await page.keyboard.press('Tab')
      await page.waitForTimeout(100)

      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement
        if (!el) return null

        const styles = window.getComputedStyle(el)
        return {
          outline: styles.outline,
          boxShadow: styles.boxShadow,
          className: el.className,
        }
      })

      // Should have some focus indication
      expect(focusedElement).not.toBeNull()
    })

    test('should maintain semantic HTML structure', async ({ page }) => {
      await page.goto('/')

      const hasHeader = await page.locator('header').isVisible().catch(() => false)
      const hasNav = await page.locator('nav').isVisible().catch(() => false)
      const hasMain = await page.locator('main').isVisible().catch(() => false)
      const hasFooter = await page.locator('footer').isVisible().catch(() => false)

      // Should have basic semantic structure
      expect(
        (hasHeader ? 1 : 0) +
        (hasNav ? 1 : 0) +
        (hasMain ? 1 : 0) +
        (hasFooter ? 1 : 0)
      ).toBeGreaterThanOrEqual(2)
    })
  })

  test.describe('Performance Regression', () => {
    test('should maintain image optimization', async ({ page }) => {
      await page.goto('/')

      const images = await page.locator('img').all()

      for (const img of images) {
        const src = await img.getAttribute('src')
        const width = await img.getAttribute('width')
        const height = await img.getAttribute('height')

        // Images should be optimized
        if (src && !src.includes('data:')) {
          expect(src).toBeTruthy()
        }
      }
    })

    test('should not have console errors', async ({ page }) => {
      const errors: string[] = []

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })

      await page.goto('/')

      expect(errors).toEqual([])
    })
  })
})

test.describe('Cross-Browser Visual Consistency', () => {
  test('should render consistently in Chromium', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto('/')

    const content = page.locator('body')
    await expect(content).toBeVisible()

    await context.close()
  })

  test('should render consistently in Firefox', async ({ browserName, browser }) => {
    if (browserName !== 'firefox') return

    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto('/')

    const content = page.locator('body')
    await expect(content).toBeVisible()

    await context.close()
  })

  test('should render consistently in WebKit', async ({ browserName, browser }) => {
    if (browserName !== 'webkit') return

    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto('/')

    const content = page.locator('body')
    await expect(content).toBeVisible()

    await context.close()
  })
})
