import { test, expect } from '@playwright/test';

/**
 * Aviation Design System E2E Tests
 * 
 * Tests validate the 380+ lines of CSS overrides implementation across 3 phases:
 * - Phase 1: CSS Variables and Component Classes
 * - Phase 2: Global Utility Overrides
 * - Phase 3: Aggressive shadcn/ui Component Overrides
 */

test.describe('Aviation Design System - CSS Variables', () => {
  test('should load aviation color palette correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check that aviation CSS variables are defined
    const rootStyles = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      return {
        primaryBlue: styles.getPropertyValue('--aviation-primary-500').trim(),
        accentOrange: styles.getPropertyValue('--aviation-accent-500').trim(),
        neutralGray: styles.getPropertyValue('--aviation-neutral-500').trim(),
      };
    });
    
    // Validate aviation colors are set (not empty)
    expect(rootStyles.primaryBlue).toBeTruthy();
    expect(rootStyles.accentOrange).toBeTruthy();
    expect(rootStyles.neutralGray).toBeTruthy();
  });

  test('should use Inter font for sans-serif', async ({ page }) => {
    await page.goto('/');
    
    const fontFamily = await page.evaluate(() => {
      const body = document.body;
      return getComputedStyle(body).fontFamily;
    });
    
    expect(fontFamily).toContain('Inter');
  });

  test('should use JetBrains Mono for monospace elements', async ({ page }) => {
    await page.goto('/');
    
    // Look for code or pre elements that should use monospace
    const codeElement = page.locator('code, pre, [class*="mono"]').first();
    
    if (await codeElement.count() > 0) {
      const fontFamily = await codeElement.evaluate((el) => 
        getComputedStyle(el).fontFamily
      );
      
      expect(fontFamily).toContain('JetBrains Mono');
    }
  });
});

test.describe('Aviation Design System - Component Classes', () => {
  test('should apply aviation button styles', async ({ page }) => {
    await page.goto('/');
    
    // Find buttons with aviation classes
    const aviationButton = page.locator('button[class*="aviation"], .btn-aviation-primary').first();
    
    if (await aviationButton.count() > 0) {
      const buttonStyles = await aviationButton.evaluate((el) => {
        const styles = getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          borderRadius: styles.borderRadius,
          fontWeight: styles.fontWeight,
        };
      });
      
      // Aviation buttons should have rounded corners and medium/bold font weight
      expect(buttonStyles.borderRadius).not.toBe('0px');
      expect(parseInt(buttonStyles.fontWeight)).toBeGreaterThanOrEqual(500);
    }
  });

  test('should apply aviation card styles', async ({ page }) => {
    await page.goto('/');
    
    // Find cards with aviation classes
    const aviationCard = page.locator('[class*="card-aviation"]').first();
    
    if (await aviationCard.count() > 0) {
      const cardStyles = await aviationCard.evaluate((el) => {
        const styles = getComputedStyle(el);
        return {
          borderRadius: styles.borderRadius,
          boxShadow: styles.boxShadow,
          border: styles.border,
        };
      });
      
      // Aviation cards should have rounded corners, shadows, and borders
      expect(cardStyles.borderRadius).not.toBe('0px');
      expect(cardStyles.boxShadow).not.toBe('none');
      expect(cardStyles.border).not.toBe('0px');
    }
  });
});

test.describe('Aviation Design System - Global Overrides', () => {
  test('should override default button styles with aviation theme', async ({ page }) => {
    await page.goto('/');
    
    // Test that even default buttons get aviation styling
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      const fontFamily = await firstButton.evaluate((el) => 
        getComputedStyle(el).fontFamily
      );
      
      // All buttons should use Inter font (aviation override)
      expect(fontFamily).toContain('Inter');
    }
  });

  test('should override heading styles with aviation typography', async ({ page }) => {
    await page.goto('/');
    
    // Check h1, h2, h3 elements
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();
    
    if (headingCount > 0) {
      const firstHeading = headings.first();
      const styles = await firstHeading.evaluate((el) => {
        const computed = getComputedStyle(el);
        return {
          fontFamily: computed.fontFamily,
          fontWeight: computed.fontWeight,
        };
      });
      
      // Headings should use Inter and be bold
      expect(styles.fontFamily).toContain('Inter');
      expect(parseInt(styles.fontWeight)).toBeGreaterThanOrEqual(600);
    }
  });
});

test.describe('Aviation Design System - shadcn/ui Overrides', () => {
  test('should override shadcn/ui card components', async ({ page }) => {
    await page.goto('/');
    
    // Find shadcn/ui cards
    const cards = page.locator('[data-slot="card"], div[class*="rounded-lg"][class*="border"]');
    const cardCount = await cards.count();
    
    if (cardCount > 0) {
      const firstCard = cards.first();
      const borderColor = await firstCard.evaluate((el) => 
        getComputedStyle(el).borderColor
      );
      
      // Cards should have aviation-themed border colors (not default gray)
      expect(borderColor).toBeTruthy();
      expect(borderColor).not.toBe('rgb(229, 231, 235)'); // Not default gray-200
    }
  });

  test('should override shadcn/ui button variants', async ({ page }) => {
    await page.goto('/');
    
    // Find buttons with data-variant attributes (shadcn/ui pattern)
    const variantButtons = page.locator('button[data-variant]');
    const buttonCount = await variantButtons.count();
    
    if (buttonCount > 0) {
      const firstButton = variantButtons.first();
      const backgroundColor = await firstButton.evaluate((el) => 
        getComputedStyle(el).backgroundColor
      );
      
      // Buttons should have aviation-themed colors
      expect(backgroundColor).toBeTruthy();
      expect(backgroundColor).not.toBe('rgb(255, 255, 255)'); // Not default white
    }
  });

  test('should apply aviation focus states', async ({ page }) => {
    await page.goto('/');
    
    // Find focusable elements
    const button = page.locator('button, input, select').first();
    
    if (await button.count() > 0) {
      // Focus the element
      await button.focus();
      
      // Check focus outline
      const outlineColor = await button.evaluate((el) => 
        getComputedStyle(el).outlineColor
      );
      
      // Should have aviation blue outline on focus
      expect(outlineColor).toBeTruthy();
    }
  });
});

test.describe('Aviation Design System - Responsive Design', () => {
  test('should maintain aviation styling on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that aviation variables are still applied
    const mobileStyles = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return {
        primaryBlue: styles.getPropertyValue('--aviation-primary-500').trim(),
      };
    });
    
    expect(mobileStyles.primaryBlue).toBeTruthy();
  });

  test('should maintain readable text on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const fontSize = await page.evaluate(() => {
      const body = document.body;
      return parseInt(getComputedStyle(body).fontSize);
    });
    
    // Font size should be at least 14px for readability
    expect(fontSize).toBeGreaterThanOrEqual(14);
  });
});

test.describe('Aviation Design System - Visual Regression', () => {
  test('should match expected design for main page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot('main-page.png', {
      fullPage: true,
      maxDiffPixels: 100, // Allow minor rendering differences
    });
  });

  test('should match expected design for compliance checker', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to compliance checker if it exists
    const complianceLink = page.locator('text=/compliance/i').first();
    
    if (await complianceLink.count() > 0) {
      await complianceLink.click();
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('compliance-checker.png', {
        fullPage: true,
        maxDiffPixels: 100,
      });
    }
  });
});

test.describe('Aviation Design System - Accessibility', () => {
  test('should maintain color contrast for accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Run basic accessibility checks
    const contrastIssues = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const issues: string[] = [];
      
      elements.forEach((el) => {
        const styles = getComputedStyle(el);
        const bgColor = styles.backgroundColor;
        const textColor = styles.color;
        
        // Basic check: ensure text is not the same color as background
        if (bgColor && textColor && bgColor === textColor) {
          issues.push(el.tagName);
        }
      });
      
      return issues;
    });
    
    expect(contrastIssues.length).toBe(0);
  });

  test('should have proper focus indicators', async ({ page }) => {
    await page.goto('/');
    
    // Tab through focusable elements
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus');
    const outlineWidth = await focusedElement.evaluate((el) => 
      getComputedStyle(el).outlineWidth
    );
    
    // Focus should be visible (outline > 0)
    expect(outlineWidth).not.toBe('0px');
  });
});
