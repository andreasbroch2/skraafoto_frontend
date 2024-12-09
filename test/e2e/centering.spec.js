import { test, expect } from '@playwright/test'
import { configuration } from './test-config.js'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate((conf) => {
    localStorage.setItem(conf.LOCAL_STORAGE_FIRST_TIME_VISITOR_KEY, false)
  }, configuration)
})

test('Change position when clicking in the viewport 1', async ({ page }) => {
  await page.goto('/?item=2023_84_40_2_0139_00061830', { waitUntil: 'networkidle' })
  await expect(page.locator('skraafoto-viewport')).toContainText('koordinat 722119 Ø, 6178801 N set fra nord.')
  await expect(page.getByTitle('Billede af området omkring koordinat 722119 Ø, 6178801 N set fra øst.')).toBeDefined()
})

test('Change position when clicking in the viewport 2', async ({ page }) => {
  await page.goto('/?item=2023_84_40_2_0139_00061830', { waitUntil: 'networkidle' })
  await page.locator('skraafoto-pin-tool button').click()
  await page.mouse.click(200,400)
  await page.waitForLoadState('networkidle')
  await expect(page.locator('skraafoto-viewport')).toContainText('koordinat 722102 Ø, 6178799 N set fra nord.')
  await expect(page.getByTitle('Billede af området omkring koordinat 722102 Ø, 6178799 N set fra øst.')).toBeDefined()
})