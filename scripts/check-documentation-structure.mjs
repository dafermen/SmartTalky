import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const requiredPaths = [
  '.env.example',
  '.github/ISSUE_TEMPLATE/bug_report.md',
  '.github/ISSUE_TEMPLATE/config.yml',
  '.github/ISSUE_TEMPLATE/feature_request.md',
  '.github/pull_request_template.md',
  '.github/workflows/ci.yml',
  'AGENTS.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'CURRENT_STATUS.md',
  'README.md',
  'SECURITY.md',
  'THIRD_PARTY_LICENSES.md',
  'docs/API.md',
  'docs/ARCHITECTURE.md',
  'docs/DEPLOYMENT.md',
  'docs/DEVELOPMENT.md',
  'docs/OPERATIONS.md',
  'docs/SECURITY.md',
  'docs/TESTING.md',
  'docs/TROUBLESHOOTING.md',
  'docs/adr',
  'docs/deployment-gates.json',
  'package-lock.json',
  'package.json',
]

const missingPaths = requiredPaths.filter(
  (relativePath) => !existsSync(resolve(root, relativePath)),
)

if (missingPaths.length > 0) {
  throw new Error(
    `Faltan elementos obligatorios de documentación:\n${missingPaths.join('\n')}`,
  )
}

const readme = readFileSync(resolve(root, 'README.md'), 'utf8')
const licenseExists = existsSync(resolve(root, 'LICENSE'))
const pendingLicenseIsExplicit =
  readme.includes('licencia sigue pendiente') && readme.includes('archivo `LICENSE`')

if (!licenseExists && !pendingLicenseIsExplicit) {
  throw new Error(
    'Falta LICENSE y README.md no documenta explícitamente la decisión pendiente.',
  )
}

console.log(
  `Estructura documental verificada: ${requiredPaths.length} elementos obligatorios; ` +
    (licenseExists
      ? 'LICENSE presente.'
      : 'LICENSE pendiente y declarado explícitamente.'),
)
