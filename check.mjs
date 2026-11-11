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
  topicLens,
  topicDefaults,
  awardScore,
} from './dist/scoring.js'
const astraRefusals = () => models.find((m) => m.name === 'GPT-6 Astra').evidence.cyber.refusals
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
assert.equal(models.length, 34)
assert.equal(benchmarks.length, 26)
assert.equal(new Set(benchmarks.map((b) => b.id)).size, 26)
assert.equal(models.filter((m) => Object.keys(m.evidence).length).length, 30)
assert.equal(models.filter((m) => score(m, defaults).value !== null).length, 16)
for (const [name, mainValue, alternativeValue, setting] of [
  ['Claude Haiku 5.5', 76.4, 77.9, 'Max Effort'],
  ['Claude Sonnet 5.5', 88.9, 91.4, 'Max Effort'],
  ['Claude Opus 5.5', 89.3, 89.3, 'Thinking xHigh Effort'],
  ['GPT-6.1 Sol', 80.4, 80.7, 'xHigh Effort'],
]) {
  const model = models.find((m) => m.name === name)
  assert.equal(model.evidence.coding.value, mainValue)
  const alternative = model.alternatives.find(
    (a) => a.benchmark === 'coding' && a.agent === 'LiveBench evaluation · ' + setting,
  )
  assert.equal(alternative.value, alternativeValue)
  assert.equal(alternative.source, sources.coding)
  assert.equal(alternative.date, null)
}
assert.equal(Math.round(astraRefusals() * 10000), 5259)
assert.equal(models.find((m) => m.name === 'GPT-6 Sol').evidence.cyber.refusals, undefined)
const byName = (name) => models.find((m) => m.name === name)
for (const [name, coding, agentic] of [
  ['Claude Fable 5.1', 89.7, 74.2],
  ['Claude Fable 5.2', 79.2, 82.9],
  ['Claude Haiku 5.5', 77.6, 47.9],
  ['Claude Opus 5.5', 87.1, 72.8],
  ['Claude Sonnet 5.5', 77.2, 63.4],
  ['Gemini 3.8 Flash', 65.7, 16.5],
  ['Gemini 4 Argon', 85.7, 58.5],
  ['Gemini 4 Carbon', 91, 72.7],
  ['GPT-5.6 Terra', 84.2, 25.9],
  ['GPT-6 Astra', 87.5, 75.6],
  ['GPT-6 Luna', 70.8, 24.7],
  ['GPT-6.1 Sol', 82.1, 65.6],
  ['GPT-6.1 Terra', 89.2, 56.2],
  ['Grok 4.6', 76.7, 18.7],
  ['Grok 4.7', 73.1, 45.3],
  ['Kimi K3', 53.1, 36],
]) {
  assert.equal(byName(name).evidence.livebench2.value, coding, name)
  assert.equal(byName(name).evidence.lbagentic.value, agentic, name)
}
for (const id of ['livebench2', 'lbagentic'])
  assert.equal(models.filter((m) => m.evidence[id]).length, 16)
for (const id of ['livebench2old', 'lbagenticold']) {
  assert.equal(models.filter((m) => m.evidence[id]).length, 24)
  const alternatives = models.flatMap((m) => m.alternatives.filter((a) => a.benchmark === id))
  assert.equal(alternatives.length, 14)
  for (const a of alternatives) {
    assert.ok(a.version.includes('2026-10-25'))
    assert.equal(a.source, 'https://livebench.ai/data/20261025/table.csv')
  }
}
assert.equal(byName('GPT-6 Sol').evidence.livebench2, undefined)
assert.ok(byName('GPT-6 Sol').evidence.livebench2old)
assert.ok(byName('Claude Fable 5.2').evidence.livebench2.agent.includes('xhigh'))
for (const [name, value, uncertainty] of [
  ['Claude Opus 5.5', 65.8, 3.1],
  ['Claude Sonnet 5.5', 63.9, 3.0],
  ['GPT-6.1 Sol', 60.9, 3.0],
  ['GPT-6 Astra', 60.3, 2.8],
  ['Claude Fable 5.1', 57.6, 3.3],
  ['Claude Opus 5', 53.3, 3.1],
  ['GPT-6 Sol', 50.3, 3.2],
  ['Claude Fable 5', 44.8, 3.8],
  ['Grok 4.7', 38.8, 3.6],
  ['GPT-5.6 Sol', 38.5, 3.8],
  ['Claude Opus 4.8', 23.6, 3.6],
  ['GPT-5.6 Terra', 21.5, 3.3],
  ['Grok 4.6', 19.7, 3.1],
  ['Gemini 3.8 Flash', 18.2, 3.4],
  ['GPT-5.6 Luna', 17.6, 2.9],
  ['GPT-6 Luna', 15.2, 2.7],
  ['Grok 4.5', 12.4, 2.6],
  ['Claude Sonnet 5', 12.1, 3.0],
]) {
  assert.equal(byName(name).evidence.terminal41.value, value, name)
  assert.equal(byName(name).evidence.terminal41.uncertainty, uncertainty, name)
  assert.equal(byName(name).evidence.terminal41.date, null, name)
}
assert.equal(models.filter((m) => m.evidence.terminal41).length, 18)
assert.equal(models.filter((m) => m.evidence.terminal4).length, 18)
assert.ok(byName('Claude Fable 5.1').evidence.terminal41.agent.includes('xhigh'))
assert.equal(
  models.flatMap((m) => m.alternatives.filter((a) => a.benchmark === 'terminal41')).length,
  12,
)
assert.deepEqual(byName('Claude Fable 5.2').price, { input: 8, cached: 0.2, write: 10, output: 40 })
assert.deepEqual(byName('Gemini 4 Carbon').price, {
  input: 2,
  cached: 0.1,
  write: null,
  output: 10,
})
assert.equal(byName('Claude Fable 5.2').evidence.vibecode.value, 93.77)
assert.equal(byName('Claude Fable 5.2').evidence.vibecode.uncertainty, 1.15)
assert.equal(byName('Claude Fable 5.2').evidence.vibecode.date, '2026-11-08')
assert.equal(byName('Claude Fable 5.2').evidence.multimodal.value, 62.29)
assert.equal(byName('Claude Fable 5.2').evidence.migration, undefined)
assert.equal(byName('GPT-6 Astra').evidence.ioi.date, '2026-09-09')
assert.equal(byName('Claude Opus 5.5').evidence.vcb100.date, '2026-09-21')
assert.ok(byName('Claude Opus 5.5').evidence.vcb100.agent.includes('xhigh'))
assert.equal(byName('Gemini 4 Argon').evidence.multimodal.date, '2026-10-12')
assert.equal(byName('Grok 4.5').evidence.vibecode.date, null)
assert.ok(
  byName('Claude Fable 5.2').alternatives.some(
    (a) =>
      a.benchmark === 'migration' &&
      a.value === 83.27 &&
      a.uncertainty === 3.12 &&
      a.date === '2026-11-07' &&
      a.agent.includes('Pi') &&
      a.version.includes('v1.1'),
  ),
)
assert.equal(byName('Gemini 4 Carbon').evidence.vibecode.value, 89.06)
assert.equal(byName('Gemini 4 Carbon').evidence.vibecode.date, '2026-10-24')
assert.equal(byName('Claude Fable 5.1').evidence.vcb100.refusals, undefined)
assert.equal(byName('Claude Fable 5').evidence.migration.context, undefined)
assert.deepEqual(
  models.filter((m) => m.evidence.features).map((m) => [m.name, m.evidence.features.value]),
  [
    ['GPT-5.6 Sol', 12],
    ['Claude Opus 5', 40],
    ['Kimi K3', 7],
  ],
)
for (const m of models)
  for (const id of ['terminal4', 'terminal41'])
    for (const a of m.alternatives.filter((x) => x.benchmark === id))
      assert.notEqual(a.agent, m.evidence[id].agent, m.name)
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
  weights: { coding: 100, polyglot: 10, verified: 5 },
  selections: { polyglot: 'polyglot', features: 'features', security: 'nope' },
})
assert.equal('polyglot' in stale.weights, false)
assert.equal(stale.weights.verified, 5)
assert.equal(stale.selections.verified, 'multimodal')
assert.equal('polyglot' in stale.selections, false)
assert.equal(stale.selections.features, 'features')
assert.equal(stale.selections.security, 'cyber')
assert.equal(capabilities.length, 15)
assert.deepEqual(
  topicLens({ a: { value: 80 }, b: { value: null }, c: { value: 40 } }, { a: 1, b: 1, c: 2 }),
  { value: 160 / 3, coverage: 0.75, active: 3, present: 2 },
)
assert.equal(topicLens({ a: { value: 80 }, b: { value: null } }, { a: 1, b: 2 }).value, null)
assert.equal(topicLens({ a: { value: 80 } }, { a: 0 }).value, null)
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
assert.equal(old.selections.terminal, 'terminal41')
assert.equal(old.selections.pro, 'pro2')
assert.equal(old.selections.coding, 'livebench2')
assert.equal(old.weights.coding, 100)
const priorTerminal = migratePreferences({
  weights: { ...defaults, terminal: 42 },
  selections: { ...defaultSelections, terminal: 'terminal4' },
})
assert.equal(priorTerminal.selections.terminal, 'terminal41')
assert.equal(priorTerminal.weights.terminal, 42)
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
assert.equal(score(astra, { terminal: 1 }).value, 60.3)
assert.equal(
  score(astra, { terminal: 1 }, { ...defaultSelections, terminal: 'terminal' }).value,
  null,
)
assert.equal(
  score(
    models.find((m) => m.name === 'Claude Opus 4.8'),
    { optimization: 1 },
  ).value,
  47.1,
)
assert.equal(
  score(
    models.find((m) => m.name === 'GPT-5.6 Sol'),
    { program: 1 },
  ).value,
  1,
)
assert.ok(
  models
    .find((m) => m.name === 'GPT-5.6 Sol')
    .alternatives.some(
      (a) => a.benchmark === 'program' && a.value === 0.5 && a.agent.includes('default effort'),
    ),
)
const terra = models.find((m) => m.name === 'GPT-6.1 Terra')
assert.equal(score(terra, defaults).value, 89.2)
assert.equal(score(terra, { vibecode: 1 }).value, 84)
assert.equal(score(terra, { agentic: 1 }).value, 56.2)
assert.ok(
  terra.alternatives.some(
    (a) => a.benchmark === 'livebench2old' && a.value === 94.3 && a.agent.includes('2026-10-25'),
  ),
)
const flare = models.find((m) => m.name === 'GPT Image 2.5 Flare')
assert.equal(flare.utility, true)
assert.deepEqual(flare.price, { input: 5, cached: 1.25, write: null, output: 30 })
assert.ok(
  models
    .find((m) => m.name === 'Claude Sonnet 5.5')
    .alternatives.some(
      (a) =>
        a.benchmark === 'migration' &&
        a.value === 86.88 &&
        a.source === 'https://www.vals.ai/benchmarks/code-migration-v1-1',
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
assert.equal(score(argon, defaults).value, 85.7)
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
assert.equal(topicTable.get('claude-sonnet-5-5').building.parts[0].rank, 2)
const lensBest = awards(models, {}, defaultSelections, (m) =>
  awardScore(topicLens(topicTable.get(m.id), topicDefaults)),
).best
assert.deepEqual(lensBest, ['gemini-4-argon'])
assert.ok(!lensBest.includes('gpt-6-sol'))
assert.equal(awardScore({ value: 90, coverage: 0.6 }), null)
assert.equal(awardScore({ value: 90, coverage: 0.8 }), 90)
assert.equal(new Set(models.map((m) => m.id)).size, models.length)
for (const m of models) {
  for (const [id, e] of Object.entries(m.evidence)) {
    assert.ok(benchmarks.some((b) => b.id === id))
    assert.ok(e.value >= 0 && e.value <= 100)
    assert.equal(e.source, sources[id])
    assert.ok(e.agent)
    if (e.date !== null) assert.match(e.date, /^\d{4}-\d{2}-\d{2}$/, `${m.name} ${id}`)
    if (e.uncertainty !== undefined) assert.ok(e.uncertainty >= 0)
  }
  for (const a of m.alternatives) {
    assert.ok(benchmarks.some((b) => b.id === a.benchmark))
    assert.ok(a.source && a.agent)
    if (a.date !== null) assert.match(a.date, /^\d{4}-\d{2}-\d{2}$/, m.name)
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
const versionJson = JSON.parse(fs.readFileSync('dist/version.json', 'utf8'))
assert.equal(
  versionJson.released,
  released,
  'dist/version.json must match the data.js release stamp',
)
assert.match(versionJson.checked, /^\d{4}-\d{2}-\d{2}$/)
for (const field of ['models', 'withEvidence', 'defaultScored', 'benchmarks'])
  assert.ok(Number.isSafeInteger(versionJson[field]) && versionJson[field] >= 0, field)
assert.ok(versionJson.withEvidence <= versionJson.models)
assert.ok(versionJson.defaultScored <= versionJson.models)
const pendingRelease = process.argv.includes('--pending-release')
assert.ok(versionJson.checked <= checked, 'last release cannot have a later source-check date')
assert.ok(released >= versionJson.checked + 'T00:00:00Z', 'last release must not predate its check')
if (!pendingRelease) {
  assert.equal(
    versionJson.checked,
    checked,
    'dist/version.json must match the data.js checked date',
  )
  assert.ok(released >= checked + 'T00:00:00Z', 'released must not predate checked')
  assert.equal(versionJson.models, models.length)
  assert.equal(
    versionJson.withEvidence,
    models.filter((m) => Object.keys(m.evidence).length).length,
  )
  assert.equal(
    versionJson.defaultScored,
    models.filter((m) => score(m, defaults).value !== null).length,
  )
  assert.equal(versionJson.benchmarks, benchmarks.length)
}
assert.ok(/^[0-9a-f]{40}$/.test(versionJson.commit), 'dist/version.json must carry a commit hash')
const footer = fs.readFileSync('dist/index.html', 'utf8')
const checkedAt = new Date(`${checked}T00:00:00Z`)
const dateFormat = (month) =>
  checkedAt.toLocaleDateString('en-GB', { day: 'numeric', month, year: 'numeric', timeZone: 'UTC' })
assert.ok(footer.includes(`id="snapshotDate">${dateFormat('short')}`))
assert.ok(
  footer.includes(`sources checked ${dateFormat('long')} · released ${released.slice(11, 16)} UTC`),
  'dist/index.html footer must match the checked date and release time',
)
for (const asset of ['style.css', 'app.js', './data.js', './scoring.js', './expanded.js'])
  assert.ok(footer.includes(`${asset}?v=`), `index.html must version ${asset} (cache busting)`)
console.log(
  JSON.stringify({
    models: models.length,
    withEvidence: models.filter((m) => Object.keys(m.evidence).length).length,
    defaultScored: models.filter((m) => score(m, defaults).value !== null).length,
    benchmarks: benchmarks.length,
    checks: 'passed',
    ...(pendingRelease ? { release: 'pending' } : {}),
  }),
)
