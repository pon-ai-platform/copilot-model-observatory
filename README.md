# Copilot Model Observatory

Single-page comparison of the named GitHub Copilot model catalog, official token prices, sourced engineering benchmark evidence and an always-visible weighted index. Plain HTML/CSS/ES modules; no build step and no third-party JavaScript shipped to the browser. (Prettier is a dev-only code formatter; it is not part of the deployed site.)

## Run

Run `node serve.mjs` from this directory and open http://127.0.0.1:4173. Run `node check.mjs` for dataset and scoring checks. `dist/` is the complete deployable static site.

`npm run format` reformats the source with Prettier and `npm run format:check` verifies formatting; both are developer conveniences and have no effect on the site.

## Data maintenance

[`TASK.md`](TASK.md) is the living task document tracking catalog and benchmark coverage.

`dist/data.js` contains the dated snapshot and primary-source URLs, separate from rendering and scoring. This version was checked on 2026-10-14; it does not automatically refresh. Update prices from GitHub's Copilot rate table, not vendor API pages. Retain cache write/read and long-context tiers. Compare the supported-model list and utility list; tenant-level enablement is not connected.

Each evidence record includes value, source, agent, result date if available, and published uncertainty if available. Missing results must remain absent. Do not fill from a different model version or silently combine benchmark editions. Alternative harness results belong in `alternatives`, not substituted into the main table. Source dates and unknown result dates must remain distinct.

18 benchmark measures/editions were included in an earlier snapshot; the catalog now tracks 23: SWE-rebench (rolling contamination-free issue window, selectable under Complex code changes), ProgramBench (rebuild a program from its binary, new Building programs capability) and SWE-bench Multilingual (issue resolution across 9 languages, selectable under Multilingual editing) were added on 2026-09-24/25, and LiveBench 2.0 Coding (bug fixes in a frozen production codebase) on 2026-10-14. LiveBench 2.0 Coding is now the General coding benchmark; LiveBench 1.0 Coding, served from livebench.ai/v1/ and no longer receiving new models, moved to the historical view. R2ABench (architecture diagrams) was dropped on 2026-10-14 because only one catalog model (Sonnet 4.6) had a result, and Aider Polyglot the same day because its leaderboard has been frozen since November 2025. Also on 2026-10-14, five Vals AI benchmarks were added: Vibe Code Bench v1.1 (new Building apps capability), Code Migration (new Migrating code capability), CyberBench v1.1 (default for Secure coding), IOI (default for Algorithmic coding) and Vibe Code Bench 1-100 (default for Implementing features; FeatureBench stays selectable). Vals AI publishes methodology but most of these use private test sets; fallbacks to other models and provider refusals are flagged per result, and results where the provider refused at least 25% of tasks carry a ⚠ marker (in benchmark and topic cells) because the score then reflects safety policy as much as skill. Also on 2026-10-14, BaxBench, BigCodeBench, LiveCodeBench and CrossCodeEval were dropped: their only results were for background utility models (or none).

Of the original eight, seven remain: LiveBench 1.0 Coding (historical), three SWE Atlas tasks, Terminal-Bench 2.1, SWE-bench Verified, original SWE-Bench Pro. `dist/expanded.js` adds FeatureBench (v1.0 Lite, whole tasks resolved), SWE-PRBench (overall × 100, eval_100), GSO (Opt@1), Terminal-Bench 4.0, and SWE-Bench Pro V2 Full. Historical versions remain separate. Code review and multilingual editing have little catalog-model overlap in this snapshot. No claim of exhaustive coverage is made. [`TASK.md`](TASK.md) tracks model/benchmark coverage and open gaps; 32 of 35 models now hold captured primary-source evidence.

The Atlas tables contain different agent setups, reasoning settings and budget/dataset revisions. The weighted index is therefore explicitly exploratory, not a controlled model-only ranking or Copilot performance measurement. Task success rates retain their percentage scale; LiveBench Coding (1.0 and 2.0) uses its 0–100 score; the weighted mean requires every metric with nonzero weight. Cost never enters this score. Published uncertainty is shown in evidence, not propagated as if independent.

Weights are browser-local preferences, not a shared enterprise policy. By default the company lens has five topic sliders (the Overview topics, equal weights); the company score is the weighted mean of a model's topic standings and needs scores covering at least half of the weight. "Advanced: weight individual benchmarks" switches to fifteen capability sliders on raw benchmark values (Long-running agent work uses LiveBench 2.0 Agentic; Fixing bugs defaults to SWE-bench Multimodal as run by Vals AI). Cross-file completion, Code review and Multilingual editing no longer have sliders (0–2 selectable models with results); their benchmarks stay in the table views and model details. In advanced mode each capability gets one weight and one fixed benchmark; adding another benchmark within a capability does not give it extra votes. Equal default weights cover the three Atlas tasks; new capabilities begin at zero. Version-1 preferences migrate to version-2, preserving weights. General coding always uses LiveBench 2.0 Coding. Terminal tasks and complex code changes always use Terminal-Bench 4.0 and SWE-Bench Pro V2; historical editions remain in the historical view. Publishing company defaults requires editing `dist/scoring.js`. There is no backend, tenant connection or automatic refresh job.

The **Topic scores (same as the lens)** view is the landing view: its five columns match the five default lens sliders, plus the company score. Five topics (Writing code; Agents & issue fixing; Building software; Working in a codebase; Quality & security) each combine two or three benchmarks. Raw percentages are not averaged: per benchmark a model's rank among the selectable Copilot models with a result becomes a standing from 0 (lowest) to 100 (best), ties sharing the midpoint, and the topic score is the mean standing. A benchmark counts once at least eight selectable models have a result; a topic needs results on at least half of its counted benchmarks, otherwise it shows —. This is relative standing, not an absolute skill score, and it is the only place rescaling is used. Clicking a topic score shows the raw values, ranks, agents and source links.

GSO initially published two GPT-5.4 scores for the same displayed setup; the leaderboard now labels them as reasoning settings — 31.4% (xHigh) feeds the lens, 25.5% (High) is retained in model details. Review false-positive rates are shown separately as lower-is-better; the main column uses the source's overall score. FeatureBench individual-test pass rate is context only. Dates labelled model release dates on Terminal-Bench are not copied into evaluation-date fields. Dated utility-model variants are identified in evidence; they are not guarantees about Copilot's background deployment.

## Verification

`check.mjs` verifies weighted arithmetic, zero versus missing, coverage, empty weights, invalid preferences, unique model IDs and evidence/price constraints, and the release stamps: `checked` must be a date, `released` an ISO date-time, `dist/version.json` must match both plus carry the deployed commit, and the footer must carry the release stamp. Browser checks cover search, sort, model details, missing-score handling and preference persistence. Company scores are always visible, including for profiles that previously hid them. The optional WebMCP interface uses the same local state and rejects invalid weights.

## Release protocol

Every release is date-time stamped so the site always shows when the exact running build was published:

- `dist/data.js` — `released` (ISO date-time, UTC) next to `checked`; rendered live in the footer and in every model-details dialog.
- `dist/index.html` — footer stamp text (static fallback for no-JS).
- `dist/version.json` — machine-readable: `commit`, `branch`, `checked`, `released`, and dataset counts. Served at `/version.json`.

The stamps are generated by `release.mjs`, which is the only supported deploy path:

```sh
npm run release         # verify clean+pushed tree, stamp released/version.json, run all gates (no deploy)
npm run release:deploy  # the same, then deploy dist to Cloudflare Pages
```

`release.mjs` refuses to run on a dirty tree or an unpushed HEAD (README rule: the deployed archive must match a commit), stamps the current UTC date-time, regenerates `version.json` from the pushed commit, and runs every gate before deploying. After any release, commit the regenerated stamp files so the repo matches what was published. The date and time on the site therefore always reflect the last release; `checked` still records when the data sources were last verified by hand.

## Deployment

Deployed to Cloudflare Pages on the Pon AI account as the `copilot-model-observatory` project. Do not deploy with a bare `wrangler pages deploy` — use `npm run release:deploy`, which stamps the release date-time (`released` in `dist/data.js`, the footer in `dist/index.html`, and `dist/version.json`), runs all gates, and only then deploys:

```sh
CLOUDFLARE_ACCOUNT_ID=7629d3d823c90f09e6b0f8b01d04462f npx wrangler pages deploy dist --project-name=copilot-model-observatory --branch=main --commit-dirty=false
```

Live site: https://copilot-models.pon-ai.com — publication is public. The custom domain is a CNAME in the `pon-ai.com` zone pointing at the Pages project; the `copilot-model-observatory.pages.dev` production URL serves the latest `main` deployment and each deployment also gets a unique preview URL. Commit the working tree before deploying: source control and deployment archives must correspond to the same commit.
