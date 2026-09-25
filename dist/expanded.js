// Curated primary-source results, checked 2026-09-24. No imputed model results.
export function expandCatalog(benchmarks, sources, models) {
  const additions = [
    [
      'features',
      'Implementing features',
      'FeatureBench',
      'Lite · v1.0 · resolved',
      'https://github.com/LiberCoders/FeatureBench',
      'Percentage of complete feature tasks resolved, not individual tests passed.',
      'Dataset v1.1 exists; the published leaderboard still evaluates v1.0. Main results use OpenHands.',
    ],
    [
      'security',
      'Secure coding',
      'BaxBench',
      'No security reminder',
      'https://baxbench.com/',
      'Backend solutions that pass both functional tests and security exploits.',
      '392 tasks. Prompt variants are separate. Functional correctness and insecure share appear in model details. Current selectable models have no captured results.',
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
      'libraries',
      'Libraries & APIs',
      'BigCodeBench',
      'Full · Instruct · v0.1.0',
      'https://bigcode-bench.github.io/',
      'Pass@1 for coding from natural-language instructions using libraries.',
      'Full set of 1,140 tasks. Hard and Complete variants are not mixed in. Captured matches are older utility models.',
    ],
    [
      'polyglot',
      'Multilingual editing',
      'Aider Polyglot',
      '225 exercises · pass rate 2',
      'https://aider.chat/docs/leaderboards/',
      'Successful editing across C++, Go, Java, JavaScript, Python and Rust.',
      'Uses the second-attempt pass rate, not first-attempt success. Aider version and edit format matter. Captured overlap is a utility model.',
    ],
    [
      'algorithmic',
      'Algorithmic coding',
      'LiveCodeBench',
      '2024-08-01 to 2025-05-01',
      'https://livecodebench.github.io/leaderboard.html',
      'Code generation pass@1 on 454 programming problems in the fixed date window.',
      'Different from LiveBench. Scores depend on problem dates. This captured official window has only older utility-model matches.',
    ],
    [
      'optimization',
      'Making code faster',
      'GSO',
      '102 tasks · Opt@1',
      'https://livecodebench.github.io/gso.html',
      'Single-attempt estimate of tasks achieving at least 95% of human speedup while passing correctness tests.',
      'OpenHands only; Opt@10 is excluded. Reasoning settings are labeled per entry; the earlier unlabeled GPT-5.4 duplicate is resolved as two reasoning settings and the xHigh run feeds the lens.',
    ],
    [
      'completion',
      'Cross-file completion',
      'CrossCodeEval',
      'NeurIPS 2023',
      'https://github.com/amazon-science/cceval',
      'Code completion using information from other files.',
      'Registered as an evidence gap: no comparable catalog-model result captured. Language, retrieval method and context budget must be fixed before adding scores.',
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
      '200 tasks · updated 2026-09-09',
      'https://programbench.com/',
      'Re-implement a program from its compiled binary and docs; every behavioral test must pass.',
      'Common mini-SWE-agent scaffold, no internet and no decompilation. Extremely hard: the best catalog model resolves 4.5%. Almost-resolved rates are captured in details. Agent-based fuzzing generates the test suite.',
    ],
    [
      'multilingual',
      'Multilingual editing',
      'SWE-bench Multilingual',
      '300 tasks · 42 repos · 9 languages · mini-SWE-agent',
      'https://www.swebench.com/multilingual.html',
      'Resolve real GitHub issues across C, C++, Go, Java, JS, TS, PHP, Ruby and Rust.',
      'Common mini-SWE-agent harness, single rollout per instance. Agent versions differ per entry (2.0.0a0 for the February batch, 2.4.x for September). Kept separate from Aider Polyglot, which measures editing exercises, not issue resolution.',
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
      ...(id === 'review' ? { unit: '/100' } : {}),
    })
  }
  const get = (name) => models.find((m) => m.name === name)
  const add = (name, id, value, agent, date = null, extra = {}) => {
    get(name).evidence[id] = { value, agent, date, source: sources[id], ...extra }
  }
  for (const [name, value, passed] of [
    ['Claude Opus 4.7', 46.7, 78.2],
    ['GPT-5.5', 26.7, 69.8],
    ['GPT-5.4', 23.3, 66.2],
  ]) {
    add(name, 'features', value, 'OpenHands · Lite split · v1.0', null, {
      context: `Individual tests passed: ${passed}%. Main score is whole tasks resolved.`,
    })
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
  add('GPT-4.1', 'security', 40.8, 'BaxBench · no security reminder', null, {
    context:
      'Functional correctness: 56.4%. Insecure share among correct solutions: 27.7% (lower is better).',
  })
  add('GPT-4o mini', 'libraries', 46.1, 'GPT-4o-mini-2024-07-18 · chat · Full / Instruct')
  add('GPT-4o', 'libraries', 48, 'GPT-4o-2024-11-20 · chat · Full / Instruct', null, {
    context: 'Historical dated variant; not evidence for every GPT-4o deployment.',
  })
  add('GPT-4.1', 'polyglot', 52.4, 'Aider 0.81.4.dev · diff · pass rate 2', '2025-04-14', {
    context: 'First-attempt pass rate: 20.0%. Main score allows a second attempt.',
  })
  add('GPT-4o', 'algorithmic', 29.5, 'GPT-4o-2024-08-06 · fixed 454-problem window')
  add('GPT-4o mini', 'algorithmic', 27.5, 'GPT-4o-mini-2024-07-18 · fixed 454-problem window')
  for (const [name, value, agent, date] of [
    ['Claude Haiku 4.5', 64.7, 'mini-SWE-agent 2.0.0a0', '2026-02-13'],
    ['Gemini 3.5 Flash', 67.0, 'mini-SWE-agent 2.4.6', '2026-09-02'],
    ['GPT-5 mini', 39.7, 'mini-SWE-agent 2.0.0a0', '2026-02-13'],
  ])
    add(name, 'multilingual', value, agent, date)
  add('Gemini 3.5 Flash', 'verified', 71.8, 'mini-SWE-agent 2.4.2', '2026-09-01')
  for (const [name, value, date] of [
    ['Claude Opus 4.8', 47.1, '2026-07-12'],
    ['Claude Opus 4.7', 44.1, '2026-04-27'],
    ['GPT-5.5', 40.2, '2026-04-27'],
    ['Claude Sonnet 5', 37.3, '2026-07-12'],
    ['GPT-4o', 0, '2025-05-30'],
  ])
    add(name, 'optimization', value, 'OpenHands · Opt@1', date)
  add('GPT-5.4', 'optimization', 31.4, 'OpenHands · Opt@1 · xHigh', '2026-03-10')
  get('GPT-5.4').notes.push(
    'GSO initially published 31.4% and 25.5% for GPT 5.4 / OpenHands / Opt@1 without reasoning-effort labels; the leaderboard now shows these are two reasoning settings (xHigh and High) on the same date. The xHigh run is used as main evidence and the High run is retained below.',
  )
  get('GPT-5.4').alternatives.push({
    benchmark: 'optimization',
    value: 25.5,
    agent: 'OpenHands · Opt@1 · High',
    date: '2026-03-10',
    source: sources.optimization,
  })
  for (const [name, value, uncertainty, agent] of [
    ['GPT-6 Astra', 58.2, 2.8, 'Codex · max'],
    ['Claude Fable 5.1', 57.9, 3.8, 'Claude Code · max'],
    ['Claude Opus 5', 53.9, 3.2, 'Claude Code · xhigh'],
    ['Claude Fable 5', 44.5, 3.8, 'Claude Code · max'],
    ['Grok 4.7', 37.6, 3.5, 'Grok Build · xhigh'],
    ['GPT-5.6 Sol', 37.3, 3.8, 'Codex · max'],
    ['Claude Opus 4.8', 23.6, 3.6, 'Claude Code · max'],
    ['GPT-5.6 Terra', 21.5, 3.3, 'Codex · max'],
    ['Grok 4.6', 20.3, 3.1, 'Grok Build · high'],
    ['Gemini 3.8 Flash', 19.1, 3.4, 'mini-SWE-agent · high'],
    ['GPT-5.6 Luna', 17.3, 2.8, 'Codex · max'],
    ['Grok 4.5', 12.4, 2.6, 'Grok Build · high'],
    ['Claude Sonnet 5', 12.4, 3.1, 'Claude Code · max'],
    ['Gemini 3.7 Flash', 11.2, 2.4, 'mini-SWE-agent · high'],
  ])
    add(name, 'terminal4', value, agent, null, { uncertainty })
  for (const [name, value, uncertainty, agent] of [
    ['Claude Fable 5', 64.5, 1.41, 'raw model · high'],
    ['Grok 4.5', 63.8, 0.6, 'raw model · high'],
    ['Claude Opus 5', 63.4, 1.35, 'raw model · high'],
    ['GPT-5.6 Sol', 62.3, 1.83, 'raw model · medium'],
    ['Claude Sonnet 5', 56.8, 0.94, 'raw model · high'],
    ['GPT-5.6 Luna', 43.6, 1.47, 'raw model · medium'],
  ])
    add(name, 'rebench', value, agent, null, { uncertainty })
  for (const [name, value, almost] of [
    ['Claude Opus 5', 4.5, 37.0],
    ['GPT-5.6 Sol', 1.0, 15.5],
    ['GPT-5.5', 0.5, 13.5],
    ['Gemini 3.6 Flash', 0.5, 4.0],
    ['Claude Opus 4.8', 0, 16.5],
    ['Gemini 3.7 Flash', 0, 5.5],
    ['Claude Opus 4.7', 0, 4.5],
  ]) {
    add(name, 'program', value, 'mini-SWE-agent', null, {
      context: `Almost-resolved (partial test pass): ${almost}%. 0% is a captured result, not a missing one.`,
    })
  }
  for (const [name, value, uncertainty, agent] of [
    ['GPT-6 Astra', 58.2, 2.8, 'Codex · max'],
    ['Claude Fable 5.1', 57.9, 3.8, 'Claude Code · max'],
    ['Claude Opus 5', 53.9, 3.2, 'Claude Code · xhigh'],
    ['Claude Fable 5', 44.5, 3.8, 'Claude Code · max'],
    ['Grok 4.7', 37.6, 3.5, 'Grok Build · xhigh'],
    ['GPT-5.6 Sol', 37.3, 3.8, 'Codex · max'],
    ['Claude Opus 4.8', 23.6, 3.6, 'Claude Code · max'],
    ['GPT-5.6 Terra', 21.5, 3.3, 'Codex · max'],
    ['Grok 4.6', 20.3, 3.1, 'Grok Build · high'],
    ['Gemini 3.8 Flash', 19.1, 3.4, 'mini-SWE-agent · high'],
    ['GPT-5.6 Luna', 17.3, 2.8, 'Codex · max'],
    ['Grok 4.5', 12.4, 2.6, 'Grok Build · high'],
    ['Claude Sonnet 5', 12.4, 3.1, 'Claude Code · max'],
    ['Gemini 3.7 Flash', 11.2, 2.4, 'mini-SWE-agent · high'],
  ])
    add(name, 'terminal4', value, agent, null, { uncertainty })
  for (const [name, value, uncertainty, agent] of [
    ['Claude Opus 5', 99.4, 0.4, 'Claude Code · xhigh'],
    ['Claude Fable 5.1', 99.1, 0.5, 'Claude Code · high'],
    ['Kimi K3', 97.7, 0.9, 'mini-swe-agent · max'],
    ['GPT-6 Astra', 96.9, 1.1, 'Codex · high'],
    ['GPT-5.6 Sol', 95.5, 1.4, 'Codex · xhigh'],
    ['Gemini 3.8 Flash', 94.86, 1.46, 'mini-swe-agent · high'],
    ['Claude Sonnet 5', 93.15, 1.71, 'Claude Code · xhigh'],
    ['GPT-5.6 Terra', 92.37, 1.81, 'Codex · xhigh'],
  ])
    add(name, 'pro2', value, agent, null, { uncertainty })
}
