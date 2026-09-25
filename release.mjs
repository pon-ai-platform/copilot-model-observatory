// Release protocol: stamp the release timestamp across the site, verify gates, then deploy.
// Usage:
//   node release.mjs          — stamp + gates (no deploy)
//   node release.mjs --deploy  — stamp + gates + wrangler pages deploy (commits must already be pushed)
// The stamp writes:
//   - `released` export in dist/data.js (ISO date-time, UTC)
//   - footer span in dist/index.html (kept in sync; app.js renders the live value)
//   - dist/version.json (commit, released timestamp, counts) for programmatic checks
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('.')
const deploy = process.argv.includes('--deploy')

const run = (cmd) => execSync(cmd, { cwd: root, encoding: 'utf8' }).trim()
const fail = (msg) => {
  console.error('✘ ' + msg)
  process.exit(1)
}

// 1. Pre-flight: clean tree (README rule: source control and deployment archives correspond)
const status = run('git status --short')
if (status)
  fail(
    'working tree is dirty. Commit and push BEFORE stamping/deploying:\n' +
      status +
      '\n(README rule: the deployed archive must match a commit)',
  )
const head = run('git rev-parse HEAD')
const branch = run('git rev-parse --abbrev-ref HEAD')
run('git fetch origin main')
const remote = run('git rev-parse origin/main')
if (head !== remote)
  fail(`local HEAD ${head} is not pushed (origin/main is ${remote}). Push first.`)

// 2. Stamp the release timestamp (UTC, ISO date + time)
const now = new Date()
const released = now.toISOString().slice(0, 19) + 'Z' // e.g. 2026-09-25T10:45:30Z

const dataPath = path.join(root, 'dist', 'data.js')
let data = fs.readFileSync(dataPath, 'utf8')
if (data.includes('export const released =')) {
  data = data.replace(/export const released = '[^']*'/, `export const released = '${released}'`)
} else {
  data = data.replace(
    /(export const checked = '[^']*')/,
    "$1\n// Release stamp: set by `node release.mjs` — the date-time this exact commit was published.\nexport const released = '" +
      released +
      "'",
  )
}
fs.writeFileSync(dataPath, data)

// 3. Footer text in index.html (static fallback; app.js also renders the live stamp)
const htmlPath = path.join(root, 'dist', 'index.html')
let html = fs.readFileSync(htmlPath, 'utf8')
const stampHuman = now.toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})
html = html.replace(
  /(Independent reference · sources checked )[^<]+/,
  `$1${stampHuman} · released ${released.slice(11, 16)} UTC`,
)
fs.writeFileSync(htmlPath, html)

// 4. dist/version.json — machine-readable release identity
// Import the modules directly (check.mjs can't run yet: it would see the new
// data.js stamp against the old version.json).
const dataUrl = 'file://' + path.join(root, 'dist', 'data.js').replace(/\\/g, '/')
const { models, benchmarks, checked: checkedDate } = await import(dataUrl)
const { score, defaults } = await import(
  'file://' + path.join(root, 'dist', 'scoring.js').replace(/\\/g, '/')
)
const versionJson = {
  commit: head,
  branch,
  checked: checkedDate,
  released,
  models: models.length,
  withEvidence: models.filter((m) => Object.keys(m.evidence).length).length,
  defaultScored: models.filter((m) => score(m, defaults).value !== null).length,
  benchmarks: benchmarks.length,
}
fs.writeFileSync(
  path.join(root, 'dist', 'version.json'),
  JSON.stringify(versionJson, null, 2) + '\n',
)

// 5. Gates
console.log(run('npm run check'))
console.log(run('npm run format:check'))
console.log(run('node check.mjs'))

if (!deploy) {
  console.log(
    `✔ Stamped ${released} (commit ${head.slice(0, 7)}). Re-run with --deploy to publish.`,
  )
  process.exit(0)
}

// 6. Deploy (archive content equals the pushed commit + the generated stamp files)
const env = { ...process.env, CLOUDFLARE_ACCOUNT_ID: '7629d3d823c90f09e6b0f8b01d04462f' }
console.log(
  execSync(
    'npx wrangler pages deploy dist --project-name=copilot-model-observatory --branch=main',
    { cwd: root, encoding: 'utf8', env, stdio: ['ignore', 'pipe', 'pipe'] },
  ),
)
console.log(`✔ Released ${released} · commit ${head.slice(0, 7)} · version.json commit: ${head}`)
