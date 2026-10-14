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
  topics,
  topicScores,
  minTopicModels,
  topicDefaults,
  topicLens,
  awardScore,
  awardCoverage,
} from './scoring.js'
const $ = (id) => document.getElementById(id),
  ids = capabilities.map((b) => b.id),
  topicIds = topics.map((t) => t.id)
const state = {
  mode: 'topics',
  topicWeights: { ...topicDefaults },
  weights: { ...defaults },
  selections: { ...defaultSelections },
  weighted: true,
  query: '',
  provider: '',
  view: 'overview',
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
    state.mode = p.mode === 'advanced' ? 'advanced' : 'topics'
    if (validWeights(p.topicWeights, topicIds)) state.topicWeights = { ...p.topicWeights }
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
        mode: state.mode,
        topicWeights: state.topicWeights,
        weights: state.weights,
        selections: state.selections,
        weighted: state.weighted,
      }),
    )
  } catch {
    $('localNote').textContent = 'Browser storage unavailable; preferences last for this visit.'
  }
}
const topicMode = () => state.mode === 'topics'
const lensItems = () => (topicMode() ? topics : capabilities)
const lensWeights = () => (topicMode() ? state.topicWeights : state.weights)
function weightControls() {
  const weights = lensWeights()
  $('weights').innerHTML = lensItems()
    .map(
      (b) =>
        `<div class="weight"><label for="weight-${b.id}">${b.short}<output id="out-${b.id}"></output></label><input type="range" min="0" max="100" step="1" id="weight-${b.id}" value="${weights[b.id]}" aria-label="${b.short} weight">${topicMode() ? `<small class="topic-desc" title="Benchmarks: ${b.benchmarks.map((id) => benchmarks.find((x) => x.id === id).name).join(' · ')}">${b.description}</small>` : b.benchmarks.length > 1 ? `<select data-capability="${b.id}" aria-label="${b.short} benchmark">${b.benchmarks.map((id) => `<option value="${id}" ${state.selections[b.id] === id ? 'selected' : ''}>${benchmarks.find((x) => x.id === id).name}</option>`).join('')}</select>` : `<small>${benchmarks.find((x) => x.id === b.benchmarks[0]).name}</small>`}</div>`,
    )
    .join('')
  $('lensMode').textContent = topicMode()
    ? 'Advanced: weight individual benchmarks'
    : '← Back to topic weights'
  $('lensHelp').textContent = topicMode()
    ? 'Each topic score is the average standing (0–100) of a model among the selectable Copilot models on that topic’s benchmarks — the same scores as the Overview. Topics a model has no score for are left out; it needs scores covering at least half of the weight.'
    : 'Weight each capability once. Each uses the benchmark named below its slider, on its raw scale. Every active capability needs the selected result. New capabilities start at 0%.'
  document.querySelectorAll('[data-capability]').forEach((el) =>
    el.addEventListener('change', () => {
      state.selections[el.dataset.capability] = el.value
      save()
      render()
    }),
  )
  lensItems().forEach(({ id }) =>
    $(`weight-${id}`).addEventListener('input', (e) => {
      weights[id] = Number(e.target.value)
      save()
      render()
    }),
  )
}
const views = {
  engineering: ['livebench2', 'qna', 'tests', 'refactor'],
  coding: ['ioi', 'migration', 'multilingual'],
  building: ['vibecode', 'vcb100', 'features', 'program'],
  quality: ['cyber', 'review', 'optimization'],
  issues: ['terminal4', 'lbagentic', 'pro2', 'multimodal', 'verified', 'rebench'],
  history: ['coding', 'terminal', 'pro'],
}
const topicTable = topicScores(models)
const overview = () => state.view === 'overview'
const lens = (m) =>
  topicMode()
    ? topicLens(topicTable.get(m.id), state.topicWeights)
    : score(m, state.weights, state.selections)
function visibleBenchmarks() {
  return views[state.view].map((id) => benchmarks.find((b) => b.id === id))
}
function sortValue(m) {
  if (state.sort === 'name') return m.name
  if (state.sort === 'price') return m.price.input
  if (state.sort === 'company') return lens(m).value
  if (state.sort.startsWith('topic:')) return topicTable.get(m.id)[state.sort.slice(6)].value
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
      `Highest lens score among the filtered selectable models with scores covering at least ${awardCoverage * 100}% of the weight. Point estimates only; uncertainty may overlap.`,
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
      `Highest lens score (with at least ${awardCoverage * 100}% of the weight covered) per dollar of example token usage among filtered selectable models. Not measured cost per successful task.`,
    )
  return (
    `<td><button class="model-button" data-model="${m.id}">${escape(m.name)}</button>` +
    `<div class="provider"><span class="provider-mark" style="--provider:${colors[m.provider]}"></span>${m.provider}` +
    `${m.utility ? '<span class="utility">Utility</span>' : ''}</div>` +
    `${markers ? `<div class="awards">${markers}</div>` : ''}</td>`
  )
}
const refusalLimit = 0.25
const refusalNote = (e) =>
  e?.refusals >= refusalLimit
    ? `${(e.refusals * 100).toFixed(0)}% of tasks refused by the provider and scored as failures — the score reflects safety policy as much as skill`
    : null
const flag = (notes) =>
  notes.length ? `<span class="refusal-flag" title="${escape(notes.join(' · '))}">⚠</span>` : ''
function evidenceCell(b, m) {
  const e = m.evidence[b.id]
  if (!e) return '<td class="absent" title="No result captured in this snapshot">—</td>'
  const tip = escape(e.agent) + (e.uncertainty != null ? ' · published ±' + e.uncertainty : '')
  return (
    `<td title="${tip}">` +
    `<span class="benchmark-value">${e.value.toFixed(1)}<small>${b.unit || '%'}</small></span>` +
    flag([refusalNote(e)].filter(Boolean)) +
    '</td>'
  )
}
function companyCell(s) {
  if (!state.weighted) return ''
  return (
    `<td class="company" title="${s.present} of ${s.active} weighted ${topicMode() ? 'topics' : 'capabilities'} available">` +
    `<span class="benchmark-value">${s.value === null ? '—' : `${s.value.toFixed(1)}<small>/100</small>`}</span></td>`
  )
}
function priceCell(m) {
  const listed =
    m.price.input == null
      ? '<span class="absent">Not listed</span>'
      : `${money(m.price.input)} <span class="absent">/</span> ${money(m.price.output)}`
  return `<td class="price">${listed}</td>`
}
function topicCell(t, m) {
  const r = topicTable.get(m.id)[t.id]
  if (r.value === null)
    return `<td class="absent" title="${m.utility ? 'Utility model: not ranked' : `Limited evidence: ${r.present} of ${r.eligible.length} benchmarks`}">—</td>`
  const notes = r.parts
    .map((p) => {
      const note = refusalNote(m.evidence[p.benchmark])
      return note && `${benchmarks.find((b) => b.id === p.benchmark).name}: ${note}`
    })
    .filter(Boolean)
  return (
    `<td><button class="topic-button" data-topic="${t.id}" data-topic-model="${m.id}" title="Based on ${r.present} of ${r.eligible.length} benchmarks — click for the raw results">` +
    `<span class="benchmark-value">${r.value.toFixed(1)}<small>/100</small></span></button>${flag(notes)}</td>`
  )
}
function rowFor(m) {
  const s = lens(m)
  return (
    '<tr>' +
    modelCell(m) +
    (overview()
      ? topics.map((t) => topicCell(t, m)).join('')
      : rowColumns.map((b) => evidenceCell(b, m)).join('')) +
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
  const weights = lensWeights()
  const total = Object.values(weights).reduce((a, b) => a + b, 0)
  lensItems().forEach(({ id }) => {
    $(`out-${id}`).textContent = total ? `${((weights[id] / total) * 100).toFixed(1)}%` : '0%'
    $(`weight-${id}`).setAttribute(
      'aria-valuetext',
      `${total ? ((weights[id] / total) * 100).toFixed(1) : 0} percent normalized weight`,
    )
  })
  $('weightTotal').textContent = total
    ? 'Weights normalized to 100%'
    : 'Choose at least one capability'
  const columns = overview() ? [] : visibleBenchmarks()
  const showCompany = state.weighted
  $('viewNote').textContent = overview()
    ? `Topic score = average standing (0–100) across the topic's benchmarks, relative to the other selectable Copilot models — not an absolute skill score. A benchmark counts once at least ${minTopicModels} models have a result; a topic needs results on at least half of its benchmarks. Click a score for the raw results.`
    : columns
        .map(
          (b) =>
            `${b.short}: ${models.filter((m) => Number.isFinite(m.evidence[b.id]?.value)).length}/${models.length} models with evidence`,
        )
        .join(' · ')
  $('thead').innerHTML =
    '<tr>' +
    heading('name', 'Model', 'Provider / availability') +
    (overview()
      ? topics.map((t) => heading('topic:' + t.id, t.short, 'Standing /100')).join('')
      : columns.map((b) => heading(b.id, b.short, b.subtitle)).join('')) +
    (showCompany ? heading('company', 'Company score', 'Exploratory · /100') : '') +
    heading('price', 'USD / 1M tokens', 'Input / output') +
    '</tr>'
  const selected = filtered()
  winners = awards(selected, state.weights, state.selections, (m) => awardScore(lens(m)))
  rowColumns = columns
  $('count').textContent =
    `${selected.length} of ${models.length} models · ${selected.filter((m) => Object.keys(m.evidence).length).length} with captured evidence`
  $('tbody').innerHTML = selected.length
    ? selected.map(rowFor).join('')
    : `<tr><td class="empty" colspan="${(overview() ? topics.length : columns.length) + 2 + (showCompany ? 1 : 0)}">No models match. Try another name or provider.</td></tr>`
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
  document
    .querySelectorAll('[data-topic]')
    .forEach((b) =>
      b.addEventListener('click', () => topicDetails(b.dataset.topicModel, b.dataset.topic)),
    )
}
function topicDetails(modelId, topicId) {
  const m = models.find((x) => x.id === modelId)
  const t = topics.find((x) => x.id === topicId)
  const r = topicTable.get(modelId)[topicId]
  const rows = t.benchmarks
    .map((id) => {
      const b = benchmarks.find((x) => x.id === id)
      const e = m.evidence[id]
      const p = r.parts.find((x) => x.benchmark === id)
      const status = !r.eligible.includes(id)
        ? `Not counted: fewer than ${minTopicModels} models have a result.`
        : p
          ? `Rank ${p.rank} of ${p.n} · standing ${p.standing.toFixed(0)}/100`
          : 'No result for this model.'
      return `<article class="evidence"><div class="evidence-head"><strong>${b.name}</strong><span class="number">${e ? e.value.toFixed(2) + (b.unit || '%') : '—'}</span></div><p>${status}</p>${refusalNote(e) ? `<p class="notes">⚠ ${refusalNote(e)}.</p>` : ''}${e ? `<p>${escape(e.agent)}${e.uncertainty != null ? ` · published uncertainty ±${e.uncertainty.toFixed(2)} points` : ''}</p>${e.context ? `<p>${escape(e.context)}</p>` : ''}` : ''}<p>${b.version}</p><a href="${sources[id]}" target="_blank" rel="noopener">Original result & methodology ↗</a></article>`
    })
    .join('')
  $('detailBody').innerHTML =
    `<h2 id="detailTitle">${escape(m.name)} · ${t.short}</h2><p class="detail-meta">${t.description}</p><p class="detail-meta">Topic score ${r.value === null ? 'not available' : r.value.toFixed(0) + '/100'} · ${r.present} of ${r.eligible.length} counted benchmarks. Standing is relative to the other selectable Copilot models with a result (100 = best, 0 = lowest); it is not an absolute skill score. External agents and settings, not Copilot.</p>${rows}<p><button class="model-button" data-detail-model="${m.id}">All evidence for ${escape(m.name)} →</button></p>`
  $('detailBody')
    .querySelector('[data-detail-model]')
    .addEventListener('click', () => details(m.id))
  if (!$('details').open) $('details').showModal()
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
  const s = lens(m)
  const lensParts = topicMode()
    ? topicIds
        .filter((id) => state.topicWeights[id] > 0)
        .map(
          (id) =>
            `${topics.find((t) => t.id === id).short}: weight ${state.topicWeights[id]} × standing ${topicTable.get(m.id)[id].value?.toFixed(0) ?? 'missing'}`,
        )
    : ids
        .filter((id) => state.weights[id] > 0)
        .map(
          (id) =>
            `${capabilities.find((b) => b.id === id).short} (${benchmarks.find((b) => b.id === state.selections[id]).name}): weight ${state.weights[id]} × ${m.evidence[state.selections[id]]?.value ?? 'missing'}`,
        )
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
        ? `<h3>Company score: ${s.value === null ? 'not available' : s.value.toFixed(2) + '/100'}</h3><p class="detail-meta">${s.present} of ${s.active} weighted ${topicMode() ? 'topics (relative standing among selectable Copilot models)' : 'capabilities'} available. ${s.value === null ? 'Missing active results suppress the score.' : 'Exploratory average; different agents and budgets are not controlled.'}</p><p class="detail-meta">${lensParts.join(' + ')}</p>`
        : ''
    }`
  if (!$('details').open) $('details').showModal()
}
for (const p of [...new Set(models.map((m) => m.provider))].sort())
  $('provider').add(new Option(p, p))
weightControls()
render()
document.querySelector('footer span').textContent =
  `Independent reference · sources checked ${new Date(checked + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })} · released ${released.slice(11, 16)} UTC ${released.slice(0, 10)}`
const snapshotBadge = document.getElementById('snapshotDate')
if (snapshotBadge)
  snapshotBadge.textContent = new Date(checked + 'T00:00:00Z')
    .toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
    .replace(/^(\d+) (\w{3})\w* (\d+)$/, '$1 $2 $3')
$('sourceCards').innerHTML = benchmarks
  .map(
    (b) =>
      `<article class="source-card"><a href="${sources[b.id]}" target="_blank" rel="noopener">${b.name} ↗</a><p>${b.description}</p><p class="source-coverage">${models.filter((m) => Number.isFinite(m.evidence[b.id]?.value)).length} of ${models.length} models with evidence${models.some((m) => !m.utility && Number.isFinite(m.evidence[b.id]?.value)) ? '' : ' · no selectable-model coverage'}</p><p>${b.note}</p><small>${b.version} · checked ${checked}</small></article>`,
  )
  .join('')
$('sortLens').addEventListener('click', () => {
  state.sort = 'company'
  state.ascending = false
  state.weighted = true
  save()
  render()
})
$('reset').addEventListener('click', () => {
  state.topicWeights = { ...topicDefaults }
  state.weights = { ...defaults }
  state.selections = { ...defaultSelections }
  save()
  weightControls()
  render()
})
$('lensMode').addEventListener('click', () => {
  state.mode = topicMode() ? 'advanced' : 'topics'
  save()
  weightControls()
  render()
})
$('search').addEventListener('input', (e) => {
  state.query = e.target.value
  render()
})
$('provider').addEventListener('change', (e) => {
  state.provider = e.target.value
  render()
})
$('view').addEventListener('change', (e) => {
  state.view = e.target.value
  if (state.sort !== 'company') {
    state.sort = 'name'
    state.ascending = true
  }
  render()
})
$('close').addEventListener('click', () => $('details').close())
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
      mode: state.mode,
      topicWeights: state.topicWeights,
      weights: state.weights,
      selections: state.selections,
      weighted: state.weighted,
      models: filtered().map((m) => ({
        name: m.name,
        price: m.price,
        evidence: m.evidence,
        topicScores: Object.fromEntries(topicIds.map((id) => [id, topicTable.get(m.id)[id].value])),
        companyScore: lens(m),
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
      state.mode = 'advanced'
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
