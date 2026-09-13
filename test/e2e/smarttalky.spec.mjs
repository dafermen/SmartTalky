import { expect, test } from '@playwright/test'

test('completa el recorrido principal con el backend simulado', async ({ page }) => {
  const consoleErrors = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })

  await page.goto('/')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /haz que el inglés suene más cercano/i,
    }),
  ).toBeVisible()

  await page.getByRole('textbox', { name: /palabra o frase/i }).fill('hello')
  await page.getByRole('button', { name: 'Preparar pronunciación' }).click()

  await expect(page.getByLabel('Guía de pronunciación para hello')).toBeVisible()
  await expect(page.getByText('/həˈloʊ/')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Elige cómo escuchar' })).toBeVisible()
  await expect(
    page.getByRole('button', { name: /escuchar pronunciación natural/i }),
  ).toBeVisible()
  expect(consoleErrors).toEqual([])
})

test('abre y busca en el centro documental', async ({ page }) => {
  await page.goto('/docs')
  await expect(
    page.getByRole('heading', { level: 1, name: /documentación de smarttalky/i }),
  ).toBeVisible()

  await page.getByRole('searchbox', { name: 'Buscar documentación' }).fill('despliegue')
  await expect(page.getByRole('status')).toContainText(/documentos? encontrados?/i)
  await page
    .getByRole('link', { name: /^Despliegue\b/ })
    .first()
    .click()
  await expect(page.getByRole('heading', { level: 1, name: /despliegue/i })).toBeVisible()
})

test('publica las capturas dentro del lector documental', async ({ page }) => {
  await page.goto('/docs/demo')
  const screenshot = page.getByRole('img', {
    name: 'Guía de pronunciación completa para hello',
  })

  await expect(screenshot).toBeVisible()
  await expect(screenshot).toHaveAttribute(
    'src',
    '/documentacion/docs/images/smarttalky-guia-pronunciacion.png',
  )
  expect(await screenshot.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0)
})

test('mantiene el contenido dentro del viewport', async ({ page }) => {
  await page.goto('/')
  const overflow = await page.evaluate(
    () =>
      globalThis.document.documentElement.scrollWidth -
      globalThis.document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
