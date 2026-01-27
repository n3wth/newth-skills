---
name: Webapp Testing
version: 1.5.0
author: newth.ai
category: development
tags:
  - testing
  - playwright
  - e2e
  - automation
compatibility:
  - gemini
  - claude
---

# Webapp Testing

Toolkit for interacting with and testing local web applications using Playwright. Verify frontend functionality, capture browser screenshots, and automate complex user flows.

## Triggers

Use this skill when the user requests:
- End-to-end testing of web applications
- Browser automation with Playwright
- Screenshot capture and visual testing
- Form submission verification
- User flow automation

Keywords: "test", "playwright", "e2e", "browser", "screenshot", "automation", "selenium", "testing"

## Features

- **Cross-Browser Testing**: Test on Chromium, Firefox, and WebKit
- **Screenshot Capture**: Take full-page or element screenshots
- **User Flow Automation**: Simulate complex user interactions
- **Network Interception**: Mock API responses and monitor requests
- **Mobile Viewport Testing**: Test responsive designs

## Usage Examples

### Basic test with Playwright

```python
import asyncio
from playwright.async_api import async_playwright

async def test_login_flow():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Navigate to login page
        await page.goto('http://localhost:3000/login')
        
        # Fill in credentials
        await page.fill('input[name="email"]', 'user@example.com')
        await page.fill('input[name="password"]', 'password123')
        
        # Click login button
        await page.click('button[type="submit"]')
        
        # Wait for navigation
        await page.wait_for_url('**/dashboard')
        
        # Verify we're logged in
        welcome_text = await page.text_content('.welcome-message')
        assert 'Welcome' in welcome_text
        
        # Take screenshot
        await page.screenshot(path='dashboard.png')
        
        await browser.close()

asyncio.run(test_login_flow())
```

### Visual regression testing

```python
import asyncio
from playwright.async_api import async_playwright
from PIL import Image
import imagehash

async def capture_and_compare(url, baseline_path, threshold=5):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        await page.goto(url)
        await page.wait_for_load_state('networkidle')
        
        # Capture current state
        current_path = 'current_screenshot.png'
        await page.screenshot(path=current_path, full_page=True)
        
        # Compare with baseline
        baseline_hash = imagehash.average_hash(Image.open(baseline_path))
        current_hash = imagehash.average_hash(Image.open(current_path))
        
        difference = baseline_hash - current_hash
        
        await browser.close()
        
        return {
            'passed': difference <= threshold,
            'difference': difference,
            'baseline': baseline_path,
            'current': current_path
        }

# Usage
result = asyncio.run(capture_and_compare(
    'http://localhost:3000',
    'baseline_homepage.png'
))
print(f"Visual test {'passed' if result['passed'] else 'failed'}")
```

### Form testing with validation

```python
import asyncio
from playwright.async_api import async_playwright

async def test_form_validation():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        await page.goto('http://localhost:3000/signup')
        
        # Test empty form submission
        await page.click('button[type="submit"]')
        
        # Check for validation errors
        email_error = await page.text_content('.email-error')
        assert 'required' in email_error.lower()
        
        # Test invalid email
        await page.fill('input[name="email"]', 'invalid-email')
        await page.click('button[type="submit"]')
        
        email_error = await page.text_content('.email-error')
        assert 'valid email' in email_error.lower()
        
        # Test valid submission
        await page.fill('input[name="email"]', 'valid@example.com')
        await page.fill('input[name="password"]', 'SecurePass123!')
        await page.fill('input[name="confirm"]', 'SecurePass123!')
        
        await page.click('button[type="submit"]')
        await page.wait_for_url('**/welcome')
        
        success_message = await page.text_content('.success')
        assert 'Account created' in success_message
        
        await browser.close()

asyncio.run(test_form_validation())
```

### Network request interception

```python
import asyncio
from playwright.async_api import async_playwright

async def test_with_mocked_api():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Mock API response
        await page.route('**/api/users', lambda route: route.fulfill(
            status=200,
            content_type='application/json',
            body='[{"id": 1, "name": "Test User"}]'
        ))
        
        await page.goto('http://localhost:3000/users')
        
        # Verify mocked data is displayed
        user_name = await page.text_content('.user-name')
        assert user_name == 'Test User'
        
        await browser.close()

async def monitor_network_requests():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        requests = []
        
        page.on('request', lambda req: requests.append({
            'url': req.url,
            'method': req.method
        }))
        
        await page.goto('http://localhost:3000')
        await page.wait_for_load_state('networkidle')
        
        print(f"Captured {len(requests)} requests")
        for req in requests:
            print(f"  {req['method']} {req['url']}")
        
        await browser.close()

asyncio.run(test_with_mocked_api())
```

### Mobile viewport testing

```python
import asyncio
from playwright.async_api import async_playwright

async def test_responsive_design():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        viewports = [
            {'name': 'mobile', 'width': 375, 'height': 667},
            {'name': 'tablet', 'width': 768, 'height': 1024},
            {'name': 'desktop', 'width': 1920, 'height': 1080},
        ]
        
        for viewport in viewports:
            page = await browser.new_page(
                viewport={'width': viewport['width'], 'height': viewport['height']}
            )
            
            await page.goto('http://localhost:3000')
            await page.screenshot(path=f"screenshot_{viewport['name']}.png")
            
            # Check mobile menu visibility
            if viewport['width'] < 768:
                hamburger = await page.is_visible('.hamburger-menu')
                assert hamburger, f"Hamburger menu should be visible on {viewport['name']}"
            else:
                nav = await page.is_visible('.desktop-nav')
                assert nav, f"Desktop nav should be visible on {viewport['name']}"
            
            await page.close()
        
        await browser.close()

asyncio.run(test_responsive_design())
```

## Dependencies

```bash
pip install playwright
playwright install  # Downloads browser binaries
```

For visual comparison:
```bash
pip install Pillow imagehash
```

## Best Practices

1. **Use explicit waits** instead of arbitrary sleep times
2. **Run headless in CI** but headed locally for debugging
3. **Isolate test data** to prevent test interference
4. **Take screenshots on failure** for debugging
5. **Use page object pattern** for maintainable test code
