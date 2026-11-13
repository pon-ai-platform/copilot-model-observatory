# TASK — Keep the catalog current: all GitHub Copilot models + all relevant benchmarks

Living task document. Update it in the same commit as any data change.

- **Snapshot checked:** 2026-11-13. Rechecked the GitHub catalog/pricing and primary benchmark sources. Vals marks Code Migration v1.0 archived and v1.1 current, so the Pi-harness results are now the current edition and v1.0 remains historical. Confirmed Vibe Code Bench through its 2026-11-11 update and retained LiveBench 2.0 release 2026-11-06. FeatureBench v1.1 Fast remains selectable, but Lite is the publisher's empty default tab.
- **Acceptance baseline:** `node check.mjs` → `{"models":34,"withEvidence":30,"defaultScored":16,"benchmarks":27,"checks":"passed"}` after release. The smaller advanced-mode default coverage is intentional: the latest LiveBench release covers 16 catalog models, and older-edition results are not mixed into it.
  - Capture this line **before** editing; a refactor may only change data, not these counts, unless the change itself adds/removes rows or evidence.
  - Previous baseline (2026-11-09): `{"models":32,"withEvidence":28,"defaultScored":24,"benchmarks":23,"checks":"passed"}`. Earlier changes are preserved in git history.
- **Status:** task is open-ended. Sections marked ⏳ are known gaps.

## 1. Task statement

Keep `dist/data.js` + `dist/expanded.js` (the dataset) in sync with two moving targets:

1. **Model catalog** — every model GitHub lists for Copilot (`docs.github.com/.../ai-models/supported-models`) plus its token pricing (`docs.github.com/.../copilot-billing/models-and-pricing`). Utility/background models are tracked but marked `utility: true`.
2. **Benchmark evidence** — every benchmark that measures a Copilot-relevant coding capability and publishes results for catalog models, at primary-source quality (value, agent, result date if available, published uncertainty if available).

Nothing ships without primary-source attribution; no backend, no auto-refresh.

## 2. Model inventory (current state)

34 models. "Evidence" lists captured primary-source benchmark IDs; `terminal`, `terminal4`, and `terminal41` are separate Terminal-Bench editions; `livebench2old`/`lbagenticold` are the October LiveBench edition; `migrationold` is archived Code Migration v1.0. The current Code Migration edition is `migration` (v1.1). ??? = utility, ??? = no evidence.

| Model                       | Provider    | Utility | Evidence                                                                                                                                                                                                |
| --------------------------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GPT-5.3-Codex               | OpenAI      | ???     | qna, tests, refactor, terminal, vibecode, ioi                                                                                                                                                           |
| GPT-5.4 nano                | OpenAI      | ???     | coding, vibecode, migrationold                                                                                                                                                                          |
| GPT-5.6 Luna                | OpenAI      | ???     | coding, rebench, terminal4, terminal41, livebench2old, vibecode, migrationold, cyber, ioi, vcb100, lbagenticold                                                                                         |
| GPT-5.6 Sol                 | OpenAI      | ???     | coding, qna, tests, features, optimization, rebench, program, terminal4, terminal41, pro2, livebench2old, vibecode, migrationold, cyber, ioi, vcb100, lbagenticold                                      |
| GPT-5.6 Terra               | OpenAI      | ???     | coding, terminal4, terminal41, pro2, livebench2old, livebench2, vibecode, migrationold, cyber, ioi, vcb100, lbagenticold, lbagentic                                                                     |
| GPT-6 Astra                 | OpenAI      | ???     | coding, qna, tests, refactor, optimization, program, terminal4, terminal41, pro2, livebench2old, livebench2, vibecode, migration, migrationold, cyber, ioi, vcb100, multimodal, lbagenticold, lbagentic |
| GPT-6 Luna                  | OpenAI      | ???     | coding, terminal4, terminal41, livebench2old, livebench2, vibecode, migration, migrationold, cyber, ioi, multimodal, lbagenticold, lbagentic                                                            |
| GPT-6 Sol                   | OpenAI      | ???     | coding, terminal4, terminal41, livebench2old, vibecode, migrationold, cyber, ioi, lbagenticold                                                                                                          |
| GPT-6.1 Sol                 | OpenAI      | ???     | coding, terminal4, terminal41, pro2, livebench2old, livebench2, vibecode, migration, migrationold, cyber, ioi, multimodal, lbagenticold, lbagentic                                                      |
| GPT-6.1 Terra               | OpenAI      | ???     | livebench2old, livebench2, vibecode, lbagenticold, lbagentic                                                                                                                                            |
| GPT Image 2.5 Flare         | OpenAI      | ???     | n/a (image tool)                                                                                                                                                                                        |
| Claude Haiku 4.5            | Anthropic   | ???     | verified, pro, review, multilingual, program, livebench2old, vibecode, migrationold, lbagenticold                                                                                                       |
| Claude Haiku 5.5            | Anthropic   | ???     | coding, pro2, livebench2old, livebench2, vibecode, migration, migrationold, cyber, ioi, vcb100, multimodal, lbagenticold, lbagentic                                                                     |
| Claude Sonnet 4.6           | Anthropic   | ???     | coding, qna, tests, refactor, terminal, review, program, livebench2old, vibecode, migrationold, lbagenticold                                                                                            |
| Claude Sonnet 5             | Anthropic   | ???     | coding, optimization, rebench, terminal4, terminal41, pro2, livebench2old, vibecode, migrationold, cyber, ioi, vcb100, lbagenticold                                                                     |
| Claude Sonnet 5.5           | Anthropic   | ???     | coding, terminal4, terminal41, pro2, livebench2old, livebench2, vibecode, migration, migrationold, cyber, ioi, multimodal, lbagenticold, lbagentic                                                      |
| Claude Opus 4.8             | Anthropic   | ???     | coding, qna, tests, refactor, optimization, program, terminal4, terminal41, livebench2old, vibecode, migrationold, lbagenticold                                                                         |
| Claude Opus 4.8 (fast mode) | Anthropic   | ???     | ???                                                                                                                                                                                                     |
| Claude Opus 5               | Anthropic   | ???     | coding, qna, tests, features, rebench, program, terminal4, terminal41, pro2, livebench2old, vibecode, migrationold, cyber, ioi, vcb100, lbagenticold                                                    |
| Claude Opus 5.5             | Anthropic   | ???     | coding, program, terminal4, terminal41, livebench2old, livebench2, vibecode, migration, migrationold, cyber, ioi, vcb100, multimodal, lbagenticold, lbagentic                                           |
| Claude Fable 5              | Anthropic   | ???     | coding, qna, tests, refactor, optimization, rebench, terminal4, terminal41, livebench2old, vibecode, migrationold, lbagenticold                                                                         |
| Claude Fable 5.1            | Anthropic   | ???     | coding, qna, tests, refactor, optimization, program, terminal4, terminal41, pro2, livebench2old, livebench2, vibecode, migrationold, cyber, ioi, vcb100, multimodal, lbagenticold, lbagentic            |
| Claude Fable 5.2            | Anthropic   | ???     | livebench2, vibecode, migration, multimodal, lbagentic                                                                                                                                                  |
| Gemini 3.8 Flash            | Google      | ???     | coding, qna, tests, refactor, terminal4, terminal41, pro2, livebench2old, livebench2, vibecode, migration, migrationold, cyber, ioi, vcb100, multimodal, lbagenticold, lbagentic                        |
| Gemini 4 Argon              | Google      | ???     | pro2, livebench2old, livebench2, vibecode, migration, migrationold, cyber, ioi, vcb100, multimodal, lbagenticold, lbagentic                                                                             |
| Gemini 4 Carbon             | Google      | ???     | livebench2, vibecode, lbagentic                                                                                                                                                                         |
| MAI-Code-1.1-Flash          | Microsoft   | ???     | ???                                                                                                                                                                                                     |
| Kimi K3                     | Moonshot AI | ???     | coding, features, pro2, livebench2old, livebench2, vibecode, migration, migrationold, cyber, ioi, vcb100, multimodal, lbagenticold, lbagentic                                                           |
| Grok 4.5                    | xAI         | ???     | coding, rebench, terminal4, terminal41, livebench2old, vibecode, migrationold, cyber, ioi, lbagenticold                                                                                                 |
| Grok 4.6                    | xAI         | ???     | coding, terminal4, terminal41, livebench2old, livebench2, vibecode, migrationold, cyber, ioi, vcb100, lbagenticold, lbagentic                                                                           |
| Grok 4.7                    | xAI         | ???     | coding, terminal4, terminal41, livebench2old, livebench2, vibecode, migration, migrationold, cyber, ioi, multimodal, lbagenticold, lbagentic                                                            |
| GPT-4o                      | OpenAI      | ???     | review, optimization                                                                                                                                                                                    |
| GPT-4o mini                 | OpenAI      | ???     | review                                                                                                                                                                                                  |
| GPT-4.1                     | OpenAI      | ???     | ???                                                                                                                                                                                                     |

Vals AI results also carry alternative-harness rows (Vibe Code Bench: Claude Code; CyberBench: Opus 5.5 CVP and Sonnet 5 Cyber Range) and per-result fallback/refusal flags in `context`. Code Migration v1.1 is the current Pi-harness edition; archived v1.0 results are kept separately because the harness and hidden test suite differ. Vals `run_date` values are captured where published; publisher-update dates are not evaluation dates.

Claude Fable 5.2 and Gemini 4 Carbon were added on 2026-11-11. Carbon's listed promotional rates end on 2026-12-01; its subsequent rates are recorded in model details.

Notes carried in `dist/data.js`: Gemini 3.8 Flash promotional Copilot pricing through 2026-12-31; Gemini 4 Argon promotional pricing until 2026-12-01 (GA, Powerful; GitHub lists it as not on Copilot Pro and not on GitHub.com); GPT-6.1 Terra note records OpenAI's 50.3% Terminal-Bench 4.0 launch score and Vals AI's 49.49% ± 1.82% rerun while `tbench.ai` has not yet added a row; GPT Image 2.5 Flare (added 2026-11-02, Public preview) is a dedicated image-generation tool model invoked by the session's reasoning model and managed via model policy ($5 text input, $1.25 cached text input, $8 image input, $2 cached image input, $30 image output per 1M tokens, marked `utility: true` so it does not compete as a selectable chat/coding model); utility models power background features and are not selectable; `fast mode` is GA-listed but keeps "preview" in its name; Fable 5, Fable 5.1 and GPT-5.6 Sol have elevated refusal-related failures on parts of SWE Atlas; Scale abbreviates GPT-5.3-Codex as "GPT 5.3 (Codex)". Sonnet 4.6 remains for annual-plan individuals. Claude Sonnet 5.5 was added 2026-09-29, GPT-6.1 Sol 2026-09-30, Claude Haiku 5.5 2026-10-08, Gemini 4 Argon 2026-10-14 and GPT-6.1 Terra 2026-10-27, each after GitHub listed it as GA. **Removed 2026-10-14:** Claude Opus 4.7, Gemini 3.5 Flash, Gemini 3.6 Flash and Kimi K2.7 Code (retired 2026-10-02). **Removed 2026-10-27:** GPT-5 mini, GPT-5.4, GPT-5.4 mini, GPT-5.5 and Gemini 3.7 Flash — retired 2026-10-19 and no longer in GitHub's supported-models or pricing tables (`GPT-5.4 nano` remains as a utility model); their evidence rows were dropped with them (git history keeps them).

## 3. Benchmark inventory (27 measures / editions)

Main-lens selection is one benchmark per capability (`dist/scoring.js`). Historical editions stay in the historical view.

| id            | Benchmark                                             | Capability            | Main lens?             | Scale                    | Coverage today          |
| ------------- | ----------------------------------------------------- | --------------------- | ---------------------- | ------------------------ | ----------------------- |
| coding        | LiveBench 1.0 · Coding (LiveBench-2026-06-25, /v1/)   | General coding        | historical             | /100, category avg       | 22 models (1 utility)   |
| qna           | SWE Atlas · Codebase QnA                              | Codebase Q&A          | ✅ (equal-weight trio) | task resolve %           | 9 models                |
| tests         | SWE Atlas · Test Writing                              | Test writing          | ✅ (trio)              | %                        | 9 models                |
| refactor      | SWE Atlas · Refactoring                               | Refactoring           | ✅ (trio)              | %                        | 7 models ⏳             |
| terminal      | Terminal-Bench 2.1 (Terminus 2)                       | Terminal              | historical             | %                        | 2 models                |
| terminal4     | Terminal-Bench 4.0 (native agents)                    | Terminal              | historical             | % + 95% CI               | 18 models               |
| terminal41    | Terminal-Bench 4.1 (regraded, native agents)          | Terminal              | ✅ (selected)          | % + 95% CI               | 18 models               |
| verified      | SWE-bench Verified · Bash Only (mini-SWE-agent 2.0.0) | Fixing bugs           | selectable             | %                        | 1 model ⏳              |
| multimodal    | SWE-bench Multimodal (Vals AI run, 480 tasks)         | Fixing bugs           | ✅ default             | %, ± published           | 12 models               |
| lbagentic     | LiveBench 2.0 · Agentic (2026-11-06, 18 tasks)        | Long-running agents   | ✅ default             | /100, mean task score    | 16 models               |
| livebench2    | LiveBench 2.0 · Coding (2026-11-06, 24 tasks)         | General coding        | ✅ default             | /100, mean task score    | 16 models               |
| lbagenticold  | LiveBench 2.0 · Agentic (2026-10-14, 18 tasks)        | Long-running agents   | historical             | /100, mean task score    | 24 models               |
| livebench2old | LiveBench 2.0 · Coding (2026-10-14, 29 tasks)         | General coding        | historical             | /100, mean task score    | 24 models               |
| pro           | SWE-Bench Pro · Public (original)                     | Complex code changes  | historical             | %                        | 1 model                 |
| pro2          | SWE-Bench Pro V2 Full (2026-09-22 split)              | Complex code changes  | ✅ (selected)          | % + CI                   | 12 models               |
| rebench       | SWE-rebench (window 2026-05-15 → 2026-07-01)          | Complex code changes  | selectable (not lens)  | % + 95% CI               | 6 models                |
| program       | ProgramBench (200 tasks · 2026-10-22)                 | Building programs     | ✅ new capability      | % resolved               | 8 models                |
| features      | FeatureBench (Fast · v1.1 · 100 tasks · resolved)     | Implementing features | selectable             | whole-task %             | 3 models                |
| vcb100        | Vibe Code Bench 1-100 (Vals AI, 50 tasks)             | Implementing features | ✅ default             | %, ± published           | 13 models               |
| vibecode      | Vibe Code Bench v1.1 (Vals AI, OpenHands, 50 apps)    | Building apps         | ✅ new capability      | %, ± published           | 28 models (1 utility)   |
| migration     | Code Migration v1.1 (Vals AI, Pi harness, 130 tasks)  | Migrating code        | ✅ new capability      | hidden-test pass %       | 11 models               |
| migrationold  | Code Migration v1.0 (Vals AI, mini-SWE-agent)         | Migrating code        | historical             | hidden-test pass %       | 24 models               |
| cyber         | CyberBench v1.1 (Vals AI, 116 tasks)                  | Secure coding         | ✅ default             | %, refusals = failures ⚠ | 19 models               |
| review        | SWE-PRBench (eval_100 · GPT-5.2 judge)                | Code review           | ✅                     | composite × 100          | 4 models (2 utility) ⏳ |
| multilingual  | SWE-bench Multilingual (300 tasks · 9 languages)      | Multilingual editing  | ✅                     | % resolve                | 1 model ⏳              |
| ioi           | IOI 2024–2026 (Vals AI, 18 problems)                  | Algorithmic coding    | ✅ default             | %, ± published           | 20 models               |
| optimization  | GSO (102 tasks · Opt@1 · updated 2026-09-27)          | Making code faster    | ✅                     | Opt@1 %                  | 7 models (1 utility)    |

Scoring defaults: the company lens opens in **topic mode** — five sliders (one per Overview topic, equal weights, `topicDefaults`), score = weighted mean of the model's topic standings, requiring scores covering ≥ half of the weight (`topicLens`); the Best in lens / Best value markers require ≥ 80% coverage (`awardScore`). Saved preferences open in topic mode unless the visitor explicitly chose advanced (older saved per-benchmark weights are kept behind the Advanced toggle). **Advanced mode** keeps per-capability sliders: only General coding (`coding` capability → `livebench2`) starts at weight 100; every other capability defaults to 0 and new capabilities join at 0. Fifteen capabilities (Cross-file completion, Code review and Multilingual editing lost their sliders on 2026-10-14: 0–2 selectable models with results; Fixing bugs returned the same day with SWE-bench Multimodal as default, and Long-running agent work was added for LiveBench 2.0 Agentic). `defaultScored` in the baseline refers to advanced-mode defaults. Preference migration forces selections `livebench2`/`terminal41`/`pro2`, drops weights for removed capabilities and resets saved selections that no longer exist. Cost never enters the score. Aider Polyglot was dropped on 2026-10-14 (leaderboard frozen since 2025-11-20, only GPT-4.1 overlapped).

**Overview (topic scores, `dist/scoring.js` `topics`/`topicScores`):** the landing view ("Topic scores (same as the lens)"), with the company score column and markers; its columns match the topic sliders. Five topics: Writing code (livebench2, ioi, migration), Agents & issue fixing (terminal41, lbagentic, pro2, multimodal, rebench), Building software (vibecode, program, vcb100), Working in a codebase (qna, tests, refactor), Quality & security (cyber, optimization). Per benchmark, each selectable model gets a rank-based standing 0–100 among selectable models with a result (ties share the midpoint); a benchmark only counts once ≥ 8 selectable models have a result (SWE-rebench currently does not); a topic score is the mean standing and needs results on at least half of the counted benchmarks. Topic mode uses these standings; advanced mode uses raw values. Clicking a topic score shows raw values, ranks, agents and source links.

## 4. ⏳ Open gaps / next actions

Ordered by value-to-effort. Each item names the blocker, not just the wish.

1. **Zero-evidence models:** MAI-Code-1.1-Flash and Claude Opus 4.8 (fast mode), plus utility GPT-4.1 and the image-generation tool GPT Image 2.5 Flare. Search LiveBench (1.0 and 2.0), Terminal-Bench, SWE-Bench Pro V2, SWE-rebench and SWE Atlas for new entries. Do **not** backfill from a different model version. The 2026-11-06 LiveBench release covers only 16 of the 34 catalog models; the rest are not scored by the advanced-mode default lens.
2. **LiveBench 2.0 editions:** the current 2026-11-06 release has 24 Coding tasks and 18 Agentic tasks. The 2026-10-14 historical release has 29 Coding tasks and 18 differently composed Agentic tasks, with 24 catalog models; 2026-10-25 replaced four Agentic tasks and covers 14 catalog models, retained as alternatives with their own version and source. Do not mix task sets in a main column. LiveBench 1.0 (2026-06-25) remains historical.
3. **SWE-rebench window drift:** the captured values come from the 2026-05-15 → 2026-07-01 window (111 tasks). The leaderboard rolls monthly — re-capture the whole window at every refresh and record the window dates in the benchmark version string; never mix windows. New catalog models can appear here first (this is where GPT-5.6 Sol/Luna and Sonnet 5 surfaced).
4. **ProgramBench is growing:** 8 current catalog models captured on the 2026-10-22 update (30-row table, adding Claude Opus 5.5 at 18.5%, Claude Fable 5.1 at 9.0% and GPT-6 Astra at 5.0%, plus several 0% results).
5. **GSO elicitation changed on 2026-09-27:** the leaderboard now asks models to keep measuring and improving after their first speedup. The four rows captured that day (Fable 5.1, GPT-6 Astra, Fable 5, GPT-5.6 Sol) are not directly comparable to earlier-dated rows; the version string records the update date.
6. **SWE-bench experiments repo is the fresher source** for the SWE-bench family: new common-harness (mini-SWE-agent) submissions land in `SWE-bench/experiments/evaluation/<split>/` before (or without) appearing in the rendered leaderboard. This pass surfaced Gemini 3.5 Flash Verified 71.8 (2026-09-01, mini 2.4.2) and the Multilingual batch there (Gemini 3.5 Flash has since left the catalog). Re-scan `evaluation/verified` and `evaluation/multilingual` per refresh for catalog models.
7. **SWE-bench Multimodal** is captured from the Vals AI run (12 catalog models, mini-SWE-agent, no network); the official leaderboard still has no current catalog-model rows.
   **LMArena Code Arena | WebDev** (arena.ai/leaderboard/webdev, 143 models, updated 2026-10-13) is live and covers current models (Opus 5.5 max 1811, GPT-6 Astra max 1780, Sonnet 5.5 xhigh …) but publishes Elo-style preference scores (± CI, vote counts), not 0–100 success rates. Not captured: it would need its own scale handling (it could only enter the Overview via rank-based standing). Revisit if a preference signal is wanted.
   **Code review:** no maintained code-review leaderboard with current catalog models found (2026-10-14 search); SWE-PRBench remains the only source.
   **Vals AI (vals.ai/benchmarks) is a primary source** for Vibe Code Bench, Code Migration, CyberBench, IOI, Vibe Code Bench 1-100 and SWE-bench Multimodal. Refresh by opening each page in the browser, clicking "View N more models", and reading the detailed table (score ± and fallback/refusal flags). Code Migration v1.0 is archived; v1.1 is current and must remain a separate edition because its Pi harness and revised hidden tests are not comparable with v1.0. Keep Terminal-Bench and ProgramBench from their original publishers, not Vals' reruns. CyberBench scores for GPT-6 Astra, GPT-6.1 Sol and Gemini 3.8 Flash are dominated by ~50% provider refusals. Vals SRE Bench (binary reverse engineering without source code) is not captured: specialized reverse-engineering workflow with 31–39% refusals on GPT-6 and 75–91% fallbacks on Opus 5.5 / Fable 5.1. SkillsBench and Scale MCP Atlas still lack most late-2026 frontier models.
   The page's preloaded `/_astro/benchmark_view_*.json` is also a primary-source cross-check: `metadata.updated` dates the publisher update, while `tasks.overall` contains unrounded `accuracy` and `stderr`. Match exact model versions and harnesses; the static HTML table includes all rows even when the interactive table initially hides some.
8. **Dropped 2026-10-14 (utility-only or empty):** BaxBench (GPT-4.1 only), BigCodeBench and LiveCodeBench (GPT-4o / GPT-4o mini only), CrossCodeEval (no results). Re-add only if current selectable models get results. Refusal marker: evidence with `refusals` ≥ 25% (parsed from Vals flags) shows ⚠ in benchmark and topic cells; the score itself is unchanged.
9. **Rejected candidates (2026-09-25 sweep):** SWE-bench Multilingual baseline paper (only Claude 3.7 Sonnet, superseded by the mini-SWE-agent batch now captured); MLE-bench (agent-system leaderboard, submissions closed 2026-04-24, v2 pending in openai/frontier-evals); CodeClash (frozen Nov 2025, 8 old models, goal-oriented not task-resolution); Commit-0 (frozen 2024, Sonnet 3.5 only); KernelBench (site unreachable, no maintained leaderboard); SWE-Lancer (merged into openai/prepareded, no current leaderboard); SWE-rebench v2 dataset exists but the leaderboard still serves the v1 window. Re-evaluate when any of these change.

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
node check.mjs --pending-release  # data commit: allow the last release's older checked date/counts
node check.mjs                    # strict gate after stamps are regenerated
npm run check                     # node --check on all files
npm run format:check              # Prettier (printWidth 100, semi:false, singleQuote:true)
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

`check.mjs` enforces: `checked` is YYYY-MM-DD; `released` is an ISO date-time with `Z`; `released ≥ checked`; `version.json` matches both stamps and the current dataset counts and carries a commit hash; the `index.html` static snapshot and footer match the source-check date and release time; every JS/CSS URL in `index.html` (including the import map for `data.js`/`scoring.js`/`expanded.js`) carries `?v=`, which the release rewrites to the stamp, because the custom domain caches JS/CSS for 4 hours. The pending-release mode relaxes only the expected old checked date/counts before deployment; `release.mjs` runs the strict gate after stamping.
