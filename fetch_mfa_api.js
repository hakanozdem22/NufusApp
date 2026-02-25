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

  const interceptedData = []

  page.on('response', async (response) => {
    if (
      response.request().resourceType() === 'fetch' ||
      response.request().resourceType() === 'xhr'
    ) {
      try {
        const url = response.url()
        const json = await response.json()
        console.log('Intercepted JSON from:', url)
        interceptedData.push({ url, json })
      } catch (e) {
        // Not a JSON response or failed to read
      }
    }
  })

  console.log('Navigating...')
  await page.goto('https://cd.mfa.gov.tr/mission/mission-list?clickedId=3', {
    waitUntil: 'networkidle',
    timeout: 60000
  })
  await page.waitForTimeout(10000)

  const outPath = path.join(__dirname, 'mfa_api_data.json')
  fs.writeFileSync(outPath, JSON.stringify(interceptedData, null, 2), 'utf-8')
  console.log('Saved intercepted data to ' + outPath)

  await browser.close()
})()
