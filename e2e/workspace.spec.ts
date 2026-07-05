import { test, expect } from '@playwright/test'

test.describe('Document Workspace', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => window.localStorage.clear())
    await page.reload()
  })

  test('creates a folder and document, then types in it', async ({ page }) => {
    // 1. Create a Folder
    await page.getByTitle('New Folder').click()
    
    // Playwright handles JS prompts natively by defining an event handler
    page.on('dialog', dialog => dialog.accept('Test Folder E2E'))
    
    // Now click to trigger the prompt
    await page.getByTitle('New Folder').click()

    // Wait for folder to appear
    await expect(page.getByText('Test Folder E2E')).toBeVisible()

    // 2. Create a Document
    await page.getByTitle('New Document').click()
    
    // Default title is Untitled Document
    const docItem = page.locator('[data-document-id]').filter({ hasText: 'Untitled Document' }).first()
    await expect(docItem).toBeVisible()

    // 3. Type text into the editor
    const editor = page.locator('.ProseMirror')
    await editor.click()
    await page.keyboard.type('Hello from E2E test!')
    
    // Verify text exists
    await expect(editor).toContainText('Hello from E2E test!')
  })
})
