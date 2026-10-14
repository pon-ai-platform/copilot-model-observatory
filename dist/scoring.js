const equalWeighted = ['qna', 'tests', 'refactor']
export const capabilities = [
  { id: 'coding', short: 'General coding', benchmarks: ['livebench2'] },
  { id: 'qna', short: 'Codebase Q&A', benchmarks: ['qna'] },
  { id: 'tests', short: 'Test writing', benchmarks: ['tests'] },
  { id: 'refactor', short: 'Refactoring', benchmarks: ['refactor'] },
  { id: 'features', short: 'Implementing features', benchmarks: ['vcb100', 'features'] },
  { id: 'apps', short: 'Building apps', benchmarks: ['vibecode'] },
  { id: 'migration', short: 'Migrating code', benchmarks: ['migration'] },
  { id: 'algorithmic', short: 'Algorithmic coding', benchmarks: ['ioi'] },
  { id: 'security', short: 'Secure coding', benchmarks: ['cyber'] },
  { id: 'optimization', short: 'Making code faster', benchmarks: ['optimization'] },
  { id: 'program', short: 'Building programs', benchmarks: ['program'] },
  { id: 'terminal', short: 'Terminal tasks', benchmarks: ['terminal4'] },
  { id: 'agentic', short: 'Long-running agent work', benchmarks: ['lbagentic'] },
  { id: 'verified', short: 'Fixing bugs', benchmarks: ['multimodal', 'verified'] },
  { id: 'pro', short: 'Complex code changes', benchmarks: ['pro2', 'rebench'] },
]
export const defaults = Object.fromEntries(
  capabilities.map((c) => [c.id, c.id === 'coding' ? 100 : 0]),
)
export const defaultSelections = Object.fromEntries(
  capabilities.map((c) => [c.id, c.benchmarks[0]]),
)
export function validSelections(s) {
  return !!s && capabilities.every((c) => c.benchmarks.includes(s[c.id]))
}
export function migratePreferences(p) {
  // Ignore saved weights for capabilities that were removed (e.g. architecture).
  const weights = Object.fromEntries(
    capabilities.map((c) => [c.id, p?.weights?.[c.id] ?? defaults[c.id]]),
  )
  if (
    !validWeights(
      weights,
      capabilities.map((c) => c.id),
    )
  )
    return null
  const selections = {
    ...Object.fromEntries(
      capabilities.map((c) => [
        c.id,
        c.benchmarks.includes(p?.selections?.[c.id]) ? p.selections[c.id] : c.benchmarks[0],
      ]),
    ),
    coding: 'livebench2',
    terminal: 'terminal4',
    pro: 'pro2',
  }
  return validSelections(selections) ? { weights, selections, weighted: true } : null
}
export function score(model, weights, selections = defaultSelections) {
  const entries = Object.entries(weights).filter(([, w]) => Number.isFinite(w) && w > 0)
  const total = entries.reduce((s, [, w]) => s + w, 0)
  const covered = entries.filter(([id]) =>
    Number.isFinite(model.evidence[selections[id] || id]?.value),
  )
  const coverage = total ? covered.reduce((s, [, w]) => s + w, 0) / total : 0
  return {
    value:
      total && covered.length === entries.length
        ? entries.reduce((s, [id, w]) => s + model.evidence[selections[id] || id].value * w, 0) /
          total
        : null,
    coverage,
    active: entries.length,
    present: covered.length,
  }
}
export function validWeights(w, ids) {
  return (
    w &&
    typeof w === 'object' &&
    !Array.isArray(w) &&
    Object.keys(w).length === ids.length &&
    ids.every((id) => Number.isFinite(w[id]) && w[id] >= 0 && w[id] <= 100)
  )
}
export function workloadCost(model) {
  const p = model.price
  return Number.isFinite(p.input) && Number.isFinite(p.output)
    ? p.input * 0.05 + p.output * 0.01
    : null
}
export function awards(
  models,
  weights,
  selections = defaultSelections,
  scoreOf = (m) => score(m, weights, selections).value,
) {
  const eligible = models.filter((m) => !m.utility)
  const scored = eligible.map((m) => ({
    id: m.id,
    score: scoreOf(m),
    cost: workloadCost(m),
  }))
  const winners = (rows, metric, direction) => {
    const valid = rows.filter((r) => Number.isFinite(metric(r)))
    if (!valid.length) return []
    const best =
      direction === 'min' ? Math.min(...valid.map(metric)) : Math.max(...valid.map(metric))
    return valid.filter((r) => Math.abs(metric(r) - best) <= 1e-9).map((r) => r.id)
  }
  return {
    best: winners(scored, (r) => r.score, 'max'),
    cheapest: winners(scored, (r) => r.cost, 'min'),
    value: winners(
      scored,
      (r) => (r.score !== null && r.score > 0 && r.cost > 0 ? r.score / r.cost : null),
      'max',
    ),
  }
}
export const topics = [
  { id: 'writing', short: 'Writing code', benchmarks: ['livebench2', 'ioi', 'migration'] },
  {
    id: 'agents',
    short: 'Agents & issue fixing',
    benchmarks: ['terminal4', 'lbagentic', 'pro2', 'multimodal', 'rebench'],
  },
  { id: 'building', short: 'Building software', benchmarks: ['vibecode', 'program', 'vcb100'] },
  { id: 'codebase', short: 'Working in a codebase', benchmarks: ['qna', 'tests', 'refactor'] },
  { id: 'quality', short: 'Quality & security', benchmarks: ['cyber', 'optimization'] },
]
export const minTopicModels = 8
export const topicDefaults = Object.fromEntries(topics.map((t) => [t.id, 100]))
// Weighted mean of the topic standings a model has; needs at least half of the weight covered.
export function topicLens(result, weights) {
  const entries = Object.entries(weights).filter(([, w]) => Number.isFinite(w) && w > 0)
  const total = entries.reduce((s, [, w]) => s + w, 0)
  const covered = entries.filter(([id]) => result[id]?.value != null)
  const coveredWeight = covered.reduce((s, [, w]) => s + w, 0)
  return {
    value:
      total && coveredWeight * 2 >= total
        ? covered.reduce((s, [id, w]) => s + result[id].value * w, 0) / coveredWeight
        : null,
    coverage: total ? coveredWeight / total : 0,
    active: entries.length,
    present: covered.length,
  }
}
// Standing: 0 = lowest, 100 = best among selectable models with a result; ties share the midpoint.
export function standings(models, benchmarkId) {
  const scored = models.filter((m) => !m.utility && Number.isFinite(m.evidence[benchmarkId]?.value))
  if (scored.length < minTopicModels) return null
  const values = scored.map((m) => m.evidence[benchmarkId].value)
  const n = values.length
  return new Map(
    scored.map((m) => {
      const v = m.evidence[benchmarkId].value
      const below = values.filter((x) => x < v).length
      const above = values.filter((x) => x > v).length
      const equal = n - below - above
      return [m.id, { standing: (100 * (below + (equal - 1) / 2)) / (n - 1), rank: above + 1, n }]
    }),
  )
}
export function topicScores(models) {
  const table = Object.fromEntries(
    topics.flatMap((t) => t.benchmarks).map((id) => [id, standings(models, id)]),
  )
  return new Map(
    models.map((m) => [
      m.id,
      Object.fromEntries(
        topics.map((t) => {
          const eligible = t.benchmarks.filter((id) => table[id])
          const parts = eligible
            .filter((id) => table[id].has(m.id))
            .map((id) => ({ benchmark: id, ...table[id].get(m.id) }))
          const enough = !m.utility && parts.length > 0 && parts.length * 2 >= eligible.length
          return [
            t.id,
            {
              value: enough ? parts.reduce((s, p) => s + p.standing, 0) / parts.length : null,
              present: parts.length,
              eligible,
              parts,
            },
          ]
        }),
      ),
    ]),
  )
}
