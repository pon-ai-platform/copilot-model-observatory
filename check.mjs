import assert from 'node:assert/strict'
import { models, benchmarks, sources } from './dist/data.js'
import {
  score,
  defaults,
  validWeights,
  capabilities,
  defaultSelections,
  migratePreferences,
  awards,
} from './dist/scoring.js'
const example = {
  evidence: {
    coding: { value: 40 },
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
assert.equal(benchmarks.length, 18)
assert.equal(new Set(benchmarks.map((b) => b.id)).size, 18)
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
assert.equal(old.selections.terminal, 'terminal4')
assert.equal(old.selections.pro, 'pro2')
assert.equal(old.weights.coding, 100)
const choice = {
  evidence: { coding: { value: 80 }, algorithmic: { value: 20 }, qna: { value: 60 } },
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
  null,
)
assert.equal(
  score(
    models.find((m) => m.name === 'GPT-4o'),
    { optimization: 1 },
  ).value,
  0,
)
assert.equal(score(astra, { completion: 1 }).value, null)
assert.deepEqual(awards(models, { terminal: 1 }).best, [astra.id])
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
console.log(
  JSON.stringify({
    models: models.length,
    withEvidence: models.filter((m) => Object.keys(m.evidence).length).length,
    defaultScored: models.filter((m) => score(m, defaults).value !== null).length,
    checks: 'passed',
  }),
)
