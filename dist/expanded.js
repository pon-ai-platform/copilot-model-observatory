// Curated primary-source results, checked 2026-10-27. No imputed model results.
export function expandCatalog(benchmarks, sources, models) {
  const additions = [
    [
      'features',
      'Implementing features',
      'FeatureBench',
      'Lite · v1.0 · resolved',
      'https://github.com/LiberCoders/FeatureBench',
      'Percentage of complete feature tasks resolved, not individual tests passed.',
      'Dataset v1.1 exists; the published leaderboard still evaluates v1.0. Main results use OpenHands. Claude Opus 4.7 (46.7%), GPT-5.5 (26.7%) and GPT-5.4 (23.3%) left the catalog when GitHub retired them in October 2026.',
    ],
    [
      'review',
      'Code review',
      'SWE-PRBench',
      'Paper baseline · v0.4.1',
      'https://github.com/FoundryHQ-AI/swe-prbench',
      'Published overall review score multiplied by 100.',
      '100-PR evaluation split, GPT-5.2 judge. Detection and false-positive rates remain separate in details. This is a narrow, emerging benchmark.',
    ],
    [
      'optimization',
      'Making code faster',
      'GSO',
      '102 tasks · Opt@1 · updated 2026-09-27',
      'https://livecodebench.github.io/gso.html',
      'Single-attempt estimate of tasks achieving at least 95% of human speedup while passing correctness tests.',
      'OpenHands only; Opt@10 is excluded. Reasoning settings are labeled per entry. The 2026-09-27 update improved elicitation (models are explicitly asked to keep measuring and improving after their first speedup); rows from before and after that date are not directly comparable.',
    ],
    [
      'terminal4',
      'Terminal tasks',
      'Terminal-Bench 4.0',
      '4.0 · native agents',
      'https://www.tbench.ai/',
      'Terminal task resolution, with published 95% confidence intervals.',
      'Different native agents and reasoning settings. Kept separate from the historical 2.1 common-agent results. Source release dates are model dates, not inferred evaluation dates.',
    ],
    [
      'pro2',
      'Complex code changes',
      'SWE-Bench Pro V2',
      'V2 Full · 2026-09-22',
      'https://labs.scale.com/leaderboard/swe_bench_pro_public_v2?tab=full',
      'Resolution of the refreshed 642-task public split.',
      'Full, not HARD. Revised tasks and locked evaluation protocol; not comparable to original Pro. Published agent setups differ.',
    ],
    [
      'rebench',
      'Complex code changes',
      'SWE-rebench',
      'Window 2026-05-15 → 2026-07-01 · 111 tasks',
      'https://swe-rebench.com/',
      'Resolve fresh GitHub issues from a rolling contamination-free window.',
      'Rolling time window; captured values are point-in-time and shift with each window. Model rows only; Claude Code, Codex, Junie and Cursor agent rows are different harnesses and are not captured. Kept separate from the SWE-Bench Pro V2 edition.',
    ],
    [
      'program',
      'Building programs',
      'ProgramBench',
      '200 tasks · updated 2026-10-22',
      'https://programbench.com/',
      'Re-implement a program from its compiled binary and docs; every behavioral test must pass.',
      'Common mini-SWE-agent scaffold, no internet and no decompilation. Extremely hard: the best catalog model resolves 18.5%. Almost-resolved rates are captured in details. Agent-based fuzzing generates the test suite.',
    ],
    [
      'multilingual',
      'Multilingual editing',
      'SWE-bench Multilingual',
      '300 tasks · 42 repos · 9 languages · mini-SWE-agent',
      'https://www.swebench.com/multilingual.html',
      'Resolve real GitHub issues across C, C++, Go, Java, JS, TS, PHP, Ruby and Rust.',
      'Common mini-SWE-agent harness, single rollout per instance. Captured catalog entries come from the February batch (mini-SWE-agent 2.0.0a0).',
    ],
    [
      'livebench2',
      'General coding',
      'LiveBench 2.0 · Coding',
      'LiveBench 2.0 · release 2026-10-14 · 29 tasks',
      'https://livebench.ai/',
      'Fix a real bug, taken from a merged pull request, in a large production codebase frozen at a fixed snapshot. Mean task score 0–100.',
      'Default General coding benchmark since 2026-10-14. New LiveBench edition with agentic suites; not comparable to LiveBench 1.0 Coding (historical view). Hidden tests check the fix; a fix that breaks existing behaviour scores 0. Release 2026-10-14 covers all 24 evaluated Copilot models on a single consistent edition; the partial 2026-10-25 release only evaluated 14 of them (GPT-6.1 Terra scores 94.3 there, recorded in model details).',
    ],
    [
      'vibecode',
      'Building apps',
      'Vibe Code Bench',
      'v1.1 · 50 apps · updated 2026-10-26',
      'https://www.vals.ai/benchmarks/vibe-code',
      'Build a complete web app from a one-page plain-language spec; automated browser tests click through each workflow.',
      'Run by Vals AI on a private test set: the method is published, but results cannot be independently reproduced. The main column uses the common OpenHands harness; Claude Code, Codex and Factory runs are kept as alternative setups. Fallbacks to another model and provider refusals are flagged per result as published.',
    ],
    [
      'migration',
      'Migrating code',
      'Code Migration',
      '130 tasks · updated 2026-10-18',
      'https://www.vals.ai/benchmarks/code-migration',
      'Re-implement working programs in another language (30 CLI repositories into 4 target languages, plus 10 COBOL to Java); scored on hidden behaviour tests.',
      'Run by Vals AI on a private test set. Score is the hidden-test pass rate; an anti-cheat check zeroes wrappers, copied artifacts and wrong-language submissions. Fallbacks and provider refusals are flagged per result as published.',
    ],
    [
      'cyber',
      'Secure coding',
      'CyberBench',
      'v1.1 · 116 tasks · updated 2026-10-20',
      'https://www.vals.ai/benchmarks/cyber',
      'Reproduce and patch OSS-Fuzz-style crashes (mostly memory safety) in real open-source native-code projects.',
      'Run by Vals AI. Provider refusals count as failures: several frontier models refuse about half of the tasks (GPT-6 Astra, GPT-6.1 Sol, Gemini 3.8 Flash), so these scores mix capability with safety policy. Special-access variants (Opus 5.5 CVP, Sonnet 5 Cyber Range) are kept as alternative setups.',
    ],
    [
      'ioi',
      'Algorithmic coding',
      'IOI',
      'IOI 2024–2026 · 18 problems · updated 2026-10-24',
      'https://www.vals.ai/benchmarks/ioi',
      'International Olympiad in Informatics problems, graded with the official subtask tests (100 points per problem).',
      'Run by Vals AI on public olympiad problems with withheld test data. Two models reach 100%, so the top of the scale is saturated; published uncertainty is wide for several entries.',
    ],
    [
      'vcb100',
      'Implementing features',
      'Vibe Code Bench 1-100',
      '50 tasks · updated 2026-10-17',
      'https://www.vals.ai/benchmarks/vcb-1-100',
      'Extend a working web app through up to ten dependent plain-language product requests without breaking what already works.',
      'Run by Vals AI on a private test set; only 27 models tested so far. Fallbacks and provider refusals are flagged per result as published.',
    ],
    [
      'lbagentic',
      'Long-running agent work',
      'LiveBench 2.0 · Agentic',
      'LiveBench 2.0 · release 2026-10-14 · 18 tasks',
      'https://livebench.ai/',
      'Long-running work where early decisions must hold up: extending apps through changing requirements, running a codebase through simulated months of operations, building a compiler, performance optimisation. Mean task score 0–100.',
      'Deterministic grading against hidden reference data, test programs or simulated outcomes. One run per model at its highest supported effort unless the source row says otherwise. Release 2026-10-14 covers all 24 evaluated Copilot models on a consistent 18-task suite; release 2026-10-25 replaced four tasks with a Delegated Operations subcategory and only re-ran 14 of them (retained in model details).',
    ],
    [
      'multimodal',
      'Fixing bugs',
      'SWE-bench Multimodal',
      'Test split · 480 tasks · Vals AI run · updated 2026-10-25',
      'https://www.vals.ai/benchmarks/swebench-multimodal',
      'Resolve real JavaScript issues reported with screenshots, graded by the upstream SWE-bench harness.',
      'Run by Vals AI with mini-SWE-agent and network access closed (agents with internet access were found copying the upstream fix). The official SWE-bench leaderboard has no current catalog-model rows.',
    ],
  ]
  for (const [id, short, name, version, url, description, note] of additions) {
    sources[id] = url
    benchmarks.push({
      id,
      short,
      name,
      version,
      subtitle: name,
      description,
      note,
      ...(['review', 'livebench2', 'lbagentic'].includes(id) ? { unit: '/100' } : {}),
    })
  }
  const get = (name) => models.find((m) => m.name === name)
  const add = (name, id, value, agent, date = null, extra = {}) => {
    get(name).evidence[id] = { value, agent, date, source: sources[id], ...extra }
  }
  for (const [name, value, detection, falsePositive] of [
    ['Claude Haiku 4.5', 15.3, 30.6, 34.6],
    ['Claude Sonnet 4.6', 15.2, 29.7, 22.7],
    ['GPT-4o', 11.3, 22, 19.3],
    ['GPT-4o mini', 10.8, 21, 35.3],
  ]) {
    add(name, 'review', value, 'Paper baseline · eval_100 · GPT-5.2 judge', null, {
      context: `Detection (DR_A): ${detection}% (higher is better). False-positive rate: ${falsePositive}% (lower is better). Overall score is the published composite × 100.`,
    })
  }
  add('Claude Haiku 4.5', 'multilingual', 64.7, 'mini-SWE-agent 2.0.0a0', '2026-02-13')
  for (const [name, value, date] of [
    ['Claude Opus 4.8', 47.1, '2026-07-12'],
    ['Claude Sonnet 5', 37.3, '2026-07-12'],
    ['GPT-4o', 0, '2025-05-30'],
  ])
    add(name, 'optimization', value, 'OpenHands · Opt@1', date)
  for (const [name, value] of [
    ['Claude Fable 5.1', 88.2],
    ['GPT-6 Astra', 79.4],
    ['Claude Fable 5', 78.4],
    ['GPT-5.6 Sol', 76.5],
  ])
    add(name, 'optimization', value, 'OpenHands · Opt@1 · xHigh', '2026-09-27')
  for (const [name, value, uncertainty, agent] of [
    ['Claude Fable 5', 64.5, 1.41, 'raw model · high'],
    ['Grok 4.5', 63.8, 0.6, 'raw model · high'],
    ['Claude Opus 5', 63.4, 1.35, 'raw model · high'],
    ['GPT-5.6 Sol', 62.3, 1.83, 'raw model · medium'],
    ['Claude Sonnet 5', 56.8, 0.94, 'raw model · high'],
    ['GPT-5.6 Luna', 43.6, 1.47, 'raw model · medium'],
  ])
    add(name, 'rebench', value, agent, null, { uncertainty })
  for (const [name, value, almost, effort] of [
    ['Claude Opus 5.5', 18.5, 70.5, 'xhigh'],
    ['Claude Fable 5.1', 9.0, 55.5, 'xhigh'],
    ['GPT-6 Astra', 5.0, 52.5, 'max'],
    ['Claude Opus 5', 4.5, 37.0, 'xhigh'],
    ['GPT-5.6 Sol', 1.0, 15.5, 'xhigh'],
    ['Claude Opus 4.8', 0, 16.5, 'xhigh'],
    ['Claude Sonnet 4.6', 0, 1.0],
    ['Claude Haiku 4.5', 0, 0.0],
  ]) {
    add(name, 'program', value, effort ? `mini-SWE-agent · ${effort}` : 'mini-SWE-agent', null, {
      context: `Almost-resolved (partial test pass): ${almost}%. 0% is a captured result, not a missing one.`,
    })
  }
  get('GPT-5.6 Sol').alternatives.push({
    benchmark: 'program',
    value: 0.5,
    agent: 'mini-SWE-agent · default effort',
    date: null,
    source: sources.program,
    context: 'Almost-resolved (partial test pass): 2.5%.',
  })
  for (const [name, value, uncertainty, agent] of [
    ['Claude Opus 5.5', 64.8, 3.1, 'Claude Code · max'],
    ['Claude Sonnet 5.5', 61.8, 2.9, 'Claude Code · max'],
    ['GPT-6 Astra', 58.2, 2.8, 'Codex · max'],
    ['GPT-6.1 Sol', 58.2, 3.1, 'Codex · max'],
    ['Claude Fable 5.1', 57.9, 3.8, 'Claude Code · max'],
    ['Claude Opus 5', 53.9, 3.2, 'Claude Code · xhigh'],
    ['GPT-6 Sol', 49.4, 3.2, 'Codex · max'],
    ['Claude Fable 5', 44.5, 3.8, 'Claude Code · max'],
    ['Grok 4.7', 37.6, 3.5, 'Grok Build · xhigh'],
    ['GPT-5.6 Sol', 37.3, 3.8, 'Codex · max'],
    ['Claude Opus 4.8', 23.6, 3.6, 'Claude Code · max'],
    ['GPT-5.6 Terra', 21.5, 3.3, 'Codex · max'],
    ['Grok 4.6', 20.3, 3.1, 'Grok Build · high'],
    ['Gemini 3.8 Flash', 19.1, 3.4, 'mini-SWE-agent · high'],
    ['GPT-5.6 Luna', 17.3, 2.8, 'Codex · max'],
    ['GPT-6 Luna', 16.4, 2.7, 'Codex · max'],
    ['Grok 4.5', 12.4, 2.6, 'Grok Build · high'],
    ['Claude Sonnet 5', 12.4, 3.1, 'Claude Code · max'],
  ])
    add(name, 'terminal4', value, agent, null, { uncertainty })
  for (const [name, value, uncertainty, agent] of [
    ['Claude Opus 5', 99.4, 0.4, 'Claude Code · xhigh'],
    ['Gemini 4 Argon', 99.22, 0.45, 'mini-swe-agent · high'],
    ['Claude Fable 5.1', 99.1, 0.5, 'Claude Code · high'],
    ['Kimi K3', 97.7, 0.9, 'mini-swe-agent · max'],
    ['GPT-6 Astra', 96.9, 1.1, 'Codex · high'],
    ['GPT-6.1 Sol', 96.11, 1.24, 'mini-swe-agent · xhigh'],
    ['Claude Sonnet 5.5', 95.79, 1.3, 'mini-swe-agent · xhigh'],
    ['GPT-5.6 Sol', 95.5, 1.4, 'Codex · xhigh'],
    ['Gemini 3.8 Flash', 94.86, 1.46, 'mini-swe-agent · high'],
    ['Claude Sonnet 5', 93.15, 1.71, 'Claude Code · xhigh'],
    ['GPT-5.6 Terra', 92.37, 1.81, 'Codex · xhigh'],
    ['Claude Haiku 5.5', 87.23, 2.36, 'mini-swe-agent · high'],
  ])
    add(name, 'pro2', value, agent, null, { uncertainty })
  for (const [name, value] of [
    ['Claude Fable 5', 98.3],
    ['Claude Fable 5.1', 97.7],
    ['Claude Opus 5.5', 96.3],
    ['GPT-6.1 Sol', 96],
    ['Claude Sonnet 5.5', 94.7],
    ['Grok 4.5', 94.3],
    ['GPT-6 Astra', 93.7],
    ['GPT-6 Sol', 93.1],
    ['Claude Haiku 5.5', 91.4],
    ['Claude Opus 5', 90.8],
    ['GPT-6.1 Terra', 90.8],
    ['Gemini 4 Argon', 89.7],
    ['GPT-5.6 Sol', 89.7],
    ['Grok 4.6', 89.1],
    ['GPT-5.6 Terra', 86.2],
    ['Grok 4.7', 84.5],
    ['GPT-6 Luna', 84.5],
    ['Gemini 3.8 Flash', 82.2],
    ['Claude Opus 4.8', 77.3],
    ['Claude Sonnet 5', 74.7],
    ['GPT-5.6 Luna', 73.6],
    ['Claude Sonnet 4.6', 66.6],
    ['Kimi K3', 59.3],
    ['Claude Haiku 4.5', 48.1],
  ])
    add(name, 'livebench2', value, 'LiveBench 2.0 · single run · highest supported effort')
  // Vals AI rows: [name, value, uncertainty, fallback/refusal note, setting]
  // Share of tasks refused by the provider (scored as failures), parsed from the Vals flag text.
  const refusalRate = (flag) => {
    const refused = flag.match(/(\d+) provider refusals?/)
    const tasks = flag.match(/on (\d+) tasks/)
    return refused && tasks ? { refusals: Number(refused[1]) / Number(tasks[1]) } : {}
  }
  const vals = (id, agent, rows) => {
    for (const [name, value, uncertainty, flag, setting] of rows)
      add(name, id, value, setting ? `${agent} · ${setting}` : agent, null, {
        uncertainty,
        ...(flag ? { context: `Vals AI flag: ${flag}`, ...refusalRate(flag) } : {}),
      })
  }
  const alt = (name, benchmark, value, uncertainty, agent, context) =>
    get(name).alternatives.push({
      benchmark,
      value,
      uncertainty,
      agent,
      date: null,
      source: sources[benchmark],
      ...(context ? { context } : {}),
    })
  vals('vibecode', 'OpenHands · Vals harness', [
    ['Claude Sonnet 5.5', 92.39, 1.26],
    ['Gemini 4 Argon', 91.91, 1.9],
    ['Claude Haiku 5.5', 90.44, 1.73],
    ['Claude Fable 5', 90.35, 2.1],
    ['Claude Opus 5.5', 90.29, 1.53, '4 fallbacks to another model on 50 tasks (8.00%).'],
    ['Claude Fable 5.1', 90.26, 1.57],
    ['GPT-6 Astra', 89.59, 2.17],
    ['GPT-6.1 Sol', 88.93, 1.89],
    ['Claude Opus 5', 88.4, 3.0],
    ['GPT-6 Sol', 87.82, 2.53],
    ['Grok 4.7', 86.17, 2.18],
    ['Kimi K3', 84.97, 2.75],
    ['GPT-6.1 Terra', 84.0, 2.87],
    ['Claude Opus 4.8', 82.72, 3.08],
    ['GPT-6 Luna', 81.65, 3.38],
    ['Claude Sonnet 5', 81.33, 3.05],
    ['GPT-5.6 Sol', 80.5, 3.72],
    ['Gemini 3.8 Flash', 78.65, 3.88],
    ['GPT-5.6 Luna', 77.06, 3.07],
    ['Grok 4.6', 76.24, 3.82],
    ['GPT-5.6 Terra', 74.59, 4.2],
    ['Grok 4.5', 69.0, 4.48],
    ['GPT-5.3-Codex', 61.77, 4.71],
    ['Claude Sonnet 4.6', 51.48, 4.64],
    ['GPT-5.4 nano', 26.1, 5.08],
    ['Claude Haiku 4.5', 11.39, 3.13, null, 'thinking'],
  ])
  alt('Claude Opus 4.8', 'vibecode', 77.48, 3.74, 'Claude Code · Vals harness')
  alt('Claude Sonnet 4.6', 'vibecode', 55.77, 4.68, 'Claude Code · Vals harness')
  vals('migration', 'Vals harness', [
    ['Claude Sonnet 5.5', 69.83, 4.26],
    ['Gemini 4 Argon', 68.17, 4.35],
    ['GPT-6 Astra', 67.74, 4.22],
    ['Claude Opus 5.5', 66.65, 4.33, '106 fallbacks to another model on 130 tasks (81.54%).'],
    ['GPT-6.1 Sol', 65.12, 4.36],
    ['Claude Opus 5', 57.47, 4.37],
    ['GPT-6 Sol', 57.2, 4.21],
    [
      'Claude Fable 5',
      55.06,
      4.61,
      '24 fallbacks on 130 tasks (18.46%); 24 provider refusals scored as failures.',
    ],
    [
      'Claude Fable 5.1',
      54.61,
      4.81,
      '2 fallbacks on 130 tasks (1.54%); 2 provider refusals scored as failures.',
    ],
    ['GPT-5.6 Sol', 52.92, 4.35],
    ['GPT-5.6 Terra', 47.8, 4.28],
    ['Claude Opus 4.8', 47.25, 4.18],
    ['Grok 4.7', 44.82, 4.21],
    ['Grok 4.6', 44.57, 4.48],
    ['Claude Haiku 5.5', 44.57, 4.23],
    ['GPT-5.6 Luna', 44.55, 4.24],
    ['Claude Sonnet 5', 44.39, 4.25],
    ['GPT-6 Luna', 42.55, 4.42],
    ['Claude Sonnet 4.6', 39.89, 4.14],
    ['Grok 4.5', 36.6, 4.14],
    ['Gemini 3.8 Flash', 36.55, 4.18],
    ['Kimi K3', 16.1, 4.1],
    ['GPT-5.4 nano', 14.47, 4.03],
    ['Claude Haiku 4.5', 7.55, 1.06, null, 'thinking'],
  ])
  vals('cyber', 'Vals harness', [
    ['GPT-6 Sol', 77.98, 5.11],
    ['Gemini 4 Argon', 77.86, 5.3],
    ['GPT-5.6 Sol', 76.31, 5.18],
    ['GPT-6 Luna', 76.25, 5.29],
    ['Claude Haiku 5.5', 75.48, 5.21],
    ['Kimi K3', 75.24, 5.56],
    ['GPT-5.6 Luna', 73.63, 5.56],
    ['GPT-5.6 Terra', 72.08, 5.41],
    ['Grok 4.5', 71.01, 5.79],
    ['Claude Fable 5.1', 70.42, 5.43, '62 fallbacks to another model on 116 tasks (53.45%).'],
    ['Grok 4.7', 69.46, 5.67],
    ['Grok 4.6', 67.68, 5.87],
    ['Claude Opus 5', 65.36, 5.55, '37 fallbacks to another model on 116 tasks (31.90%).'],
    ['Claude Sonnet 5', 61.91, 5.74, '1 provider refusal on 116 tasks (0.86%), scored as failure.'],
    [
      'Claude Sonnet 5.5',
      59.58,
      5.21,
      '54 fallbacks on 116 tasks (46.55%); 8 provider refusals (6.90%) scored as failures.',
    ],
    ['Claude Opus 5.5', 55.36, 5.13, '61 fallbacks to another model on 116 tasks (52.59%).'],
    [
      'Gemini 3.8 Flash',
      43.75,
      2.21,
      '59 provider refusals on 116 tasks (50.86%), scored as failures.',
    ],
    ['GPT-6 Astra', 41.07, 2.56, '61 provider refusals on 116 tasks (52.59%), scored as failures.'],
    ['GPT-6.1 Sol', 39.29, 2.74, '60 provider refusals on 116 tasks (51.72%), scored as failures.'],
  ])
  alt(
    'Claude Opus 5.5',
    'cyber',
    74.58,
    5.35,
    'Vals harness · Cyber Verification Program access',
    'Vals AI flag: 61 fallbacks to another model on 116 tasks (52.59%).',
  )
  alt('Claude Sonnet 5', 'cyber', 70.3, 5.65, 'Vals harness · Cyber Range access')
  vals('ioi', 'Vals harness', [
    ['Gemini 4 Argon', 100, 0],
    ['GPT-6 Astra', 100, 0],
    ['GPT-6.1 Sol', 96.89, 3.11],
    ['Claude Opus 5.5', 95.06, 4.94, '1 fallback to another model on 18 tasks (5.56%).'],
    ['GPT-5.6 Sol', 91.17, 4.51],
    ['Claude Fable 5.1', 90.78, 4.65, '4 fallbacks to another model on 18 tasks (22.22%).'],
    ['GPT-5.6 Terra', 87.61, 6.53],
    ['Claude Opus 5', 84.33, 9.96],
    ['Claude Sonnet 5.5', 83.06, 3.74],
    ['GPT-6 Sol', 82.61, 9.24],
    ['GPT-5.6 Luna', 61.78, 11.61],
    ['Grok 4.7', 57.72, 1.99],
    ['Gemini 3.8 Flash', 56.94, 2.26],
    ['GPT-6 Luna', 55.56, 8.87],
    ['GPT-5.3-Codex', 53.83, 6.31],
    ['Kimi K3', 48.94, 9.82],
    ['Grok 4.6', 47.61, 2.09],
    ['Claude Haiku 5.5', 47.28, 10.72],
    ['Claude Sonnet 5', 45.0, 2.75],
    ['Grok 4.5', 40.56, 3.95],
  ])
  vals('vcb100', 'Vals harness', [
    ['Claude Opus 5.5', 30.36, 4.83, '8 fallbacks to another model on 50 tasks (16.00%).'],
    ['Claude Opus 5', 28.53, 4.33],
    [
      'Claude Fable 5.1',
      28.0,
      4.49,
      '14 fallbacks on 50 tasks (28.00%); 14 provider refusals scored as failures.',
    ],
    ['GPT-6 Astra', 27.64, 4.08],
    ['GPT-5.6 Luna', 22.59, 4.0],
    ['Gemini 4 Argon', 21.2, 3.81],
    ['Claude Haiku 5.5', 20.41, 3.79],
    ['GPT-5.6 Sol', 20.01, 3.63],
    ['Gemini 3.8 Flash', 18.77, 3.31],
    ['Kimi K3', 18.24, 3.92],
    ['GPT-5.6 Terra', 14.82, 3.12],
    ['Grok 4.6', 14.75, 3.17],
    ['Claude Sonnet 5', 13.82, 2.98],
  ])
  vals('multimodal', 'mini-SWE-agent · no network · Vals harness', [
    ['Claude Opus 5.5', 70.21, 2.09],
    ['Claude Fable 5.1', 61.25, 2.23],
    ['Claude Sonnet 5.5', 58.33, 2.25],
    ['Gemini 4 Argon', 56.04, 2.27],
    ['Kimi K3', 44.17, 2.27],
    ['Claude Haiku 5.5', 43.96, 2.27],
    ['GPT-6.1 Sol', 43.54, 2.27],
    ['GPT-6 Astra', 43.33, 2.26],
    ['Grok 4.7', 42.92, 2.26],
    ['Gemini 3.8 Flash', 40.83, 2.25],
    ['GPT-6 Luna', 37.5, 2.21],
  ])
  for (const [name, value] of [
    ['Claude Opus 5.5', 85.0],
    ['GPT-6 Astra', 82.4],
    ['Claude Fable 5.1', 80.8],
    ['Claude Sonnet 5.5', 78.8],
    ['GPT-6.1 Sol', 73.0],
    ['Gemini 4 Argon', 69.9],
    ['GPT-6 Sol', 66.9],
    ['Claude Opus 5', 62.1],
    ['Claude Haiku 5.5', 57.6],
    ['Claude Fable 5', 53.2],
    ['Grok 4.7', 50.1],
    ['GPT-5.6 Sol', 48.5],
    ['GPT-5.6 Terra', 48.4],
    ['Claude Opus 4.8', 48.3],
    ['GPT-6 Luna', 48.1],
    ['Kimi K3', 42.8],
    ['Grok 4.6', 40.7],
    ['GPT-6.1 Terra', 39.6],
    ['Claude Sonnet 5', 39.0],
    ['GPT-5.6 Luna', 30.4],
    ['Gemini 3.8 Flash', 30.1],
    ['Grok 4.5', 27.9],
    ['Claude Sonnet 4.6', 23.1],
    ['Claude Haiku 4.5', 11.1],
  ])
    add(name, 'lbagentic', value, 'LiveBench 2.0 · single run · highest supported effort')
  alt(
    'GPT-6.1 Terra',
    'livebench2',
    94.3,
    undefined,
    'LiveBench 2.0 · release 2026-10-25 · highest supported effort',
  )
  for (const [name, value] of [
    ['Claude Fable 5.1', 77.9],
    ['GPT-6 Astra', 77.5],
    ['Claude Opus 5.5', 72.8],
    ['GPT-6.1 Sol', 68.7],
    ['Claude Sonnet 5.5', 63.4],
    ['Gemini 4 Argon', 61.2],
    ['GPT-6.1 Terra', 48.6],
    ['Grok 4.7', 46.1],
    ['Claude Haiku 5.5', 40.0],
    ['GPT-5.6 Terra', 33.1],
    ['GPT-6 Luna', 30.9],
    ['Grok 4.6', 28.0],
    ['Kimi K3', 26.4],
    ['Gemini 3.8 Flash', 16.5],
  ])
    alt(
      name,
      'lbagentic',
      value,
      undefined,
      'LiveBench 2.0 · release 2026-10-25 · highest supported effort',
    )
}
