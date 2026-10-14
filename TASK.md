# TASK — Keep the catalog current: all GitHub Copilot models + all relevant benchmarks

Living task document. Update it in the same commit as any data change.

- **Snapshot checked:** 2026-10-14 (`checked` in `dist/data.js`)
- **Acceptance baseline:** `node check.mjs` → `{"models":35,"withEvidence":33,"defaultScored":25,"benchmarks":22,"checks":"passed"}` — 22 benchmark measures/editions (General coding switched to LiveBench 2.0 on 2026-10-14; it was 26 on LiveBench 1.0)
  - Capture this line **before** editing; a refactor may only change data, not these counts, unless the change itself adds/removes rows or evidence.
  - Previous baseline (before the 2026-10-14 refresh): `{"models":38,"withEvidence":36,"defaultScored":30,"benchmarks":21,"checks":"passed"}` (2026-10-08 pass, after Haiku 5.5: same; 2026-09-30 pass: `{"models":37,"withEvidence":35,"defaultScored":29,"benchmarks":21,"checks":"passed"}`; pre-2026-09-29: `{"models":35,"withEvidence":33,"defaultScored":27,"benchmarks":21,"checks":"passed"}`).
- **Status:** task is open-ended. Sections marked ⏳ are known gaps.

## 1. Task statement

Keep `dist/data.js` + `dist/expanded.js` (the dataset) in sync with two moving targets:

1. **Model catalog** — every model GitHub lists for Copilot (`docs.github.com/.../ai-models/supported-models`) plus its token pricing (`docs.github.com/.../copilot-billing/models-and-pricing`). Utility/background models are tracked but marked `utility: true`.
2. **Benchmark evidence** — every benchmark that measures a Copilot-relevant coding capability and publishes results for catalog models, at primary-source quality (value, agent, result date if available, published uncertainty if available).

Nothing ships without primary-source attribution; no backend, no auto-refresh.

## 2. Model inventory (current state)

35 models. "Evidence" lists the benchmark ids with captured primary-source results. ✅ = has evidence, ⏳ = zero evidence anywhere.

| Model                       | Provider    | Utility | Evidence                                                                                      |
| --------------------------- | ----------- | ------- | --------------------------------------------------------------------------------------------- |
| GPT-5 mini                  | OpenAI      | —       | verified, multilingual, program                                                               |
| GPT-5.3-Codex               | OpenAI      | —       | qna, tests, refactor, terminal (2.1)                                                          |
| GPT-5.4                     | OpenAI      | —       | coding, qna, tests, refactor, terminal (2.1), features, optimization, program, pro (original) |
| GPT-5.4 mini                | OpenAI      | —       | coding, terminal (2.1), program                                                               |
| GPT-5.4 nano                | OpenAI      | ✅      | coding                                                                                        |
| GPT-5.5                     | OpenAI      | —       | coding, qna, tests, refactor, features, optimization, program, livebench2                     |
| GPT-5.6 Luna                | OpenAI      | —       | coding, rebench, terminal4, livebench2                                                        |
| GPT-5.6 Sol                 | OpenAI      | —       | coding, qna, tests, optimization, rebench, program, terminal4, pro2, livebench2               |
| GPT-5.6 Terra               | OpenAI      | —       | coding, terminal4, pro2, livebench2                                                           |
| GPT-6 Astra                 | OpenAI      | —       | coding, qna, tests, refactor, optimization, terminal4, pro2, livebench2                       |
| GPT-6 Luna                  | OpenAI      | —       | coding, terminal4, livebench2                                                                 |
| GPT-6 Sol                   | OpenAI      | —       | coding, terminal4, livebench2                                                                 |
| GPT-6.1 Sol                 | OpenAI      | —       | coding, terminal4, pro2, livebench2                                                           |
| GPT-4o                      | OpenAI      | ✅      | review, libraries, algorithmic, optimization (0)                                              |
| GPT-4o mini                 | OpenAI      | ✅      | review, libraries, algorithmic                                                                |
| GPT-4.1                     | OpenAI      | ✅      | security, polyglot                                                                            |
| Claude Haiku 4.5            | Anthropic   | —       | verified, review, pro (original), multilingual, program, livebench2                           |
| Claude Haiku 5.5            | Anthropic   | —       | coding, pro2, livebench2                                                                      |
| Claude Sonnet 4.6           | Anthropic   | —       | coding, architecture, qna, tests, refactor, review, terminal (2.1), program, livebench2       |
| Claude Sonnet 5             | Anthropic   | —       | coding, optimization, rebench, terminal4, pro2, livebench2                                    |
| Claude Sonnet 5.5           | Anthropic   | —       | coding, terminal4, pro2, livebench2                                                           |
| Claude Opus 4.8             | Anthropic   | —       | coding, qna, tests, refactor, optimization, program, terminal4, livebench2                    |
| Claude Opus 4.8 (fast mode) | Anthropic   | —       | ⏳                                                                                            |
| Claude Opus 5               | Anthropic   | —       | coding, qna, tests, rebench, program, terminal4, pro2, livebench2                             |
| Claude Opus 5.5             | Anthropic   | —       | coding, terminal4, livebench2                                                                 |
| Claude Fable 5              | Anthropic   | —       | coding, qna, tests, refactor, optimization, rebench, terminal4, livebench2                    |
| Claude Fable 5.1            | Anthropic   | —       | coding, qna, tests, refactor, optimization, terminal4, pro2, livebench2                       |
| Gemini 3.7 Flash            | Google      | —       | coding, program, terminal4, livebench2                                                        |
| Gemini 3.8 Flash            | Google      | —       | coding, qna, tests, refactor, terminal4, pro2, livebench2                                     |
| Gemini 4 Argon              | Google      | —       | livebench2                                                                                    |
| MAI-Code-1.1-Flash          | Microsoft   | —       | ⏳                                                                                            |
| Kimi K3                     | Moonshot AI | —       | coding, pro2, livebench2                                                                      |
| Grok 4.5                    | xAI         | —       | coding, rebench, terminal4, livebench2                                                        |
| Grok 4.6                    | xAI         | —       | coding, terminal4, livebench2                                                                 |
| Grok 4.7                    | xAI         | —       | coding, terminal4, livebench2                                                                 |

Notes carried in `dist/data.js`: Gemini 3.7/3.8 Flash promotional Copilot pricing through 2026-12-31; Gemini 4 Argon promotional pricing until 2026-12-01 (GA, Powerful; GitHub lists it as not on Copilot Pro and not on GitHub.com); utility models power background features and are not selectable; `fast mode` is GA-listed but keeps "preview" in its name; Fable 5, Fable 5.1 and GPT-5.6 Sol have elevated refusal-related failures on parts of SWE Atlas; Scale abbreviates GPT-5.3-Codex as "GPT 5.3 (Codex)". Sonnet 4.6 remains for annual-plan individuals. Claude Sonnet 5.5 was added 2026-09-29, GPT-6.1 Sol 2026-09-30, Claude Haiku 5.5 2026-10-08 and Gemini 4 Argon 2026-10-14, each after GitHub listed it as GA. **Removed 2026-10-14:** Claude Opus 4.7, Gemini 3.5 Flash, Gemini 3.6 Flash and Kimi K2.7 Code — retired 2026-10-02 and no longer in GitHub's supported-models or pricing tables; their evidence rows were dropped with them (git history keeps them).

## 3. Benchmark inventory (22 measures / editions)

Main-lens selection is one benchmark per capability (`dist/scoring.js`). Historical editions stay in the historical view.

| id           | Benchmark                                             | Capability            | Main lens?             | Scale                        | Coverage today          |
| ------------ | ----------------------------------------------------- | --------------------- | ---------------------- | ---------------------------- | ----------------------- |
| coding       | LiveBench 1.0 · Coding (LiveBench-2026-06-25, /v1/)   | General coding        | historical             | /100, category avg           | 26 models               |
| architecture | R2ABench (Paper v1 · Table 3 · Full PRD · Direct)     | Architecture          | ✅                     | Node F1 × 100                | 1 model (Sonnet 4.6) ⏳ |
| qna          | SWE Atlas · Codebase QnA                              | Codebase Q&A          | ✅ (equal-weight trio) | task resolve %               | 11 models               |
| tests        | SWE Atlas · Test Writing                              | Test writing          | ✅ (trio)              | %                            | 11 models               |
| refactor     | SWE Atlas · Refactoring                               | Refactoring           | ✅ (trio)              | %                            | 9 models ⏳             |
| terminal     | Terminal-Bench 2.1 (Terminus 2)                       | Terminal              | historical             | %                            | 4 models                |
| terminal4    | Terminal-Bench 4.0 (native agents)                    | Terminal              | ✅ (selected)          | % + 95% CI                   | 19 models               |
| verified     | SWE-bench Verified · Bash Only (mini-SWE-agent 2.0.0) | Fixing bugs           | ✅                     | %                            | 2 models ⏳             |
| livebench2   | LiveBench 2.0 · Coding (release 2026-10-13, 29 tasks) | General coding        | ✅ default             | /100, mean task score        | 25 models               |
| pro          | SWE-Bench Pro · Public (original)                     | Complex code changes  | historical             | %                            | 2 models                |
| pro2         | SWE-Bench Pro V2 Full (2026-09-22 split)              | Complex code changes  | ✅ (selected)          | % + CI                       | 11 models               |
| rebench      | SWE-rebench (window 2026-05-15 → 2026-07-01)          | Complex code changes  | selectable (not lens)  | % + 95% CI                   | 6 models                |
| program      | ProgramBench (200 tasks · 2026-09-28)                 | Building programs     | ✅ new capability      | % resolved                   | 10 models               |
| features     | FeatureBench (Lite · v1.0 · resolved)                 | Implementing features | ✅                     | whole-task %                 | 2 models ⏳             |
| security     | BaxBench (no security reminder)                       | Secure coding         | ✅                     | % passing functional+exploit | 1 utility model ⏳      |
| review       | SWE-PRBench (eval_100 · GPT-5.2 judge)                | Code review           | ✅                     | composite × 100              | 4 models (2 utility) ⏳ |
| libraries    | BigCodeBench (Full · Instruct · v0.1.0)               | Libraries & APIs      | ✅                     | pass@1                       | 2 utility models ⏳     |
| polyglot     | Aider Polyglot (225 exercises · pass rate 2)          | Multilingual editing  | ✅ (selectable)        | %                            | 1 utility model ⏳      |
| multilingual | SWE-bench Multilingual (300 tasks · 9 languages)      | Multilingual editing  | ✅ (selectable)        | % resolve                    | 2 models                |
| algorithmic  | LiveCodeBench (454-problem window)                    | Algorithmic coding    | ✅                     | pass@1                       | 2 utility models ⏳     |
| optimization | GSO (102 tasks · Opt@1 · updated 2026-09-27)          | Making code faster    | ✅                     | Opt@1 %                      | 9 models (1 utility)    |
| completion   | CrossCodeEval (NeurIPS 2023)                          | Cross-file completion | ✅ but **gap**         | —                            | 0 models ⏳             |

Scoring defaults: only General coding (`coding` capability → `livebench2`) starts at weight 100; every other capability defaults to 0 and new capabilities join at 0. Version-1 → version-2 preference migration forces selections `livebench2`/`terminal4`/`pro2`. Cost never enters the score.

## 4. ⏳ Open gaps / next actions

Ordered by value-to-effort. Each item names the blocker, not just the wish.

1. **Zero-evidence models:** MAI-Code-1.1-Flash and Claude Opus 4.8 (fast mode). Search LiveBench (1.0 and 2.0), Terminal-Bench 4.0, SWE-Bench Pro V2, SWE-rebench and SWE Atlas for new entries. Do **not** backfill from a different model version. GPT-5.4, GPT-5.4 mini and GPT-5.4 nano have LiveBench 1.0 but no 2.0 row, so they are not scored by the default lens.
2. **LiveBench 2.0 launched 2026-10-13** at livebench.ai and became the General coding lens (`livebench2`) on 2026-10-14; LiveBench 1.0 (edition 2026-06-25) moved to livebench.ai/v1/ and sits in the historical view. 2.0 also publishes Agentic, Browser Use, Research and Design suites (not captured).
3. **SWE-rebench window drift:** the captured values come from the 2026-05-15 → 2026-07-01 window (111 tasks). The leaderboard rolls monthly — re-capture the whole window at every refresh and record the window dates in the benchmark version string; never mix windows. New catalog models can appear here first (this is where GPT-5.6 Sol/Luna and Sonnet 5 surfaced).
4. **ProgramBench is growing:** 10 catalog models captured on the 2026-09-28 update (the full 25-row table, including several 0% results). Fable 5/5.1 and GPT-6 rows are not yet published there.
5. **GSO elicitation changed on 2026-09-27:** the leaderboard now asks models to keep measuring and improving after their first speedup. The four rows captured that day (Fable 5.1, GPT-6 Astra, Fable 5, GPT-5.6 Sol) are not directly comparable to earlier-dated rows; the version string records the update date.
6. **SWE-bench experiments repo is the fresher source** for the SWE-bench family: new common-harness (mini-SWE-agent) submissions land in `SWE-bench/experiments/evaluation/<split>/` before (or without) appearing in the rendered leaderboard. This pass surfaced Gemini 3.5 Flash Verified 71.8 (2026-09-01, mini 2.4.2) and the Multilingual batch there (Gemini 3.5 Flash has since left the catalog). Re-scan `evaluation/verified` and `evaluation/multilingual` per refresh for catalog models.
7. **SWE-bench Multimodal v2 (2026-09-01)** still has no catalog-model rows on any harness; all submissions are agent systems (GUIRepair, ZenCoder, Refact) or 2024-era models. Watch for mini-SWE-agent rows.
8. **Rejected candidates (2026-09-25 sweep):** SWE-bench Multilingual baseline paper (only Claude 3.7 Sonnet, superseded by the mini-SWE-agent batch now captured); MLE-bench (agent-system leaderboard, submissions closed 2026-04-24, v2 pending in openai/frontier-evals); CodeClash (frozen Nov 2025, 8 old models, goal-oriented not task-resolution); Commit-0 (frozen 2024, Sonnet 3.5 only); KernelBench (site unreachable, no maintained leaderboard); SWE-Lancer (merged into openai/prepareded, no current leaderboard); SWE-rebench v2 dataset exists but the leaderboard still serves the v1 window. Re-evaluate when any of these change.

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
node check.mjs          # JSON counts must match the baseline above (or an intended new one) + release-stamp assertions
npm run check           # node --check on all files
npm run format:check    # Prettier (printWidth 100, semi:false, singleQuote:true)
```

Plus a browser smoke test via `node serve.mjs` on http://127.0.0.1:4173: search, sort, model details, missing-score handling, preference persistence, WebMCP weight rejection. Run node/npm through nvm (`nvm use --lts`).

## 8. Release protocol (date-time on the site updates every release)

The site displays two distinct stamps: `checked` (when sources were last verified by hand, set during data refresh, step 4 above) and `released` (date-time the exact running build was published, set automatically per release). The footer and every model-details dialog render the live `released` value from `dist/data.js`; `dist/version.json` exposes both stamps plus the deployed commit at `/version.json`.

Release flow — **always via `release.mjs`**, never a bare `wrangler pages deploy`:

```sh
# data changes finished and browser smoke test passed:
git add -A && git commit -m "…" && git push origin main
npm run release:deploy   # refuses on dirty/unpushed tree → stamps released (UTC) + version.json → gates → deploy
git add dist/ && git commit -m "Stamp release <ISO timestamp>" && git push origin main
```

`check.mjs` enforces: `checked` is YYYY-MM-DD; `released` is an ISO date-time with `Z`; `released ≥ checked`; `version.json` matches both and carries the commit hash; the `index.html` footer contains the release stamp. So the stamps cannot silently drift — a stale `version.json` fails the suite.
