# TASK — Keep the catalog current: all GitHub Copilot models + all relevant benchmarks

Living task document. Update it in the same commit as any data change.

- **Snapshot checked:** 2026-09-24 (`checked` in `dist/data.js`)
- **Acceptance baseline:** `node check.mjs` → `{"models":35,"withEvidence":33,"defaultScored":27,"checks":"passed"}` — 20 benchmark measures/editions
  - Capture this line **before** editing; a refactor may only change data, not these counts, unless the change itself adds/removes rows or evidence.
  - Previous baseline (before the 2026-09-24 gap-closing pass): `{"models":35,"withEvidence":29,"defaultScored":16,"checks":"passed"}`.
- **Status:** task is open-ended. Sections marked ⏳ are known gaps.

## 1. Task statement

Keep `dist/data.js` + `dist/expanded.js` (the dataset) in sync with two moving targets:

1. **Model catalog** — every model GitHub lists for Copilot (`docs.github.com/.../ai-models/supported-models`) plus its token pricing (`docs.github.com/.../copilot-billing/models-and-pricing`). Utility/background models are tracked but marked `utility: true`.
2. **Benchmark evidence** — every benchmark that measures a Copilot-relevant coding capability and publishes results for catalog models, at primary-source quality (value, agent, result date if available, published uncertainty if available).

Nothing ships without primary-source attribution; no backend, no auto-refresh.

## 2. Model inventory (current state)

35 models. "Evidence" lists the benchmark ids with captured primary-source results. ✅ = has evidence, ⏳ = zero evidence anywhere.

| Model                       | Provider    | Utility | Evidence                                                                              |
| --------------------------- | ----------- | ------- | ------------------------------------------------------------------------------------- |
| GPT-5 mini                  | OpenAI      | —       | verified                                                                              |
| GPT-5.3-Codex               | OpenAI      | —       | qna, tests, refactor, terminal (2.1)                                                  |
| GPT-5.4                     | OpenAI      | —       | coding, qna, tests, refactor, terminal (2.1), features, pro (original) + alternatives |
| GPT-5.4 mini                | OpenAI      | —       | coding, terminal (2.1)                                                                |
| GPT-5.4 nano                | OpenAI      | ✅      | coding                                                                                |
| GPT-5.5                     | OpenAI      | —       | coding, qna, tests, refactor, features, optimization, program, terminal4, pro2        |
| GPT-5.6 Luna                | OpenAI      | —       | coding, rebench, terminal4                                                            |
| GPT-5.6 Sol                 | OpenAI      | —       | coding, qna, tests, rebench, program, terminal4, pro2                                 |
| GPT-5.6 Terra               | OpenAI      | —       | coding, terminal4, pro2                                                               |
| GPT-6 Astra                 | OpenAI      | —       | coding, qna, tests, refactor, terminal4, pro2                                         |
| GPT-6 Luna                  | OpenAI      | —       | coding                                                                                |
| GPT-6 Sol                   | OpenAI      | —       | coding                                                                                |
| GPT-4o                      | OpenAI      | ✅      | review, libraries, algorithmic, optimization (0)                                      |
| GPT-4o mini                 | OpenAI      | ✅      | review, libraries, algorithmic                                                        |
| GPT-4.1                     | OpenAI      | ✅      | security, polyglot                                                                    |
| Claude Haiku 4.5            | Anthropic   | —       | verified, review, pro (original)                                                      |
| Claude Sonnet 4.6           | Anthropic   | —       | coding, architecture, qna, tests, refactor, review, terminal (2.1)                    |
| Claude Sonnet 5             | Anthropic   | —       | coding, optimization, terminal4, pro2                                                 |
| Claude Opus 4.7             | Anthropic   | —       | coding, features, optimization, program, terminal4                                    |
| Claude Opus 4.8             | Anthropic   | —       | coding, optimization, program, terminal4                                              |
| Claude Opus 4.8 (fast mode) | Anthropic   | —       | coding                                                                                |
| Claude Opus 5               | Anthropic   | —       | coding, qna, tests, optimization, rebench, program, terminal4, pro2                   |
| Claude Opus 5.5             | Anthropic   | —       | coding                                                                                |
| Claude Fable 5              | Anthropic   | —       | coding, qna, tests, refactor, rebench, terminal4                                      |
| Claude Fable 5.1            | Anthropic   | —       | coding, qna, tests, refactor, terminal4, pro2                                         |
| Gemini 3.5 Flash            | Google      | —       | coding                                                                                |
| Gemini 3.6 Flash            | Google      | —       | coding, program                                                                       |
| Gemini 3.7 Flash            | Google      | —       | coding, program, terminal4                                                            |
| Gemini 3.8 Flash            | Google      | —       | coding, qna, tests, refactor, terminal4, pro2                                         |
| MAI-Code-1.1-Flash          | Microsoft   | —       | ⏳                                                                                    |
| Kimi K2.7 Code              | Moonshot AI | —       | coding                                                                                |
| Kimi K3                     | Moonshot AI | —       | coding, pro2                                                                          |
| Grok 4.5                    | xAI         | —       | coding, rebench, terminal4                                                            |
| Grok 4.6                    | xAI         | —       | coding, terminal4                                                                     |
| Grok 4.7                    | xAI         | —       | coding, terminal4                                                                     |

Notes carried in `dist/data.js`: Gemini 3.6–3.8 promotional Copilot pricing through 2026-12-31; utility models power background features and are not selectable; `fast mode` is GA-listed but keeps "preview" in its name; Fable 5, Fable 5.1 and GPT-5.6 Sol have elevated refusal-related failures on parts of SWE Atlas; Scale abbreviates GPT-5.3-Codex as "GPT 5.3 (Codex)"; GitHub retirement schedule flags Claude Opus 4.7, Gemini 3.5 Flash, Gemini 3.6 Flash and Kimi K2.7 Code for retirement on 2026-10-02 (Sonnet 4.6 remains for annual-plan individuals).

## 3. Benchmark inventory (18 measures / editions)

Main-lens selection is one benchmark per capability (`dist/scoring.js`). Historical editions stay in the historical view.

| id           | Benchmark                                             | Capability            | Main lens?             | Scale                        | Coverage today          |
| ------------ | ----------------------------------------------------- | --------------------- | ---------------------- | ---------------------------- | ----------------------- |
| coding       | LiveBench · Coding (LiveBench-2026-06-25)             | General coding        | ✅ default             | /100, category avg           | 27 models               |
| architecture | R2ABench (Paper v1 · Table 3 · Full PRD · Direct)     | Architecture          | ✅                     | Node F1 × 100                | 1 model (Sonnet 4.6) ⏳ |
| qna          | SWE Atlas · Codebase QnA                              | Codebase Q&A          | ✅ (equal-weight trio) | task resolve %               | 12 models               |
| tests        | SWE Atlas · Test Writing                              | Test writing          | ✅ (trio)              | %                            | 12 models               |
| refactor     | SWE Atlas · Refactoring                               | Refactoring           | ✅ (trio)              | %                            | 11 models ⏳            |
| terminal     | Terminal-Bench 2.1 (Terminus 2)                       | Terminal              | historical             | %                            | 4 models                |
| terminal4    | Terminal-Bench 4.0 (native agents)                    | Terminal              | ✅ (selected)          | % + 95% CI                   | 14 models               |
| verified     | SWE-bench Verified · Bash Only (mini-SWE-agent 2.0.0) | Fixing bugs           | ✅                     | %                            | 2 models ⏳             |
| pro          | SWE-Bench Pro · Public (original)                     | Complex code changes  | historical             | %                            | 2 models                |
| pro2         | SWE-Bench Pro V2 Full (2026-09-22 split)              | Complex code changes  | ✅ (selected)          | % + CI                       | 8 models                |
| rebench      | SWE-rebench (window 2026-05-15 → 2026-07-01)          | Complex code changes  | selectable (not lens)  | % + 95% CI                   | 6 models                |
| program      | ProgramBench (200 tasks · 2026-09-09)                 | Building programs     | ✅ new capability      | % resolved                   | 7 models                |
| features     | FeatureBench (Lite · v1.0 · resolved)                 | Implementing features | ✅                     | whole-task %                 | 3 models ⏳             |
| security     | BaxBench (no security reminder)                       | Secure coding         | ✅                     | % passing functional+exploit | 1 utility model ⏳      |
| review       | SWE-PRBench (eval_100 · GPT-5.2 judge)                | Code review           | ✅                     | composite × 100              | 4 models (2 utility) ⏳ |
| libraries    | BigCodeBench (Full · Instruct · v0.1.0)               | Libraries & APIs      | ✅                     | pass@1                       | 2 utility models ⏳     |
| polyglot     | Aider Polyglot (225 exercises · pass rate 2)          | Multilingual editing  | ✅                     | %                            | 1 utility model ⏳      |
| algorithmic  | LiveCodeBench (454-problem window)                    | Algorithmic coding    | ✅                     | pass@1                       | 2 utility models ⏳     |
| optimization | GSO (102 tasks · Opt@1)                               | Making code faster    | ✅                     | Opt@1 %                      | 6 models (1 utility)    |
| completion   | CrossCodeEval (NeurIPS 2023)                          | Cross-file completion | ✅ but **gap**         | —                            | 0 models ⏳             |

Scoring defaults: only `coding` starts at weight 100; every other capability defaults to 0 and new capabilities join at 0. Version-1 → version-2 preference migration forces selections `coding`/`terminal4`/`pro2`. Cost never enters the score.

## 4. ⏳ Open gaps / next actions

Ordered by value-to-effort. Each item names the blocker, not just the wish.

1. **Zero-evidence model:** MAI-Code-1.1-Flash. Search LiveBench, Terminal-Bench 4.0, SWE-Bench Pro V2, SWE-rebench and SWE Atlas for new entries. Do **not** backfill from a different model version.
2. **SWE-rebench window drift:** the captured values come from the 2026-05-15 → 2026-07-01 window (111 tasks). The leaderboard rolls monthly — re-capture the whole window at every refresh and record the window dates in the benchmark version string; never mix windows. New catalog models can appear here first (this is where GPT-5.6 Sol/Luna and Sonnet 5 surfaced).
3. **ProgramBench is growing:** 7 catalog models captured on the 2026-09-09 update; check for new rows per refresh. Fable 5/5.1 and GPT-6 rows are not yet published there.

## 5. Data discipline (hard rules)

From README + `check.mjs`; enforced by assertions:

- Missing results stay **absent**, never 0; a captured 0 is valid and distinct.
- Never fill from a different model version or silently combine benchmark editions.
- Non-primary harness results go in `alternatives[]`, never substituted into the main table.
- Source dates and unknown result dates remain distinct (`date: null` vs. a dated evaluation).
- Published uncertainty is displayed in evidence, never propagated into the score.
- Display strings (column subtitles, tooltips, badge labels) live in the benchmark objects in `dist/data.js`/`dist/expanded.js`, not in `dist/app.js`.
- Weights are browser-local preferences, not shared enterprise policy; publishing company defaults means editing `dist/scoring.js`.

## 6. Refresh procedure

1. Capture the `check.mjs` baseline line before touching anything.
2. Re-fetch the two GitHub docs pages (supported models, pricing). Update `rows`, `utilityModels` and per-row price tiers.
3. Re-check each leaderboard in §3 for new rows/editions; add evidence with `agent`, `date`, `uncertainty`, `source`. Update `sources` URLs when a page moves. LiveBench is a live leaderboard over a fixed edition — new rows can appear for catalog models at any time without an edition bump.
4. Update `checked` in `dist/data.js` (and the "This version was checked on …" line in README) to the new date.
5. Update this file: model inventory table, coverage column, gap list.

## 7. Gates (all must pass before deploy)

```sh
node check.mjs          # JSON counts must match the baseline above (or an intended new one)
npm run check           # node --check on all files
npm run format:check    # Prettier (printWidth 100, semi:false, singleQuote:true)
```

Plus a browser smoke test via `node serve.mjs` on http://127.0.0.1:4173: search, sort, model details, missing-score handling, preference persistence, WebMCP weight rejection. Run node/npm through nvm (`nvm use --lts`).

Deploy only after committing: `CLOUDFLARE_ACCOUNT_ID=… npx wrangler pages deploy dist --project-name=copilot-model-observatory --branch=main --commit-dirty=false` (full command in README). Live: https://copilot-models.pon-ai.com.
