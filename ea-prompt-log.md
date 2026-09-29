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

*This file is the canonical, organized prompt log for this repo. New prompts are logged verbatim first (in the Claude Project's `gate1-week3-full-prompts.md`), then reflected here under the appropriate phase and, where relevant, the highlight sections above.*
