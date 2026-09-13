import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'

const npmCli = join(dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js')
const apiBaseUrl = process.env.VITE_SMARTTALKY_API_BASE_URL ?? 'http://127.0.0.1:3000'
const result = spawnSync(
  process.execPath,
  [npmCli, 'run', 'build', '--workspace', '@smarttalky/web'],
  {
    env: {
      ...process.env,
      VITE_SMARTTALKY_API_BASE_URL: apiBaseUrl,
    },
    stdio: 'inherit',
  },
)

if (result.error !== undefined) throw result.error
process.exitCode = result.status ?? 1
