# Ethical Apple — Prompt Log (Organized for Instructor Review)

This is the build-control prompt log for the Ethical Apple project, organized for instructor review: control-evidence highlights up top, then the complete record by phase below. The exact verbatim text of every prompt remains preserved in full in the Claude Project copy (`claude/gate1-week3-full-prompts.md`).

---

## TOP: Control Evidence at a Glance

### 1. Key Decisions

| Decision | Why |
|---|---|
| Chicago-only scope | Reliable store-level grocery pricing data isn't freely available city-wide or beyond; narrowing to one city kept the MVP realistic for a solo build (#11–12). |
| Sample/illustrative prices instead of live pricing | No free, no-card API exists for real-time grocery prices; the scope worksheet locks this as a known limitation rather than pretending otherwise (#11, #58). |
| Mapbox → US Census Geocoder switch | Mapbox required a paid plan to proceed; the Census Geocoder is free and needs no card, so the API was swapped without changing what it does (geocoding only — Kendra's own Haversine/JS still does the logic) (#26–27). |
| Build HTML/CSS/JS first, add the LLM second | Adding AI-generated logic before the core app worked risked losing personal ownership of the build; locking Version 1 (plain JS) first, then layering AI on top, keeps a clear "I built this, then I added AI" story (#32). |
| Replace Loveable's built-in logic with her own | The Loveable-generated zip shipped its own meal-plan/store-comparison logic; that logic had no test history and wasn't hers, so it was swapped out for the already-built and tested `data.js`/`planLogic.js` (#38). |
| Cut to 3 stores and 2 sort options | The locked scope worksheet tightened the MVP from 6 stores/4 sort options down to 3 stores/2 sort options to keep the comparison feature achievable and demonstrable (#58). |

### 2. Caught / Corrected

Moments where AI-proposed direction drifted and was pulled back, or where a real bug was caught and fixed:

- **#32 — Infrastructure drift caught early.** The build was heading toward a serverless function + LLM architecture before any core logic existed. Recognized this would blur what was actually built vs. generated, and reset to a plain HTML/CSS/JS-first plan.
- **#38 — Replaced AI-generated logic with her own.** Loveable's delivered zip included its own working meal-plan/store logic. Chose to discard it in favor of the previously built and tested logic, preserving authorship of the core mechanics.
- **#54 — Fixed an unrealistic quantity bug.** The shopping list was computing bread and tortillas per-meal-use instead of as bulk staples, producing unrealistic quantities (multiple loaves for a few days). Fixed by scaling those items to days-per-unit instead.
- **#58 — Brought the build back in line with a tightened scope.** After locking a more disciplined scope worksheet (3 stores, 2 sort options, budget-buffer/price-range safeguards), the actual app still reflected the earlier, looser build (6 stores, 4 sort options, no safeguards). Corrected the code to match the locked scope rather than letting docs and app drift apart.

### 3. Testing & Verification

Manual testing and self-verification, driven by Kendra:

- **#51–52 — Verified a "missing" feature wasn't actually missing.** The Share button appeared absent in a desktop browser test; before treating it as a bug, tested on a phone browser, confirmed the Web Share API correctly feature-detects and only shows on supporting devices, and left the code as-is.
- **#62 — Caught a real infeasible-budget rendering bug.** Testing a $70/6-person/3-day plan with all dietary preferences checked surfaced empty "Meals" and "Shopping List" panels rendering underneath the budget warning instead of being hidden. Reported it directly ("This needs to be addressed") and it was fixed.
- **#63 — Verified the fix at an extreme edge case.** Re-tested with a $1 budget to confirm the infeasible-budget guard holds even at the most extreme input, not just the original bug's numbers.
- **#64 — Caught and diagnosed a budget-underutilization issue.** Noticed a $200/12-day/2-person plan only spent $67–$75, well under budget, and asked directly whether the dataset was too limited. This led to root-causing two separate contributing factors and fixing the algorithmic one.

### 4. Parked for Future (Scope Discipline)

Ideas explicitly deferred rather than built into Version 1:

- **Live/real-time grocery pricing.** Flagged from the earliest research (#11) as the hardest part of the concept; the locked scope worksheet formally keeps the app on sample/illustrative pricing for now (#58).
- **Food-access resource link.** Noted during infeasible-budget testing as a good future addition — a button pointing users toward real food-assistance resources when their budget genuinely isn't enough — but explicitly called out as "just a note for future builds," not current scope (#63).
- **The LLM/backend layer (Ollama + pricing API).** The full architecture and data flow have been designed and logged (#66–67), but by Kendra's explicit instruction no application code has been changed yet — it's documented for the record, clearly separate from the working Version 1 build.

---

## FULL LOG BY PHASE

### Phase 1 — Problem & Research (#1–11)
The pivot from broad food-access to food affordability specifically, Maria's user journey, and the early identification of grocery pricing data as the hardest open question.

**#1** (2026-09-25, 14:17 CT) — New Week 3 reading and project kickoff; attached reading materials.

**#2** (2026-09-25) — "Continue from where you left off."

**#3 — Clarifying responses** (2026-09-25) — Chose to revisit Ethical Apple; chose to combine solution options 1 and 2.

**#4** (2026-09-25, 14:36 CT) — Requested a running verbatim prompt log be kept ("gate1-week3-full-prompts.md").

**#5** (2026-09-25, 14:45 CT) — Reframed the project around food affordability specifically, backed by USDA and Feeding America research (61% and 68% figures).

**#6** (2026-09-25, 14:46 CT) — First full problem statement: the gap between knowing food resources exist and knowing which option meets someone's immediate budget/location/circumstances.

**#7** (2026-09-25, 14:47 CT) — Walked through "Maria's" user journey — $35, two kids, translating money into meals under time pressure — and cited Feeding America stats on cheaper/less-nutritious substitution (80%) and running out of food before month's end (52%).

**#8** (2026-09-25, 14:48 CT) — Refined, final problem statement: turning a limited grocery budget into a practical food and meal plan.

**#9** (2026-09-25, 14:50 CT) — Decided the assistant should be built directly into the site's own code.

**#10 — Clarifying responses** (2026-09-25) — Chose to call an LLM API from the backend; chose React + Node/Express as the stack (mirroring The Dietrich Files).

**#11** (2026-09-25, 14:55 CT) — Expanded the concept to include real store comparison and a 5-step ideal user journey, but flagged the central open question: where would reliable, current, store-level grocery prices actually come from? Proposed investigating real pricing data availability before committing to more features.

### Phase 2 — Scope & Architecture (#12–34)
Locking the 4-screen MVP, choosing and re-choosing APIs, and the decision to build Version 1 in plain HTML/CSS/JS before adding any AI layer.

**#12** (2026-09-28, 11:37 CT) — Locked scope: a front-end prototype (HTML/CSS/JS) with a 4-screen MVP (landing → budget form → grocery/meal plan → store comparison).

**#13 — Clarifying response** (2026-09-28) — Chose rule-based JS logic to generate the plan.

**#14** (2026-09-28, 11:42 CT) — Confirmed she needs to build this herself in HTML/CSS/JS to demonstrate personal control of the build.

**#15** (2026-09-28, 11:49 CT) — Attached a store-comparison mockup; requested the four sort-priority options (lowest cost / closest / one-stop / balance) be added.

**#16** (2026-09-28, 11:54 CT) — Announced she would set up the GitHub repo and wanted an MVP/scope plan and a prompt log started once the repo was ready.

**#17** (2026-09-28, 11:59 CT) — Decided to add an API.

**#18 — Clarifying response** (2026-09-28) — Chose a real location/distance (maps) API as the API's purpose.

**#19** (2026-09-28, 12:20 CT) — Clarified the API's job is only location data; all affordability/recommendation logic stays in her own JavaScript.

**#20** (2026-09-28, 12:24 CT) — Locked Mapbox for geocoding, with a clear separation between what the API does (geocode) and what she wrote herself (Haversine distance, store logic).

**#21** (2026-09-28, 12:27 CT) — Shared the GitHub repo location.

**#22** (2026-09-28, 12:28 CT) — Noted a Loveable frontend design was coming.

**#23** (2026-09-28, 12:31 CT) — Requested the `ea-prompt-log.md` file be created in the repo for build-control evidence.

**#24** (2026-09-28, 12:37 CT) — Requested an MVP plan doc with scope, problem statement, and user stories.

**#25** (2026-09-28, 12:45 CT) — Shared the Loveable landing page design; requested a README.md and to start the Mapbox setup.

**#26** (2026-09-28, 12:52 CT) — Reported Mapbox required payment she couldn't provide; asked to rethink the API choice.

**#27 — Clarifying response** (2026-09-28) — Chose the free, no-card US Census Geocoder as the replacement.

**#28** (2026-09-28, 12:56 CT) — Shared a hybrid-architecture proposal from another AI conversation: her JS controls constraints/validation, an LLM (behind a small serverless function) proposes meal ideas from a controlled ingredient list.

**#29 — Clarifying response** (2026-09-28) — Chose to switch to the hybrid LLM approach over the rule-based-only build.

**#30 — Clarifying responses** (2026-09-28) — Chose to challenge herself on the LLM API choice; specified a full project folder structure; no preference on where the serverless function lives.

**#31 — Clarifying response** (2026-09-28) — Chose the OpenAI API for the eventual LLM step.

**#32** (2026-09-28, 13:22 CT) — **Pulled the architecture back**: decided to simplify to `index.html` / `styles.css` / `app.js` / `data.js` first, build the entire working prototype there, and only add the LLM afterward as a small enhancement — explicitly to keep clear evidence of personal ownership of the core build.

**#33** (2026-09-28, 13:26 CT) — Approved drafting the Version 1 `data.js`/`app.js` skeleton.

**#34** (2026-09-28, 13:31 CT) — Requested the MVP doc be updated to reflect only the current version plus a separate future-plans section, and the architecture description cleaned up.

### Phase 3 — Frontend Integration (#35–48)
Bringing in the Loveable-generated frontend, converting it to Vite, adding real Chicago store data, and documentation cleanup.

**#35** (2026-09-28) — Asked whether the user submission form still needed to be built.

**#36 — Clarifying response** (2026-09-28) — Described what Loveable had delivered so far (landing page + two CTA buttons) and what needed to be built next.

**#37** (2026-09-28) — Delivered the full Loveable-generated Vite source code as a zip.

**#38 — Clarifying response** (2026-09-28) — **Chose to replace** Loveable's own built-in meal-plan/store logic with her already-built, already-tested logic rather than keep the AI-generated version.

**#39 — Clarifying response** (2026-09-28) — Chose to keep Vite as the build tool rather than strip it back to static files.

**#40** (2026-09-28, 16:20 CT) — Asked how to run/open the project from the terminal.

**#41** (2026-09-28, 16:26 CT) — Asked where to find store data to add more stores.

**#42** (2026-09-28, 16:28 CT) — Requested a shortlist of real Chicago grocers (Walmart, Target, Rico Fresh Market) for approval.

**#43** (2026-09-28, 16:31 CT) — Supplied real addresses for Rico Fresh Market and the Logan Square Target.

**#44** (2026-09-28, 16:33 CT) — Requested the README be updated to reflect the current project structure.

**#45** (2026-09-28, 16:36 CT) — Requested a git commit message for the recent batch of file changes.

**#46** (2026-09-28, 16:39 CT) — Requested a landing-page screenshot be added to the top of the README.

**#47** (2026-09-28, 17:13 CT) — Asked why a `vite.config.js` file existed.

**#48** (2026-09-28, 17:14 CT) — Decided to rename "Loveable" to "Replit" in forward-facing docs only, leaving historical log entries describing what actually happened untouched.

### Phase 4 — Feature Building (#49–57, #59–61, #65)
Adding share/download, expanding to 3 meals a day, dietary preferences, and price-realism updates.

**#49** (2026-09-28, 17:18 CT) — Asked for a proposal (for approval before building) on adding save/download/share for the grocery list.

**#50** (2026-09-28, 17:19 CT) — Approved all three: download, copy-to-clipboard, and native share.

**#51** (2026-09-28, 17:26 CT) — Reported only seeing copy and download, not share.

**#52** (2026-09-28, 17:30 CT) — Verified on a phone browser that Share does appear; confirmed the feature-detected behavior was correct as-is.

**#53** (2026-09-28) — Requested more meal options and a move to 3 meals a day (breakfast/lunch/dinner) instead of one meal per day; chose a medium-sized template set (8–10 per type) and allowed repeats on longer plans.

**#54** (2026-09-28) — Flagged the bread/tortilla bulk-quantity bug (see "Caught/Corrected" above).

**#55** (2026-09-28) — Requested a "My grocery list" link on the store comparison screen back to the plan screen.

**#56** (2026-09-28, 18:01 CT) — Requested a git commit message for the 3-meals-a-day, bulk-staple, and grocery-list-link changes.

**#57** (2026-09-28, 18:13 CT) — Requested a second "Build my grocery plan" CTA at the bottom of the landing page.

**#59** (2026-09-29, 09:36 CT) — Laid out the day's full plan (budget form features, add-to-list option, dietary preference meals, Ollama connection, testing, prompt-log organization, demo prep) and requested a todo list.

**#60** (2026-09-29, 10:35 CT) — Added the screen 3/4 merge to the todo list to cut down on navigation.

**#61** (2026-09-29, 10:51 CT) — Specified the five Dietary Preferences to add (High Protein, High Fiber, Budget-Friendly, Under 30 Minutes, Vegetarian).

**#65** (2026-09-29, 11:39 CT) — Shared a real ChatGPT/Walmart pricing comparison and approved nudging sample prices toward real prices plus adding missing protein-dense items.

### Phase 5 — Scope Lock (#58, #60)
Formalizing the tightened scope worksheet and bringing the running app back in line with it.

**#58** (2026-09-28, 19:02 CT) — Delivered the full Scope Worksheet (4 screens, 20-item dataset, 3-meal plan, 3 stores, 2 sort options, budget-buffer/price-range/cheapest-suppression safeguards) and chose to update the code immediately to match it rather than leave it as a docs-only aspiration.

**#60** (2026-09-29, 10:35 CT) — Added the screen 3/4 merge to the scope conversation — reducing the locked 4-screen scope to 3 screens, explicitly flagged as needing `scope-worksheet.md`/`mvp-plan.md` updates once built.

### Phase 6 — Testing & Fixes (#62–64)
Kendra's own manual break-testing of the app, and the fixes that came out of it.

**#62** (2026-09-29, 11:19 CT) — Found and reported the infeasible-budget rendering bug (empty Meals/Shopping List panels).

**#63** (2026-09-29, 11:27 CT) — Verified the fix at a $1-budget extreme edge case; noted the food-access-link idea as a future-only note.

**#64** (2026-09-29, 11:34 CT) — Found and reported the $200-budget underutilization issue, prompting the root-cause diagnosis and the "upgrade pass" fix.

### Phase 7 — Planned, Not Built (#66–67)
*The following two entries describe a backend/LLM architecture that has been designed and logged for the record, but — per explicit instruction — no application code has been written for it yet. These are not part of the working Version 1 build.*

**#66** (2026-09-29, 12:02 CT) — Described the Ollama + backend integration architecture: frontend sends budget/household/days/pantry/preferences to a backend, which supplies those plus the approved ingredient catalog to a locally-running Ollama model; Ollama proposes structured JSON meals; the backend validates, prices, and budget-checks the result, falling back to the existing rule-based planner if needed.

**#67** (2026-09-29, 12:03 CT) — Corrected the flow diagram: store prices are now fetched from an API (not just the static catalog), and Ollama proposes meals from available ingredients ahead of quantity/cost calculation and budget validation. Explicitly logged only — no code changes requested or made.

---

### Phase 8 — Prompt Log Organization (#68–69)
Organizing the running prompt log itself into an instructor-friendly format.

**#68** (2026-09-29, 12:19 CT) — Requested the prompt log be organized into categories: top highlight sections (Key Decisions, Caught/Corrected, Testing & Verification, Parked for Future) followed by the complete log broken into seven phases, so instructors see build-control evidence first and the full record stays complete underneath.

**#69** (2026-09-29, 12:21 CT) — Requested the organized structure be reflected directly in `ea-prompt-log.md` itself rather than kept as a separate file — this file (the one you're reading) is the result: the canonical, organized version, merged in place.

### Phase 9 — Supporting Research (#70)
Market/competitive research gathered to support the problem statement and demo narrative.

**#70** (2026-09-29, 12:29 CT) — Logged a competitive-landscape observation: most grocery apps in app stores are shopping-list tools, not budget-tracking tools — very few tell a user in advance that their planned purchases exceed their budget. Saved to `claude/ethical-apple-competitive-landscape.md` in the Claude Project as supporting evidence that Ethical Apple's budget-first angle isn't already solved by existing apps.

---

### Phase 10 — README Update & Ollama Prompt Documentation (#71–72)
Bringing the README in line with the local Ollama/pricing backend Kendra and another model built, and documenting the exact system prompt used.

**#71** (2026-09-29, 12:39 CT) — Requested the README be updated to document the new Ollama model and Open Price Engine grocery pricing API, shown as an artifact first for review and approval before writing to the actual file. In the process, found the repo already had a full local backend implementation committed (`server/`, `scripts/`, `tests/`, `docs/ollama-integration.md`), plus a partially-updated README with a stray paragraph and a stale store count left over from before the scope lock. Drafted a full corrected README (new Version 3 section, fixed store count, updated structure diagram/docs list/status/limitations) and published it as a reviewable artifact rather than writing it directly.

**#72** (2026-09-29, 12:39 CT) — Shared the exact Ollama system prompt used by the local backend (guardrails: budget is a total not per-person/day, one breakfast/lunch/dinner from approved IDs only, no portion/price/ingredient changes, under-$10 plans exclude oil/seasonings, pantry only reduces cost when quantified, one store per basket, output independently validated). Logged for the record; offered to add it to `docs/ollama-integration.md` as documentation of the actual guardrails in use.

**#73** (2026-09-29, 12:56 CT) — Requested the exact system prompt text be added to both docs, and the README update be completed with the "Version 1" framing excluded. Added the verbatim system prompt to `docs/ollama-integration.md` under a new "System prompt" subsection, with a line-by-line note on which backend check enforces each rule (e.g. the budget-total framing is enforced by `planner.js`'s budget math; the one-store-basket rule matches how `prices.js` builds store totals). Finalized and wrote the actual `README.md`: replaced the "Versions" framing (which separated a deployed "Version 1" from the new backend as "Version 3") with a single, non-versioned "Local Ollama + grocery pricing integration" section covering the same ground as the reviewed artifact draft, with the Version 1 write-up removed rather than kept alongside it, and links out to the new system-prompt documentation. Future Plans, Project Docs, Status, and Security/Limitations sections were also updated to drop version numbering while keeping the underlying facts (three sample stores, frontend deployed and tested, backend local-only, real distance planned next).

---

### Phase 11 — Real Pricing API Testing (#74)
Kendra's own independent testing of the open-source Open Price Engine API for real store prices, ahead of any project integration.

**#74** (2026-09-29, 14:32 CT) — Reported testing the open-source Open Price Engine API in her own VS Code terminal, outside this build, and finding current, same-day-updated ALDI US pricing data. No code changes yet — logged as an in-progress test to track; integration into the project is pending the test results.

**#75** (2026-09-29, 15:02 CT) — Reported that the Open Price Engine API doesn't cover the stores needed, so real-store pricing via that API was dropped; the app continues pulling pricing from its own project dataset (sample-pricing mode). Finishing the local Ollama/llama3 integration and adding more meal options, with OpenAI's Codex assisting on adjustments, continuing down today's todo list. No code changes made here.

---

### Phase 12 — Ollama Removal (#76)
Testing the local Ollama backend surfaced real problems, leading to a scope decision to remove it and keep the app fully client-side and deterministic.

**#76** (2026-09-29, 15:51 CT) — Reported testing issues with the Ollama backend (an unreliable fallback path, no clean Vercel deployment story, and generation slower than the rule-based planner it was meant to improve on) and requested it be removed completely, restoring code-controlled meal planning. Removed `server/`, `scripts/dev.js`, `docs/ollama-integration.md`, the server-only test file, and the now-unneeded `.env`/`.env.example`; rewired `src/main.js` to call `generatePlan()` in `src/planLogic.js` directly and synchronously, with no network call. While restoring, found and fixed two real correctness gaps left over from the Ollama/Codex work: (1) the client planner never picked up the verified pantry-quantity feature, so those quantities were being silently ignored -- fixed so a verified quantity reduces cost while a free-text name alone only guides meal choice; (2) 10 meal templates reference 20 ingredient ids never added to `GROCERY_ITEMS`, which would have understated their true cost -- added an ingredient-completeness filter (`AVAILABLE_MEAL_TEMPLATES`) so those meals stay excluded from rotation instead of mispriced, and listed the missing ingredients in the README as a known gap. Replaced the server-only test file with `tests/planLogic.test.js` (7 tests, all passing) and confirmed `npm run build` produces a small, fully static bundle again. Rewrote `README.md` to remove the Ollama section and explain the removal, and flagged (without rebuilding) that the store-price comparison described in `scope-worksheet.md` isn't currently implemented in the shipped code.

---

### Phase 13 — Demo Prep (#77)
Capturing a reflective talking point for Thursday's demo, explaining the reasoning behind the Ollama removal (Phase 12) as a deliberate responsible-AI scope decision.

**#77** (2026-09-29, 15:58 CT) — Asked to add a "Responsible AI Scope Decision" write-up to her demo prep sheet for Thursday, reflecting on why AI/Ollama was removed from this version in favor of predictable, deterministic logic, while keeping AI as a future possibility with added validation and guardrails. No demo prep sheet existed yet in the Claude Project, so a new doc (`gate1-week3-demo-prep.md`) was created there to hold it, verbatim, as its first talking point. No code changes.

---

### Phase 14 — Store Comparison Restoration (#78–79)
Fixing the gap between the locked scope-worksheet.md store-comparison feature and what had actually shipped, then correcting its visual design to match the rest of the app.

**#78** (2026-09-29, 16:16 CT) — Gave a 5-item priority list for the day: fix the scope mismatch, log the outside-tool prompts, re-test the #76 fixes, a code walkthrough, and the demo script. Investigating the first item found that scope-worksheet.md's locked store-comparison feature (3 stores, sample prices, 2 sort options, budget-buffer/cheapest-suppression safeguards) was missing from the shipped app -- it had been quietly replaced with a static location list, no pricing or sorting, likely during the "merge screen 3/4" work bundled into the same commit as the Ollama backend. Chose to rebuild the feature (recovered the original `computeStoreResults`/`sortStoreResults`/`isCheapestTooCloseToCall` logic from git history) rather than de-scope the docs. Added a `STORES` dataset (per-store price multiplier, coverage, sample distance) to `src/data.js`; restored the comparison functions to `src/planLogic.js`; rewired `src/main.js`'s store section with sort-toggle buttons and priced basket estimates; added 3 new tests (10/10 passing) and confirmed a clean build; updated `README.md` to remove the previously-flagged gap.

**#79** (2026-09-29, 16:39 CT) — Flagged that the new store-comparison section didn't visually match the rest of the page. Used a local Vite preview and Playwright screenshots to diagnose rather than guess: `reference.css`'s `.ea-ref` design-system overrides (Barlow Condensed headings, IBM Plex Mono labels, hard black borders/shadows, orange accents) had never been extended to the store section, so it rendered in the softer base theme. Added the missing overrides for the heading, sort buttons, and store cards/metrics to match exactly, verified with before/after screenshots, and confirmed the build still succeeds.

---

### Phase 15 — Outside-Tool Prompts (#80)
Backfilling the prompts run in OpenAI's Codex during the Ollama/backend build (entries #59–76), per Kendra's request to keep the Fluency/Control log complete.

**#80** (2026-09-29, 16:39 CT) — Pasted 12 verbatim Codex prompts covering the full arc of the now-removed Ollama backend: connecting a local Ollama model securely, writing and iterating the meal-generation prompt (budget rules, variety, prep ideas, the under-$10 oil/seasoning exclusion), wiring in and then abandoning the Open Price Engine API and Trader Joe's/store pricing in favor of self-collected sample prices, selecting the llama3 model, building a loading modal, adding the nearby-stores list (ALDI/Walmart/Rico Fresh Market), scoping the download/copy/share text to just the list and total, questioning why the LLM's output wasn't actually being used over the rule-based data, asking about Vercel deployment with a local model running, and generating the 10 new meal templates that entry #76 later found referenced ingredients never added to `GROCERY_ITEMS`. Logged verbatim in the Claude Project's `gate1-week3-full-prompts.md` as entry #80; documentation only, no code changes.

---

### Phase 16 — Code Walkthrough (#81)
Preparing a code-walkthrough reference for the demo, explicitly highlighting the budget-buffer logic.

**#81** (2026-09-29, 17:05 CT) — Asked to start the code walkthrough, specifically asking that the budget buffer be highlighted. Created a new Claude Project doc, `gate1-week3-code-walkthrough.md`, covering a suggested walkthrough order, an architecture overview, and a section-by-section tour of `data.js`, `planLogic.js`, `main.js`, and `tests/planLogic.test.js`, with a dedicated “⭐ The budget buffer — what to highlight” subsection quoting the exact lines (`BUDGET_BUFFER_FRACTION = 0.875` at line 21, `targetBudget = budget * BUDGET_BUFFER_FRACTION` at line 144) and explaining its three usages: the upgrade pass (line 213, stops at line 224 once `totalCost >= targetBudget`), the over-budget substitution loop (line 255), and the final hard-infeasibility check, which uses the full `budget` rather than `targetBudget` as the absolute ceiling. No code changes.

---

*This file is the canonical, organized prompt log for this repo. New prompts are logged verbatim first (in the Claude Project's `gate1-week3-full-prompts.md`), then reflected here under the appropriate phase and, where relevant, the highlight sections above.*
