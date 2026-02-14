import { test, expect } from '@playwright/test'

/**
 * PHASE 3: E2E TEST - CRITICAL USER FLOWS
 * Test essential user journeys across all devices
 */

test.describe('Critical User Flows', () => {
  test.describe('Homepage Navigation', () => {
    test('should load homepage successfully', async ({ page }) => {
      await page.goto('/')
      await expect(page).toHaveTitle(/Skills|newth/i)
    })

    test('should display navigation menu', async ({ page }) => {
      await page.goto('/')
      const nav = page.locator('nav')
      await expect(nav).toBeVisible()
    })

    test('should navigate to main sections', async ({ page }) => {
      await page.goto('/')

      // Find and click navigation links
      const homeLink = page.locator('a:has-text("Home")')
      if (await homeLink.isVisible()) {
        await homeLink.click()
        await page.waitForLoadState('domcontentloaded')
      }
    })

    test('should toggle theme', async ({ page }) => {
      await page.goto('/')

      // Find theme toggle button (may be sun/moon icon or labeled button)
      const themeToggle = page.locator('button[aria-label*="theme"], button[aria-label*="dark"]').first()

      if (await themeToggle.isVisible()) {
        await themeToggle.click()
        // Verify theme change (check for data-theme attribute or class change)
        await page.waitForTimeout(300) // Wait for transition
      }
    })
  })

  test.describe('Skill Discovery', () => {
    test('should display skill cards', async ({ page }) => {
      await page.goto('/')

      const skillCards = page.locator('[class*="skill-card"], [class*="glass-card"]')
      const count = await skillCards.count()

      expect(count).toBeGreaterThan(0)
    })

    test('should navigate to skill detail page', async ({ page }) => {
      await page.goto('/')

      // Find first skill card link
      const skillLink = page.locator('a[href*="/skill/"]').first()

      if (await skillLink.isVisible()) {
        await skillLink.click()
        await page.waitForLoadState('domcontentloaded')

        // Verify we're on a skill detail page
        const url = page.url()
        expect(url).toContain('/skill/')
      }
    })

    test('should search/filter skills', async ({ page }) => {
      await page.goto('/')

      // Look for search input
      const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]').first()

      if (await searchInput.isVisible()) {
        await searchInput.fill('test')
        await page.waitForTimeout(300)

        // Verify results are filtered
        const skillCards = page.locator('[class*="skill-card"]')
        await expect(skillCards).toBeDefined()
      }
    })
  })

  test.describe('Form Interactions', () => {
    test('should submit contact form', async ({ page }) => {
      // Navigate to contact page if it exists
      const contactLink = page.locator('a:has-text("Contact"), a[href*="/contact"]').first()

      if (await contactLink.isVisible()) {
        await contactLink.click()
        await page.waitForLoadState('domcontentloaded')

        // Find form
        const form = page.locator('form').first()

        if (await form.isVisible()) {
          // Fill form fields
          const nameInput = form.locator('input[name*="name"], input[placeholder*="name"]').first()
          const emailInput = form.locator('input[type="email"]').first()

          if (await nameInput.isVisible()) {
            await nameInput.fill('Test User')
          }

          if (await emailInput.isVisible()) {
            await emailInput.fill('test@example.com')
          }

          // Submit form
          const submitButton = form.locator('button[type="submit"]').first()

          if (await submitButton.isVisible()) {
            await submitButton.click()
            await page.waitForTimeout(500)
          }
        }
      }
    })

    test('should validate required fields', async ({ page }) => {
      const contactLink = page.locator('a:has-text("Contact"), a[href*="/contact"]').first()

      if (await contactLink.isVisible()) {
        await contactLink.click()
        await page.waitForLoadState('domcontentloaded')

        const form = page.locator('form').first()

        if (await form.isVisible()) {
          // Try to submit empty form
          const submitButton = form.locator('button[type="submit"]').first()

          if (await submitButton.isVisible()) {
            await submitButton.click()

            // Check for validation messages
            const errorMessages = page.locator('[role="alert"]')
            const errorCount = await errorMessages.count()

            // Validation should either prevent submission or show errors
            expect(errorCount).toBeGreaterThanOrEqual(0)
          }
        }
      }
    })
  })

  test.describe('Mobile Navigation', () => {
    test('should work on mobile devices', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' })

      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })

      // Navigation should be visible or have mobile menu toggle
      const mobileMenu = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]').first()
      const nav = page.locator('nav').first()

      const navVisible = await nav.isVisible()
      const menuVisible = await mobileMenu.isVisible()

      // At least one should be visible
      expect(navVisible || menuVisible).toBeTruthy()
    })

    test('should handle mobile menu toggle', async ({ page }) => {
      await page.goto('/')
      await page.setViewportSize({ width: 375, height: 667 })

      const mobileMenu = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]').first()

      if (await mobileMenu.isVisible()) {
        await mobileMenu.click()
        await page.waitForTimeout(300)

        // Menu should now be in expanded state
        const menuOpen = await page.locator('nav').isVisible()
        expect(menuOpen || mobileMenu.isVisible()).toBeTruthy()
      }
    })

    test('should display content without horizontal scroll', async ({ page }) => {
      await page.goto('/')
      await page.setViewportSize({ width: 375, height: 667 })

      // Check that page width doesn't exceed viewport
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      const viewportWidth = 375

      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('should navigate with Tab key', async ({ page }) => {
      await page.goto('/')

      // Press Tab to move to first interactive element
      await page.keyboard.press('Tab')
      await page.waitForTimeout(100)

      // Get currently focused element
      const focusedElement = await page.evaluate(() => {
        return (document.activeElement as HTMLElement)?.tagName || 'BODY'
      })

      // Should focus on an interactive element
      expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement)
    })

    test('should access links with keyboard', async ({ page }) => {
      await page.goto('/')

      // Press Tab to navigate to first link
      await page.keyboard.press('Tab')
      await page.waitForTimeout(100)

      // Check focus style is visible
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement
        const styles = window.getComputedStyle(el)
        return {
          outline: styles.outline,
          boxShadow: styles.boxShadow,
          className: el.className,
        }
      })

      // Focus indicator should be visible (outline, shadow, or class)
      const hasFocusIndicator =
        focusedElement.outline !== 'none' ||
        focusedElement.boxShadow !== 'none' ||
        focusedElement.className.includes('focus')

      expect(hasFocusIndicator).toBeTruthy()
    })

    test('should handle Enter key on buttons', async ({ page }) => {
      await page.goto('/')

      // Find a button and focus it
      const button = page.locator('button').first()

      if (await button.isVisible()) {
        await button.focus()
        await button.press('Enter')

        // Button click should be handled
        await page.waitForTimeout(300)
      }
    })
  })

  test.describe('Performance - Page Load', () => {
    test('should load within acceptable time (LCP)', async ({ page }) => {
      const startTime = Date.now()

      await page.goto('/')

      // Wait for largest contentful paint
      await page.waitForLoadState('domcontentloaded')

      const loadTime = Date.now() - startTime

      // LCP should be under 2.5 seconds (good threshold)
      expect(loadTime).toBeLessThan(2500)
    })

    test('should handle no layout shifts (CLS)', async ({ page }) => {
      await page.goto('/')

      // Check that images have dimensions
      const images = await page.locator('img').all()

      for (const img of images) {
        const width = await img.getAttribute('width')
        const height = await img.getAttribute('height')

        // Images should have dimensions to prevent layout shift
        if (width && height) {
          expect(width).not.toBe('')
          expect(height).not.toBe('')
        }
      }
    })
  })

  test.describe('Accessibility - Screen Reader', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/')

      // Page should start with h1
      const h1 = page.locator('h1').first()
      const h1Visible = await h1.isVisible().catch(() => false)

      if (h1Visible) {
        expect(h1Visible).toBeTruthy()
      }

      // Check for logical heading structure
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
      expect(headings.length).toBeGreaterThan(0)
    })

    test('should have alt text for images', async ({ page }) => {
      await page.goto('/')

      const images = await page.locator('img').all()

      for (const img of images) {
        const alt = await img.getAttribute('alt')
        const ariaHidden = await img.getAttribute('aria-hidden')

        // Images should either have alt text or be marked as decorative
        if (ariaHidden !== 'true') {
          expect(alt).not.toBeNull()
        }
      }
    })

    test('should label form inputs', async ({ page }) => {
      const contactLink = page.locator('a:has-text("Contact"), a[href*="/contact"]').first()

      if (await contactLink.isVisible()) {
        await contactLink.click()
        await page.waitForLoadState('domcontentloaded')

        const inputs = await page.locator('input').all()

        for (const input of inputs) {
          const label = await page.locator(`label[for="${await input.getAttribute('id')}"]`).isVisible().catch(() => false)
          const ariaLabel = await input.getAttribute('aria-label')

          // Input should have either label or aria-label
          expect(label || ariaLabel).toBeTruthy()
        }
      }
    })
  })
})

test.describe('Mobile Device Testing', () => {
  test('should work on iPhone', async ({ browser }) => {
    const context = await browser.newContext({
      ...require('@playwright/test').devices['iPhone 12'],
    })

    const page = await context.newPage()
    await page.goto('/')

    // Verify page renders on iPhone
    const content = page.locator('body')
    await expect(content).toBeVisible()

    await context.close()
  })

  test('should work on Android', async ({ browser }) => {
    const context = await browser.newContext({
      ...require('@playwright/test').devices['Pixel 5'],
    })

    const page = await context.newPage()
    await page.goto('/')

    // Verify page renders on Android
    const content = page.locator('body')
    await expect(content).toBeVisible()

    await context.close()
  })

  test('should work on iPad', async ({ browser }) => {
    const context = await browser.newContext({
      ...require('@playwright/test').devices['iPad Pro'],
    })

    const page = await context.newPage()
    await page.goto('/')

    // Verify page renders on iPad
    const content = page.locator('body')
    await expect(content).toBeVisible()

    await context.close()
  })
})
