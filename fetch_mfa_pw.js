const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  })
  const page = await context.newPage()

  console.log('Navigating...')
  await page.goto('https://cd.mfa.gov.tr/mission/mission-list?clickedId=3', {
    waitUntil: 'networkidle',
    timeout: 60000
  })

  console.log('Waiting for content to load...')
  // Wait for the specific container that holds missions, or just wait longer
  // The MFA site often loads data via DataTables or similar AJAX
  try {
    await page.waitForSelector('.table, .mission, .card, table', { timeout: 15000 })
    console.log('Found structured data container!')
  } catch (e) {
    console.log('Timeout waiting for selector, continuing anyway...')
  }

  await page.waitForTimeout(10000) // 10s extra wait

  const html = await page.content()
  const outPath = path.join(__dirname, 'mfa_missions_dynamic.html')
  fs.writeFileSync(outPath, html, 'utf-8')
  console.log('Saved to ' + outPath)

  await browser.close()
})()
