import assert from 'node:assert/strict'
import fs from 'node:fs'
import { models, benchmarks, sources, checked, released } from './dist/data.js'
import {
  score,
  defaults,
  validWeights,
  capabilities,
  defaultSelections,
  migratePreferences,
  awards,
  topics,
  standings,
  topicScores,
} from './dist/scoring.js'
const example = {
  evidence: {
    livebench2: { value: 40 },
    qna: { value: 60 },
    tests: { value: 30 },
    refactor: { value: 0 },
  },
}
assert.equal(score(example, defaults).value, 40)
assert.equal(
  score({ evidence: { qna: { value: 60 }, tests: { value: 30 } } }, defaults).value,
  null,
)
assert.equal(score(example, { qna: 75, tests: 25 }).value, 52.5)
assert.equal(score(example, { terminal: 1 }).value, null)
assert.equal(score(example, { qna: 1, terminal: 1 }).value, null)
assert.equal(score(example, { qna: 0 }).value, null)
assert.equal(score(example, { refactor: 1 }).value, 0)
assert.equal(score(example, { qna: 1, terminal: 1 }).coverage, 0.5)
assert.equal(
  validWeights(
    defaults,
    capabilities.map((b) => b.id),
  ),
  true,
)
assert.equal(
  validWeights(
    { ...defaults, qna: -1 },
    capabilities.map((b) => b.id),
  ),
  false,
)
assert.equal(benchmarks.length, 25)
assert.equal(new Set(benchmarks.map((b) => b.id)).size, 25)
for (const c of capabilities)
  for (const id of c.benchmarks)
    assert.ok(
      benchmarks.some((b) => b.id === id),
      id,
    )
for (const t of topics)
  for (const id of t.benchmarks)
    assert.ok(
      benchmarks.some((b) => b.id === id),
      id,
    )
const stale = migratePreferences({
  weights: { coding: 100, polyglot: 10 },
  selections: { polyglot: 'polyglot', features: 'features', security: 'nope' },
})
assert.equal(stale.weights.polyglot, 10)
assert.equal(stale.selections.polyglot, 'multilingual')
assert.equal(stale.selections.features, 'features')
assert.equal(stale.selections.security, 'cyber')
const old = migratePreferences({
  weights: {
    coding: 100,
    architecture: 0,
    qna: 100,
    tests: 0,
    refactor: 0,
    terminal: 20,
    verified: 0,
    pro: 20,
  },
  weighted: true,
})
assert.equal(old.weights.features, 0)
assert.equal('architecture' in old.weights, false)
assert.equal(old.selections.terminal, 'terminal4')
assert.equal(old.selections.pro, 'pro2')
assert.equal(old.selections.coding, 'livebench2')
assert.equal(old.weights.coding, 100)
const choice = {
  evidence: { livebench2: { value: 80 }, algorithmic: { value: 20 }, qna: { value: 60 } },
}
assert.equal(score(choice, { coding: 50, qna: 50 }).value, 70)
assert.equal(
  score(choice, { coding: 50, qna: 50 }, { ...defaultSelections, coding: 'algorithmic' }).value,
  40,
)
assert.equal(
  score(choice, { coding: 1 }, { ...defaultSelections, coding: 'libraries' }).value,
  null,
)
const astra = models.find((m) => m.name === 'GPT-6 Astra')
assert.equal(score(astra, { terminal: 1 }).value, 58.2)
assert.equal(
  score(astra, { terminal: 1 }, { ...defaultSelections, terminal: 'terminal' }).value,
  null,
)
assert.equal(
  score(
    models.find((m) => m.name === 'GPT-5.4'),
    { optimization: 1 },
  ).value,
  31.4,
)
assert.ok(
  models
    .find((m) => m.name === 'GPT-5.4')
    .alternatives.some(
      (a) => a.benchmark === 'optimization' && a.value === 25.5 && a.agent.includes('High'),
    ),
)
assert.equal(
  score(
    models.find((m) => m.name === 'GPT-4o'),
    { optimization: 1 },
  ).value,
  0,
)
assert.equal(score(astra, { completion: 1 }).value, null)
const argon = models.find((m) => m.name === 'Gemini 4 Argon')
assert.equal(score(argon, defaults).value, 89.7)
assert.equal(score(argon, { coding: 1 }, { ...defaultSelections, coding: 'coding' }).value, null)
assert.deepEqual(awards(models, { terminal: 1 }).best, ['claude-opus-5-5'])
// Topic standings: rank-based, ties share the midpoint, utility models and missing results excluded.
const fake = [10, 20, 20, 30, 40, 50, 60, 70].map((v, i) => ({
  id: 'm' + i,
  evidence: { x: { value: v } },
}))
const st = standings(
  [...fake, { id: 'u', utility: true, evidence: { x: { value: 99 } } }, { id: 'n', evidence: {} }],
  'x',
)
assert.equal(st.get('m0').standing, 0)
assert.equal(st.get('m7').standing, 100)
assert.equal(st.get('m1').standing, st.get('m2').standing)
assert.equal(st.get('m1').rank, 6)
assert.equal(st.get('u'), undefined)
assert.equal(st.get('n'), undefined)
assert.equal(standings(fake.slice(1), 'x'), null)
const topicTable = topicScores(models)
assert.equal(topicTable.get('gpt-4o').writing.value, null)
assert.equal(topicTable.get('mai-code-1-1-flash').writing.value, null)
for (const t of topics)
  for (const [, r] of topicTable)
    if (r[t.id].value !== null) {
      assert.ok(r[t.id].value >= 0 && r[t.id].value <= 100)
      assert.ok(r[t.id].present * 2 >= r[t.id].eligible.length)
    }
assert.ok(!topicTable.get('gemini-4-argon').agents.eligible.includes('rebench'))
assert.equal(topicTable.get('claude-sonnet-5-5').building.parts[0].rank, 1)
assert.equal(new Set(models.map((m) => m.id)).size, models.length)
for (const m of models) {
  for (const [id, e] of Object.entries(m.evidence)) {
    assert.ok(benchmarks.some((b) => b.id === id))
    assert.ok(e.value >= 0 && e.value <= 100)
    assert.equal(e.source, sources[id])
    assert.ok(e.agent)
  }
  for (const price of Object.values(m.price)) assert.ok(price === null || price >= 0)
}
// Release protocol: checked is a date, released is an ISO date-time, and both the
// version.json stamp and the footer stay in sync with dist/data.js.
assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(checked), 'checked must be YYYY-MM-DD')
assert.ok(
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(released),
  'released must be an ISO date-time with Z suffix',
)
assert.ok(released >= checked + 'T00:00:00Z', 'released must not predate checked')
const versionJson = JSON.parse(fs.readFileSync('dist/version.json', 'utf8'))
assert.equal(
  versionJson.released,
  released,
  'dist/version.json must match the data.js release stamp',
)
assert.equal(versionJson.checked, checked, 'dist/version.json must match the data.js checked date')
assert.ok(/^[0-9a-f]{40}$/.test(versionJson.commit), 'dist/version.json must carry a commit hash')
const footer = fs.readFileSync('dist/index.html', 'utf8')
assert.ok(
  footer.includes('released'),
  'dist/index.html footer must carry the release stamp (regenerated by node release.mjs)',
)
console.log(
  JSON.stringify({
    models: models.length,
    withEvidence: models.filter((m) => Object.keys(m.evidence).length).length,
    defaultScored: models.filter((m) => score(m, defaults).value !== null).length,
    benchmarks: benchmarks.length,
    checks: 'passed',
  }),
)
