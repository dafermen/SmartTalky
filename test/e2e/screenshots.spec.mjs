import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'

import { expect, test } from '@playwright/test'

const imageDirectory = resolve(process.cwd(), 'docs', 'images')

test.beforeAll(async () => {
  await mkdir(imageDirectory, { recursive: true })
})

test('captura la aplicación real para la documentación', async ({ browser }) => {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } })

  await desktop.goto('http://127.0.0.1:5180/')
  await expect(desktop.getByRole('heading', { level: 1 })).toBeVisible()
  await desktop.screenshot({
    path: resolve(imageDirectory, 'smarttalky-inicio-escritorio.png'),
    fullPage: true,
  })

  await desktop.getByRole('textbox', { name: /palabra o frase/i }).fill('hello')
  await desktop.getByRole('button', { name: 'Preparar pronunciación' }).click()
  await expect(desktop.getByLabel('Guía de pronunciación para hello')).toBeVisible()
  await desktop.screenshot({
    path: resolve(imageDirectory, 'smarttalky-guia-pronunciacion.png'),
    fullPage: true,
  })

  await desktop.goto('http://127.0.0.1:5180/docs')
  await expect(desktop.getByRole('heading', { level: 1 })).toBeVisible()
  await desktop.screenshot({
    path: resolve(imageDirectory, 'smarttalky-centro-documental.png'),
    fullPage: true,
  })
  await desktop.close()

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  })
  await mobile.goto('http://127.0.0.1:5180/')
  await expect(mobile.getByRole('heading', { level: 1 })).toBeVisible()
  await mobile.screenshot({
    path: resolve(imageDirectory, 'smarttalky-inicio-movil.png'),
    fullPage: true,
  })
  await mobile.close()
})
