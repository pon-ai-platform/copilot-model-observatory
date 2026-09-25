import { models, benchmarks, sources, checked, released } from './data.js'
import {
  defaults,
  score,
  validWeights,
  awards,
  workloadCost,
  capabilities,
  defaultSelections,
  migratePreferences,
} from './scoring.js'
const $ = (id) => document.getElementById(id),
  ids = capabilities.map((b) => b.id)
const state = {
  weights: { ...defaults },
  selections: { ...defaultSelections },
  weighted: true,
  query: '',
  provider: '',
  view: 'engineering',
  sort: 'company',
  ascending: false,
}
try {
  const p = JSON.parse(
    localStorage.getItem('copilot-observatory-v2') ||
      localStorage.getItem('copilot-observatory-v1'),
  )
  if (p) {
    const migrated = migratePreferences(p)
    if (migrated) Object.assign(state, migrated)
  }
} catch {}
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )
const money = (n) =>
  n === null || n === undefined
    ? 'Not listed'
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 3,
      }).format(n)
const colors = {
  OpenAI: '#328375',
  Anthropic: '#bd775a',
  Google: '#487ccc',
  Microsoft: '#7373c2',
  'Moonshot AI': '#766295',
  xAI: '#667180',
}
function save() {
  try {
    localStorage.setItem(
      'copilot-observatory-v2',
      JSON.stringify({
        weights: state.weights,
        selections: state.selections,
        weighted: state.weighted,
      }),
    )
  } catch {
    $('localNote').textContent = 'Browser storage unavailable; preferences last for this visit.'
  }
}
function weightControls() {
  $('weights').innerHTML = capabilities
    .map(
      (b) =>
        `<div class="weight"><label for="weight-${b.id}">${b.short}<output id="out-${b.id}"></output></label><input type="range" min="0" max="100" step="1" id="weight-${b.id}" value="${state.weights[b.id]}" aria-label="${b.short} weight">${b.benchmarks.length > 1 ? `<select data-capability="${b.id}" aria-label="${b.short} benchmark">${b.benchmarks.map((id) => `<option value="${id}" ${state.selections[b.id] === id ? 'selected' : ''}>${benchmarks.find((x) => x.id === id).name}</option>`).join('')}</select>` : `<small>${benchmarks.find((x) => x.id === b.benchmarks[0]).name}</small>`}</div>`,
    )
    .join('')
  document.querySelectorAll('[data-capability]').forEach((el) =>
    el.addEventListener('change', () => {
      state.selections[el.dataset.capability] = el.value
      save()
      render()
    }),
  )
  ids.forEach((id) =>
    $(`weight-${id}`).addEventListener('input', (e) => {
      state.weights[id] = Number(e.target.value)
      save()
      render()
    }),
  )
}
const views = {
  engineering: ['coding', 'architecture', 'qna', 'tests', 'refactor'],
  coding: ['algorithmic', 'libraries', 'polyglot', 'completion'],
  quality: ['features', 'security', 'review', 'optimization'],
  issues: ['terminal4', 'verified', 'pro2'],
  history: ['terminal', 'pro'],
}
function visibleBenchmarks() {
  return views[state.view].map((id) => benchmarks.find((b) => b.id === id))
}
function sortValue(m) {
  if (state.sort === 'name') return m.name
  if (state.sort === 'price') return m.price.input
  if (state.sort === 'company') return score(m, state.weights, state.selections).value
  return m.evidence[state.sort]?.value
}
function compare(a, b) {
  const av = sortValue(a)
  const bv = sortValue(b)
  if (av == null && bv == null) return a.name.localeCompare(b.name)
  if (av == null) return 1
  if (bv == null) return -1
  const ordered = typeof av === 'string' ? av.localeCompare(bv) : av - bv
  return ordered * (state.ascending ? 1 : -1) || a.name.localeCompare(b.name)
}
function filtered() {
  return models
    .filter(
      (m) =>
        (!state.provider || m.provider === state.provider) &&
        `${m.name} ${m.provider}`.toLowerCase().includes(state.query.toLowerCase()),
    )
    .sort(compare)
}
let rowColumns = []
let winners = []
const badge = (kind, id, label, tip) =>
  winners[kind].includes(id)
    ? `<span class="award award-${kind}" title="${tip}">${label}${winners[kind].length > 1 ? ' · tied' : ''}</span>`
    : ''
function modelCell(m) {
  const markers =
    badge(
      'best',
      m.id,
      'Best in lens',
      'Highest complete lens score among the filtered selectable models. Point estimates only; uncertainty may overlap.',
    ) +
    badge(
      'cheapest',
      m.id,
      'Cheapest',
      `Lowest example cost among filtered selectable models: ${money(workloadCost(m))} for 50k uncached input + 10k output tokens.`,
    ) +
    badge(
      'value',
      m.id,
      'Best value',
      'Highest complete lens score per dollar of example token usage among filtered selectable models. Not measured cost per successful task.',
    )
  return (
    `<td><button class="model-button" data-model="${m.id}">${escape(m.name)}</button>` +
    `<div class="provider"><span class="provider-mark" style="--provider:${colors[m.provider]}"></span>${m.provider}` +
    `${m.utility ? '<span class="utility">Utility</span>' : ''}</div>` +
    `${markers ? `<div class="awards">${markers}</div>` : ''}</td>`
  )
}
function evidenceCell(b, m) {
  const e = m.evidence[b.id]
  if (!e) return '<td class="absent" title="No result captured in this snapshot">—</td>'
  const tip = escape(e.agent) + (e.uncertainty != null ? ' · published ±' + e.uncertainty : '')
  return (
    `<td title="${tip}">` +
    `<span class="benchmark-value">${e.value.toFixed(1)}<small>${b.unit || '%'}</small></span>` +
    `<div class="bar"><span style="width:${e.value}%"></span></div>` +
    '</td>'
  )
}
function companyCell(s) {
  if (!state.weighted) return ''
  return (
    `<td class="company">` +
    `<span class="benchmark-value">${s.value === null ? '—' : s.value.toFixed(1)}</span>` +
    `<span class="coverage">${s.present}/${s.active} active capabilities</span></td>`
  )
}
function priceCell(m) {
  const listed =
    m.price.input == null
      ? '<span class="absent">Not listed</span>'
      : `${money(m.price.input)} <span class="absent">/</span> ${money(m.price.output)}`
  return `<td class="price">${listed}</td>`
}
function rowFor(m) {
  const s = score(m, state.weights, state.selections)
  return (
    '<tr>' +
    modelCell(m) +
    rowColumns.map((b) => evidenceCell(b, m)).join('') +
    companyCell(s) +
    priceCell(m) +
    '</tr>'
  )
}
function heading(key, label, sub = '') {
  return `<th scope="col" aria-sort="${state.sort === key ? (state.ascending ? 'ascending' : 'descending') : 'none'}"><button data-sort="${key}">${label} ${state.sort === key ? (state.ascending ? '↑' : '↓') : '↕'}</button>${sub ? `<small>${sub}</small>` : ''}</th>`
}
function render() {
  const lensSorted = state.sort === 'company' && !state.ascending
  $('sortLens').setAttribute('aria-pressed', String(lensSorted))
  $('sortLens').textContent = lensSorted ? 'Sorted by company lens ↓' : 'Sort by company lens ↓'
  const total = Object.values(state.weights).reduce((a, b) => a + b, 0)
  ids.forEach((id) => {
    $(`out-${id}`).textContent = total ? `${((state.weights[id] / total) * 100).toFixed(1)}%` : '0%'
    $(`weight-${id}`).setAttribute(
      'aria-valuetext',
      `${total ? ((state.weights[id] / total) * 100).toFixed(1) : 0} percent normalized weight`,
    )
  })
  $('weightTotal').textContent = total
    ? 'Weights normalized to 100%'
    : 'Choose at least one capability'
  const columns = visibleBenchmarks()
  $('viewNote').textContent = columns
    .map(
      (b) =>
        `${b.short}: ${models.filter((m) => Number.isFinite(m.evidence[b.id]?.value)).length}/${models.length} models with evidence`,
    )
    .join(' · ')
  $('thead').innerHTML =
    '<tr>' +
    heading('name', 'Model', 'Provider / availability') +
    columns.map((b) => heading(b.id, b.short, b.subtitle)).join('') +
    (state.weighted ? heading('company', 'Company score', 'Exploratory · /100') : '') +
    heading('price', 'USD / 1M tokens', 'Input / output') +
    '</tr>'
  const selected = filtered()
  winners = awards(selected, state.weights, state.selections)
  rowColumns = columns
  $('count').textContent =
    `${selected.length} of ${models.length} models · ${selected.filter((m) => Object.keys(m.evidence).length).length} with captured evidence`
  $('tbody').innerHTML = selected.length
    ? selected.map(rowFor).join('')
    : `<tr><td class="empty" colspan="${columns.length + 2 + (state.weighted ? 1 : 0)}">No models match. Try another name or provider.</td></tr>`
  document.querySelectorAll('[data-sort]').forEach((b) =>
    b.addEventListener('click', () => {
      const key = b.dataset.sort
      state.ascending = state.sort === key ? !state.ascending : ['name', 'price'].includes(key)
      state.sort = key
      render()
    }),
  )
  document
    .querySelectorAll('[data-model]')
    .forEach((b) => b.addEventListener('click', () => details(b.dataset.model)))
}
function rates(p) {
  return `<div class="rates">${[
    ['input', 'Input'],
    ['output', 'Output'],
    ['cached', 'Cached input'],
    ['write', 'Cache write'],
  ]
    .map(
      ([key, label]) =>
        `<div><small>${label}</small><strong>${p[key] == null ? '—' : money(p[key])}</strong></div>`,
    )
    .join('')}</div>`
}
function evidenceCard(b, e, alternative = false) {
  return `<article class="evidence"><div class="evidence-head"><strong>${b.name}${alternative ? ' · alternative setup' : ''}</strong><span class="number">${e.value.toFixed(2)}${b.unit || '%'}</span></div><p>${escape(e.agent)}${e.uncertainty != null ? ` · published uncertainty ±${e.uncertainty.toFixed(2)} points` : ''}</p>${e.context ? `<p>${escape(e.context)}</p>` : ''}<p>${b.version} · Result date: ${e.date || 'not published in captured table'} · Checked ${checked}</p><a href="${e.source}" target="_blank" rel="noopener">Original result & methodology ↗</a></article>`
}
function details(id) {
  const m = models.find((m) => m.id === id)
  if (!m) return
  const s = score(m, state.weights, state.selections)
  $('detailBody').innerHTML =
    `<h2 id="detailTitle">${escape(m.name)}</h2><p class="detail-meta">${m.provider} · ${m.utility ? 'Background utility model' : 'Listed by GitHub Copilot'} · Checked ${checked} · Released ${released}</p><p class="detail-meta">Plan, IDE and organization policy can restrict access. <a href="${sources.availability}" target="_blank" rel="noopener">Availability matrix ↗</a></p>${m.notes.map((n) => `<p class="notes">${escape(n)}</p>`).join('')}<h3>Copilot pricing <span class="detail-meta">USD / 1M tokens</span></h3>${rates(m.price)}${m.long ? `<p class="detail-meta">Long-context tier: above ${m.long.threshold.toLocaleString()} input tokens</p>${rates(m.long)}` : ''}<p class="detail-meta">— means no separate rate listed. <a href="${sources.pricing}" target="_blank" rel="noopener">Official rate table ↗</a></p><h3>Published benchmark evidence</h3><p class="detail-meta">External agents, not Copilot. Uncertainty is reproduced as reported; no composite confidence interval is inferred.</p>${
      benchmarks
        .filter((b) => m.evidence[b.id])
        .map((b) => evidenceCard(b, m.evidence[b.id]))
        .join('') || '<p>No verified result captured for this model in this snapshot.</p>'
    }${m.alternatives
      .map((e) =>
        evidenceCard(
          benchmarks.find((b) => b.id === e.benchmark),
          e,
          true,
        ),
      )
      .join('')}<h3>Evidence gaps</h3><p class="detail-meta">${
      benchmarks
        .filter((b) => !m.evidence[b.id])
        .map((b) => escape(b.name))
        .join(' · ') || 'None in this catalog'
    }</p>${
      state.weighted
        ? `<h3>Company score: ${s.value === null ? 'not available' : s.value.toFixed(2) + '/100'}</h3><p class="detail-meta">${s.present} of ${s.active} weighted capabilities available. ${s.value === null ? 'Missing active results suppress the score.' : 'Exploratory average; different agents and budgets are not controlled.'}</p><p class="detail-meta">${ids
            .filter((id) => state.weights[id] > 0)
            .map(
              (id) =>
                `${capabilities.find((b) => b.id === id).short} (${benchmarks.find((b) => b.id === state.selections[id]).name}): weight ${state.weights[id]} × ${m.evidence[state.selections[id]]?.value ?? 'missing'}`,
            )
            .join(' + ')}</p>`
        : ''
    }`
  $('details').showModal()
}
for (const p of [...new Set(models.map((m) => m.provider))].sort())
  $('provider').add(new Option(p, p))
weightControls()
render()
document.querySelector('footer span').textContent =
  `Independent reference · sources checked ${new Date(checked + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })} · released ${released.slice(11, 16)} UTC ${released.slice(0, 10)}`
// Theme toggle: flips [data-theme="dark"] on <html>, persists the choice.
const applyTheme = (dark) => {
  document.documentElement.toggleAttribute('data-theme', dark)
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  const b = $('themeToggle')
  if (b) {
    b.setAttribute('aria-pressed', String(dark))
    b.textContent = dark ? 'Light mode' : 'Dark mode'
  }
}
applyTheme(document.documentElement.getAttribute('data-theme') === 'dark')
$('themeToggle').addEventListener('click', () => {
  const dark = document.documentElement.getAttribute('data-theme') !== 'dark'
  applyTheme(dark)
  try {
    localStorage.setItem('observatory-theme', dark ? 'dark' : 'light')
  } catch {}
})
const context = document.modelContext
if (context?.registerTool) {
  const lifecycle = new AbortController()
  const register = (tool) => {
    try {
      Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {})
    } catch {}
  }
  register({
    name: 'read_model_comparison',
    description: 'Read the displayed Copilot model comparison and current weighting preferences.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
    execute: () => ({
      checked,
      weights: state.weights,
      selections: state.selections,
      weighted: state.weighted,
      models: filtered().map((m) => ({
        name: m.name,
        price: m.price,
        evidence: m.evidence,
        companyScore: score(m, state.weights, state.selections),
      })),
    }),
  })
  register({
    name: 'configure_company_weights',
    description:
      'Set local browser weighting preferences and reveal the exploratory company score. Does not change enterprise policy.',
    inputSchema: {
      type: 'object',
      properties: {
        weights: {
          type: 'object',
          properties: Object.fromEntries(
            ids.map((id) => [id, { type: 'number', minimum: 0, maximum: 100 }]),
          ),
          required: ids,
          additionalProperties: false,
        },
      },
      required: ['weights'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false },
    execute: (input) => {
      if (!input || !validWeights(input.weights, ids))
        throw new Error('Provide all capability weights between 0 and 100.')
      state.weights = { ...input.weights }
      state.weighted = true
      save()
      weightControls()
      render()
      return {
        weights: state.weights,
        scoredModels: models.filter((m) => score(m, state.weights, state.selections).value !== null)
          .length,
      }
    },
  })
  addEventListener('pagehide', () => lifecycle.abort(), { once: true })
}
