const equalWeighted = ['qna', 'tests', 'refactor']
export const capabilities = [
  { id: 'coding', short: 'General coding', benchmarks: ['coding'] },
  { id: 'architecture', short: 'Architecture', benchmarks: ['architecture'] },
  { id: 'qna', short: 'Codebase Q&A', benchmarks: ['qna'] },
  { id: 'tests', short: 'Test writing', benchmarks: ['tests'] },
  { id: 'refactor', short: 'Refactoring', benchmarks: ['refactor'] },
  { id: 'features', short: 'Implementing features', benchmarks: ['features'] },
  { id: 'security', short: 'Secure coding', benchmarks: ['security'] },
  { id: 'review', short: 'Code review', benchmarks: ['review'] },
  { id: 'polyglot', short: 'Multilingual editing', benchmarks: ['polyglot', 'multilingual'] },
  { id: 'optimization', short: 'Making code faster', benchmarks: ['optimization'] },
  { id: 'completion', short: 'Cross-file completion', benchmarks: ['completion'] },
  { id: 'program', short: 'Building programs', benchmarks: ['program'] },
  { id: 'terminal', short: 'Terminal tasks', benchmarks: ['terminal4'] },
  { id: 'verified', short: 'Fixing bugs', benchmarks: ['verified'] },
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
  const weights = { ...defaults, ...p?.weights }
  if (
    !validWeights(
      weights,
      capabilities.map((c) => c.id),
    )
  )
    return null
  const selections = {
    ...defaultSelections,
    ...p?.selections,
    coding: 'coding',
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
export function awards(models, weights, selections = defaultSelections) {
  const eligible = models.filter((m) => !m.utility)
  const scored = eligible.map((m) => ({
    id: m.id,
    score: score(m, weights, selections).value,
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
