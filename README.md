# Copilot Model Observatory

Single-page comparison of the named GitHub Copilot model catalog, official token prices, sourced engineering benchmark evidence and an always-visible weighted index. Plain HTML/CSS/ES modules; no build step and no third-party JavaScript shipped to the browser. (Prettier is a dev-only code formatter; it is not part of the deployed site.)

## Run

Run `node serve.mjs` from this directory and open http://127.0.0.1:4173. Run `node check.mjs` for dataset and scoring checks. `dist/` is the complete deployable static site.

`npm run format` reformats the source with Prettier and `npm run format:check` verifies formatting; both are developer conveniences and have no effect on the site.

## Data maintenance

[`TASK.md`](TASK.md) is the living task document tracking catalog and benchmark coverage.

`dist/data.js` contains the dated snapshot and primary-source URLs, separate from rendering and scoring. This version was checked on 2026-09-24; it does not automatically refresh. Update prices from GitHub's Copilot rate table, not vendor API pages. Retain cache write/read and long-context tiers. Compare the supported-model list and utility list; tenant-level enablement is not connected.

Each evidence record includes value, source, agent, result date if available, and published uncertainty if available. Missing results must remain absent. Do not fill from a different model version or silently combine benchmark editions. Alternative harness results belong in `alternatives`, not substituted into the main table. Source dates and unknown result dates must remain distinct.

18 benchmark measures/editions are included. The original eight remain: LiveBench Coding, R2ABench, three SWE Atlas tasks, Terminal-Bench 2.1, SWE-bench Verified, original SWE-Bench Pro. `dist/expanded.js` adds FeatureBench (v1.0 Lite, whole tasks resolved), BaxBench (no security reminder), SWE-PRBench (overall × 100, eval_100), BigCodeBench (Full/Instruct), Aider Polyglot (pass rate 2), LiveCodeBench (fixed 454-problem window), GSO (Opt@1), CrossCodeEval, Terminal-Bench 4.0, and SWE-Bench Pro V2 Full. Historical versions remain separate. CrossCodeEval is an explicit evidence gap; security, library use, multilingual editing and algorithmic coding have only utility-model overlap in this snapshot. No claim of exhaustive coverage is made. [`TASK.md`](TASK.md) tracks model/benchmark coverage and open gaps; 33 of 35 models now hold captured primary-source evidence.

The Atlas tables contain different agent setups, reasoning settings and budget/dataset revisions. The weighted index is therefore explicitly exploratory, not a controlled model-only ranking or Copilot performance measurement. Task success rates retain their percentage scale; LiveBench Coding uses its 0–100 category average and architecture Node F1 is multiplied by 100; the weighted mean requires every metric with nonzero weight. Cost never enters this score. Published uncertainty is shown in evidence, not propagated as if independent.

Weights are browser-local preferences, not a shared enterprise policy. Fourteen capabilities each get one weight and one fixed benchmark; adding another benchmark within a capability does not give it extra votes. Equal default weights cover the three Atlas tasks; new capabilities begin at zero. Version-1 preferences migrate to version-2, preserving weights. General coding uses LiveBench Coding. Terminal tasks and complex code changes always use Terminal-Bench 4.0 and SWE-Bench Pro V2; historical editions remain in the historical view. Publishing company defaults requires editing `dist/scoring.js`. There is no backend, tenant connection or automatic refresh job.

GSO initially published two GPT-5.4 scores for the same displayed setup; the leaderboard now labels them as reasoning settings — 31.4% (xHigh) feeds the lens, 25.5% (High) is retained in model details. Review false-positive rates are shown separately as lower-is-better; the main column uses the source's overall score. FeatureBench individual-test pass rate is context only. Dates labelled model release dates on Terminal-Bench are not copied into evaluation-date fields. Dated utility-model variants are identified in evidence; they are not guarantees about Copilot's background deployment.

## Verification

`check.mjs` verifies weighted arithmetic, zero versus missing, coverage, empty weights, invalid preferences, unique model IDs and evidence/price constraints. Browser checks cover search, sort, model details, missing-score handling and preference persistence. Company scores are always visible, including for profiles that previously hid them. The optional WebMCP interface uses the same local state and rejects invalid weights.

## Deployment

Deployed to Cloudflare Pages on the Pon AI account as the `copilot-model-observatory` project:

```sh
CLOUDFLARE_ACCOUNT_ID=7629d3d823c90f09e6b0f8b01d04462f npx wrangler pages deploy dist --project-name=copilot-model-observatory --branch=main --commit-dirty=false
```

Live site: https://copilot-models.pon-ai.com — publication is public. The custom domain is a CNAME in the `pon-ai.com` zone pointing at the Pages project; the `copilot-model-observatory.pages.dev` production URL serves the latest `main` deployment and each deployment also gets a unique preview URL. Commit the working tree before deploying: source control and deployment archives must correspond to the same commit.
