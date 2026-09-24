# Copilot Model Observatory

Single-page comparison of the named GitHub Copilot model catalog, official token prices, sourced engineering benchmark evidence and an optional weighted index. Plain HTML/CSS/ES modules; no build or third-party JavaScript dependencies.

## Run

Run `node serve.mjs` from this directory and open http://127.0.0.1:4173. Run `node check.mjs` for dataset and scoring checks. `dist/` is the complete deployable static site.

## Data maintenance

`dist/data.js` contains the dated snapshot and primary-source URLs, separate from rendering and scoring. This version was checked on 2026-09-24; it does not automatically refresh. Update prices from GitHub's Copilot rate table, not vendor API pages. Retain cache write/read and long-context tiers. Compare the supported-model list and utility list; tenant-level enablement is not connected.

Each evidence record includes value, source, agent, result date if available, and published uncertainty if available. Missing results must remain absent. Do not fill from a different model version or silently combine benchmark editions. Alternative harness results belong in `alternatives`, not substituted into the main table. Source dates and unknown result dates must remain distinct.

18 benchmark measures/editions are included. The original eight remain: LiveBench Coding, R2ABench, three SWE Atlas tasks, Terminal-Bench 2.1, SWE-bench Verified, original SWE-Bench Pro. `dist/expanded.js` adds FeatureBench (v1.0 Lite, whole tasks resolved), BaxBench (no security reminder), SWE-PRBench (overall × 100, eval_100), BigCodeBench (Full/Instruct), Aider Polyglot (pass rate 2), LiveCodeBench (fixed 454-problem window), GSO (Opt@1), CrossCodeEval, Terminal-Bench 4.0, and SWE-Bench Pro V2 Full. Historical versions remain separate. CrossCodeEval is an explicit evidence gap; security, library use, multilingual editing and algorithmic coding have only utility-model overlap in this snapshot. No claim of exhaustive coverage is made.

The Atlas tables contain different agent setups, reasoning settings and budget/dataset revisions. The weighted index is therefore explicitly exploratory, not a controlled model-only ranking or Copilot performance measurement. Task success rates retain their percentage scale; LiveBench Coding uses its 0–100 category average and architecture Node F1 is multiplied by 100; the weighted mean requires every metric with nonzero weight. Cost never enters this score. Published uncertainty is shown in evidence, not propagated as if independent.

Weights, benchmark selections and score visibility are browser-local preferences, not a shared enterprise policy. Fourteen capabilities each get one weight and one selected benchmark; adding another benchmark within a capability does not give it extra votes. Equal default weights cover the three Atlas tasks; new capabilities begin at zero. Version-1 preferences migrate to version-2, preserving weights and any actively weighted historical editions. Publishing company defaults requires editing `dist/scoring.js`. There is no backend, tenant connection or automatic refresh job.

GSO contains conflicting GPT-5.4 scores for the same displayed setup/date. Both are retained in model details, neither is used for the lens. Review false-positive rates are shown separately as lower-is-better; the main column uses the source's overall score. FeatureBench individual-test pass rate is context only. Dates labelled model release dates on Terminal-Bench are not copied into evaluation-date fields. Dated utility-model variants are identified in evidence; they are not guarantees about Copilot's background deployment.

## Verification

`check.mjs` verifies weighted arithmetic, zero versus missing, coverage, empty weights, invalid preferences, unique model IDs and evidence/price constraints. Browser checks cover search, sort, model details, missing-score handling and preference persistence. The optional WebMCP interface uses the same local state and rejects invalid weights.

## Deployment

`.openai/hosting.json` contains the Sites project identity and static directory. Publication is private to the owner unless explicitly changed. Source control and deployment archives must correspond to the same commit.

Architecture coverage currently consists of one catalog model, Claude Sonnet 4.6. Its Node F1 is not a general system-design quality score. Coding and architecture weights start at zero to preserve existing preferences; old saved six-metric profiles migrate with both new weights at zero.
