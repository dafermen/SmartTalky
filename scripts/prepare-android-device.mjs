import { accessSync, constants } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const candidates = [
  process.env.ANDROID_HOME,
  process.env.ANDROID_SDK_ROOT,
  process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'Android', 'Sdk') : undefined,
].filter(Boolean)
const executable = process.platform === 'win32' ? 'adb.exe' : 'adb'
const adb = candidates
  .map((root) => join(root, 'platform-tools', executable))
  .find((path) => {
    try {
      accessSync(path, constants.X_OK)
      return true
    } catch {
      return false
    }
  })

if (adb === undefined) {
  throw new Error(
    'ADB no está instalado. Complete Android SDK Platform-Tools desde Android Studio.',
  )
}

const devices = spawnSync(adb, ['devices'], { encoding: 'utf8' })
if (devices.status !== 0) throw new Error('ADB no pudo enumerar dispositivos.')
const authorized = devices.stdout
  .split(/\r?\n/)
  .slice(1)
  .filter((line) => /\sdevice$/.test(line))

if (authorized.length !== 1) {
  throw new Error(
    `Se esperaba un dispositivo Android autorizado y se encontraron ${authorized.length}.`,
  )
}

const reverse = spawnSync(adb, ['reverse', 'tcp:3000', 'tcp:3000'], {
  stdio: 'inherit',
})
if (reverse.status !== 0) throw new Error('No fue posible preparar adb reverse.')

console.log('Dispositivo Android autorizado y puerto 3000 enlazado con el laptop.')
