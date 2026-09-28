/**
 * route-audit.mjs — Extensive static route test
 * Run: node route-audit.mjs
 *
 * Tests:
 *  1. Every route in App.jsx has a real component file that exists on disk
 *  2. Every component file imported in App.jsx exports the named symbol used
 *  3. Every navigate('/path') call across all .jsx files has a matching route
 *  4. Every sidebar path: entry across all Layout files has a matching route
 *  5. No orphaned page files (exist but no route)
 *  6. No duplicate route paths
 *  7. All ProtectedRoute roles reference valid role sets
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.join(__dirname, 'src')

const PASS = '\x1b[32m✅ PASS\x1b[0m'
const FAIL = '\x1b[31m❌ FAIL\x1b[0m'
const WARN = '\x1b[33m⚠️  WARN\x1b[0m'
const INFO = '\x1b[36mℹ️  INFO\x1b[0m'

let totalPass = 0, totalFail = 0, totalWarn = 0

function pass(msg) { console.log(`  ${PASS} ${msg}`); totalPass++ }
function fail(msg) { console.log(`  ${FAIL} ${msg}`); totalFail++ }
function warn(msg) { console.log(`  ${WARN} ${msg}`); totalWarn++ }
function info(msg) { console.log(`  ${INFO} ${msg}`) }
function heading(msg) { console.log(`\n\x1b[1m== ${msg} ==\x1b[0m`) }

// ─── helpers ──────────────────────────────────────────────────────────────────

function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8') } catch { return null }
}

function allJsx(dir) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) results.push(...allJsx(full))
    else if (entry.name.endsWith('.jsx')) results.push(full)
  }
  return results
}

// ─── 1. Parse App.jsx ────────────────────────────────────────────────────────

heading('1. Parsing App.jsx — registered routes')

const appPath = path.join(SRC, 'App.jsx')
const appSrc  = readFile(appPath)
if (!appSrc) { fail('App.jsx not found'); process.exit(1) }

// Extract all path="..." from Route elements
const routePaths = [...appSrc.matchAll(/path="([^"]+)"/g)].map(m => m[1])
console.log(`\n  Found ${routePaths.length} routes:\n`)
for (const r of routePaths) info(r)

// ─── 2. Duplicate routes ─────────────────────────────────────────────────────

heading('2. Duplicate route paths')

const seen = new Set(), dupes = []
for (const r of routePaths) {
  if (seen.has(r)) dupes.push(r)
  seen.add(r)
}
if (dupes.length === 0) pass('No duplicate routes')
else dupes.forEach(d => fail(`Duplicate route: ${d}`))

// ─── 3. Import → file existence ──────────────────────────────────────────────

heading('3. Imported component files exist on disk')

// Extract: import { Foo } from './pages/...'
const imports = [...appSrc.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g)]

const importMap = {} // symbol → absolute file path

for (const [, symbols, relPath] of imports) {
  // skip npm packages (non-relative imports)
  if (!relPath.startsWith('.')) continue
  // resolve relative to src/
  let absPath = path.resolve(SRC, relPath)
  if (!absPath.endsWith('.jsx') && !absPath.endsWith('.js')) absPath += '.jsx'
  const names = symbols.split(',').map(s => s.trim()).filter(Boolean)
  for (const name of names) importMap[name] = absPath
}

let allExist = true
for (const [symbol, filePath] of Object.entries(importMap)) {
  const exists = fs.existsSync(filePath)
  if (exists) pass(`${symbol} → ${path.relative(SRC, filePath)}`)
  else { fail(`${symbol} → MISSING FILE: ${path.relative(SRC, filePath)}`); allExist = false }
}

// ─── 4. Named export exists in file ──────────────────────────────────────────

heading('4. Named exports exist in component files')

for (const [symbol, filePath] of Object.entries(importMap)) {
  const src = readFile(filePath)
  if (!src) { fail(`Cannot read ${filePath}`); continue }
  const hasExport = src.includes(`export function ${symbol}`) ||
                    src.includes(`export const ${symbol}`) ||
                    src.includes(`export class ${symbol}`)
  if (hasExport) pass(`${symbol} exported correctly`)
  else fail(`${symbol} — no matching export in ${path.relative(SRC, filePath)}`)
}

// ─── 5. navigate() calls ─────────────────────────────────────────────────────

heading('5. navigate(\'/path\') calls match registered routes')

// Normalise dynamic segments: /company/candidates/123 → /company/candidates/:id
function matchRoute(navigatePath, routes) {
  const clean = navigatePath.split('?')[0] // strip query strings
  if (routes.includes(clean)) return true
  // try dynamic matching
  for (const r of routes) {
    const rParts = r.split('/')
    const nParts = clean.split('/')
    if (rParts.length !== nParts.length) continue
    const match = rParts.every((seg, i) => seg.startsWith(':') || seg === nParts[i])
    if (match) return true
  }
  return false
}

const allJsxFiles = allJsx(SRC)
const navigateCalls = new Map() // path → [files...]

for (const file of allJsxFiles) {
  const src = readFile(file)
  if (!src) continue
  const matches = [...src.matchAll(/navigate\(['"`]([^'"`${}]+)['"`$`]/g)]
  for (const [, p] of matches) {
    if (!p.startsWith('/')) continue // skip relative/back(-1) calls
    // strip any trailing template expression remnant
    const cleanPath = p.split('$')[0].split('?')[0]
    if (!cleanPath || cleanPath === '/') continue
    if (!navigateCalls.has(cleanPath)) navigateCalls.set(cleanPath, [])
    navigateCalls.get(cleanPath).push(path.relative(SRC, file))
  }
}

const uniqueNav = [...navigateCalls.keys()].sort()
for (const navPath of uniqueNav) {
  const files = navigateCalls.get(navPath)
  if (matchRoute(navPath, routePaths)) {
    pass(`navigate('${navPath}') — matched`)
  } else {
    fail(`navigate('${navPath}') — NO MATCHING ROUTE  [used in: ${files.join(', ')}]`)
  }
}

// ─── 6. Sidebar path: entries ────────────────────────────────────────────────

heading('6. Sidebar NAV path: entries match registered routes')

const sidebarPaths = new Map()

for (const file of allJsxFiles) {
  const src = readFile(file)
  if (!src) continue
  const matches = [...src.matchAll(/path:\s*['"]([^'"]+)['"]/g)]
  for (const [, p] of matches) {
    if (!p.startsWith('/')) continue
    if (!sidebarPaths.has(p)) sidebarPaths.set(p, [])
    sidebarPaths.get(p).push(path.relative(SRC, file))
  }
}

for (const [p, files] of [...sidebarPaths.entries()].sort()) {
  if (matchRoute(p, routePaths)) {
    pass(`sidebar path '${p}' — matched`)
  } else {
    fail(`sidebar path '${p}' — NO MATCHING ROUTE  [in: ${files.join(', ')}]`)
  }
}

// ─── 7. Orphaned page files ───────────────────────────────────────────────────

heading('7. Page files with no corresponding route (orphans)')

// Collect all files imported in App.jsx
const importedFiles = new Set(Object.values(importMap).map(f => path.normalize(f)))

// All .jsx files under pages/
const pageFiles = allJsx(path.join(SRC, 'pages'))

const KNOWN_NON_ROUTE = ['Layout', 'mockData', 'components']

for (const file of pageFiles) {
  const rel = path.relative(SRC, file)
  // Skip layouts and non-page helpers
  if (KNOWN_NON_ROUTE.some(k => file.includes(k))) continue
  if (importedFiles.has(path.normalize(file))) {
    pass(`${rel} — imported in App.jsx`)
  } else {
    warn(`${rel} — exists but NOT imported/routed in App.jsx`)
  }
}

// ─── 8. ProtectedRoute role arrays ───────────────────────────────────────────

heading('8. ProtectedRoute roles sanity check')

const VALID_ROLES = ['candidate','employer','company_admin','training_provider','admin','migration_agent']

const roleMatches = [...appSrc.matchAll(/ProtectedRoute\s+roles=\{([^}]+)\}/g)]
let rolesOk = true
for (const [, roleExpr] of roleMatches) {
  // Extract string literals from the expression
  const roleStrings = [...roleExpr.matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1])
  for (const role of roleStrings) {
    if (!VALID_ROLES.includes(role)) {
      fail(`Unknown role '${role}' in ProtectedRoute`)
      rolesOk = false
    }
  }
}
if (rolesOk) pass('All ProtectedRoute roles are valid')

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log('\n' + '═'.repeat(60))
console.log(`\x1b[1mROUTE AUDIT SUMMARY\x1b[0m`)
console.log('═'.repeat(60))
console.log(`  \x1b[32m✅ Passed : ${totalPass}\x1b[0m`)
console.log(`  \x1b[31m❌ Failed : ${totalFail}\x1b[0m`)
console.log(`  \x1b[33m⚠️  Warned : ${totalWarn}\x1b[0m`)
console.log('═'.repeat(60))

if (totalFail > 0) {
  console.log('\n\x1b[31mAudit FAILED — fix the issues above.\x1b[0m')
  process.exit(1)
} else if (totalWarn > 0) {
  console.log('\n\x1b[33mAudit passed with warnings.\x1b[0m')
} else {
  console.log('\n\x1b[32mAll route checks passed!\x1b[0m')
}
