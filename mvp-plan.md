# Ethical Apple — MVP Plan

**Program:** Next Chapter Project — Week 3, Phase 1 Gate ("The AI-Built Solution")
**Author:** Kendra Hartnett
**Status:** Version 1 built and in active refinement. Scope is locked to `scope-worksheet.md` — this document mirrors that scope exactly and adds the fuller build detail (architecture, user stories, future plans) around it.

---

## 1. Problem Statement

People in Chicago shopping on very limited grocery budgets often can't tell how to turn the money they have into enough meals to last until they can shop again. They have to balance budget, household size, days to cover, food already at home, and prices, and that leads to overspending, wasted food, or a cart that doesn't stretch far enough.

### Supporting research
- USDA: affordability is the most common barrier to a healthy diet reported by SNAP participants (61% of those surveyed).
- Feeding America 2026 survey: 68% of surveyed neighbors wanted to eat healthier but couldn't currently afford to.
- Feeding America 2025 survey: 80% of surveyed neighbors bought cheaper, less nutritious food due to high prices; 52% ran out of food before they could buy more at some point in the past year.
- USDA Economic Research Service: distance and transportation affect which food retailers households can reach and the time/cost required to shop, compounding the budgeting problem.

### The user journey this is built around — Maria
Maria, a parent with $35, two kids, and until Friday, is the example. She already has rice, cooking oil, and a few basic seasonings. Her real question isn't "where's the nearest grocery store" — it's **"what can I buy with $35 that will actually get my family through to Friday?"**

Her current, manual journey: $35 left → figure out meals → figure out ingredients → estimate prices → decide where to shop → remove things that exceed budget → make substitutions → shop → hope the total isn't higher than expected. Every one of those steps is a place the plan can quietly fall apart.

---

## 2. Solution (one sentence)

Ethical Apple turns a Chicago user's grocery budget into a simple meal and shopping plan, then compares estimated prices at a few nearby stores.

### Form
A small website — a front-end prototype built with HTML, CSS, and JavaScript, with no backend.

### Project structure
```
ethical-apple/
├── index.html          (Vite entry point)
├── package.json        (Vite project config + scripts)
├── vite.config.js       (Vite build/dev server config)
├── public/
│   └── favicon.svg
└── src/
    ├── main.js          (screens, rendering, event wiring)
    ├── data.js          (Kendra's own controlled dataset: ~20 grocery items, sample
    │                      store prices/details, meal templates)
    ├── planLogic.js      (Kendra's own decision-making logic: budget math, meal
    │                      selection, shopping list, budget-buffer/range safeguards,
    │                      store comparison/sorting)
    ├── styles.css        (visual system)
    └── reference.css     (supporting styles)
```

### How it works
1. The budget form collects: budget, household size, days to cover, and a checklist of common pantry staples already on hand.
2. `planLogic.js` calculates budget per day and per person, and flags immediately if the budget is unrealistically low for the household/days given.
3. It selects a 3-meal plan (breakfast, lunch, dinner) per day from `data.js`'s meal templates — preferring ingredients the user already has on hand and pantry-friendly recipes.
4. It builds an itemized shopping list (aggregating ingredient quantities across meals, subtracting what's on hand) and totals the estimated cost, built to about 85–90% of budget as a buffer.
5. If the plan still comes in over budget, it substitutes cheaper, more pantry-friendly meals until it fits, or tells the user plainly that the budget isn't realistic for their household/days.
6. It compares the shopping list's cost across 3 Chicago stores with labeled sample prices, shows totals as a price range rather than a single number, and lets the user sort by lowest cost or closest store — without naming a "cheapest" store when the gap between stores is smaller than the data's likely error.

### MVP — 4 screens/states
1. **Landing page** — opens with Maria's journey + the supporting stats; frames the problem
2. **Budget form** — budget ($), household size, days to cover, a checklist of common pantry staples already on hand
3. **Grocery/meal plan** — a 3-meal plan and itemized shopping list generated entirely by Kendra's own rule-based JavaScript, a running total shown as a range against budget, and substitutions when something would bust the budget
4. **Store comparison** — "Compare where to shop": 3 Chicago stores with labeled sample prices, sortable by lowest cost or closest store, with the "cheapest" label suppressed when the price gap is within the data's likely error

---

## 3. Scope

*This scope is locked exactly to `scope-worksheet.md` (Phase 1 Gate Scope Worksheet). See that file for the original worksheet answers this section mirrors.*

### What's in scope
- Four screens: a landing page, a budget form, a meal and grocery plan, and a store comparison.
- Inputs: budget, household size, days to cover, and a checklist of common pantry staples already on hand.
- Output: a 3-meal plan and an itemized shopping list, built by rule-based JavaScript written from a hand-made dataset of about 20 staple items.
- Store comparison across 3 Chicago stores using labeled sample prices, sorted two ways: lowest cost and closest.
- Safeguards tied to the failure mode below: the plan is built to about 85–90% of the budget as a buffer, totals show as a price range, and the app won't name a "cheapest" store when the gap between stores is smaller than the data's likely error.
- Clear labels that prices are estimates and distances are approximate.
- **Done means:** given a budget, household size, and number of days, the app produces the plan and list, shows the total against the budget, and says plainly when the budget can't work.
- **Stretch goal, only after all of the above works:** real straight-line distance using the free US Census Geocoder and a self-written distance calculation.

### Deliberately out of scope
- **AI-generated meal ideas** — the app works without AI, proving the core logic first. Named as a future step (Version 3 below).
- **Live grocery prices** — no legitimate free API exists for most Chicago chains; Kroger's is the one realistic future option, so the app uses labeled sample data.
- **Real driving, walking, or transit distance** — only straight-line distance is estimated, and it's labeled as such.
- **More stores, user accounts, and saved plans** — they add scope without helping show the core idea.
- **Matching users to food pantries or assistance programs** — a related but larger problem, explored earlier and set aside.
- **Medical or special dietary needs** — reliable health guidance isn't something the app can give, so it doesn't try.
- **"One-stop" and "balanced" store sorting** — they add logic that's harder to test and explain.
- Any backend or server-side code (until Version 3, see Future Plans).

### Failure mode (Map)
The estimated shopping total and store ranking come from sample prices, so if real prices run 10–15% higher, someone like Maria could end up over budget at checkout. She might also travel farther to a store the app called cheaper when it isn't. She likely wouldn't notice beforehand, because a specific dollar amount looks like fact and a small "sample pricing" label is easy to skim past. The budget buffer, price ranges, and cheapest-label suppression above are the current answer to that failure mode (Manage); the honest labeling throughout is the Measure.

---

## 4. Future Plans (not part of the current build)

These are named explicitly as "Future" on gate day, and built only after the in-scope version above is fully working:

- **Version 2 — real location/distance.** Add the US Census Geocoder (free, no API key or account required) to convert the user's ZIP/address and each store's address into coordinates, and a self-written Haversine function to calculate real straight-line distance — replacing the placeholder distance from Version 1. Distances will always be labeled "approximate straight-line distance," never "travel distance."
- **Version 3 — hybrid LLM meal-plan enhancement.** Add an AI-generated meal-idea suggestion, in a controlled role only: Kendra's JavaScript will calculate the budget constraints and hand the LLM a pre-approved ingredient list; a small serverless function will hold the secret OpenAI API key and call the OpenAI API; the LLM will return meal ideas as structured JSON only (no prices, no store claims); Kendra's JavaScript will validate that response, reject anything outside the allowed ingredient list, and calculate all quantities/cost/budget checks itself. Guiding principle: *"AI generates suggestions. My application validates decisions."* This is the only phase that introduces any backend, and it's added last, once Versions 1 and 2 already work on their own.
- **Live grocery pricing.** Kroger's Developer API is the one legitimate path found to real, current, store-level pricing (Mariano's is Kroger-owned) — pending hands-on confirmation of Chicago coverage (see `ethical-apple-data-investigation.md`).
- **More stores / broader chain coverage, user accounts, saved plans, notifications** — explicitly deferred past the gate.
- **Link to real food-access resources on an infeasible plan.** When the app tells someone their budget genuinely isn't enough (the infeasible-budget message), point them toward real food pantry/assistance resources instead of leaving them with just "try a bigger budget." Noted during testing as a future-build idea, not part of the current scope.

Building and proving this version before introducing any external API or AI is itself part of the Control story for the gate: *"The app worked before I added anything external. I deliberately added real location data, and then AI, only to improve the parts that benefit from them."*

---

## 5. User Stories

**As a Chicago resident on a tight grocery budget (like Maria),**
- I want to enter my budget, household size, and how many days it needs to cover, so that the plan reflects my actual situation instead of a generic one.
- I want to tell the app what food I already have at home, so I'm not shown a plan that wastes money re-buying things I don't need.
- I want to see a clear, specific 3-meal plan instead of vague advice, so I know exactly what to cook.
- I want an itemized shopping list with estimated costs and a running total (shown as a range) against my budget, so I can tell before I shop whether the plan actually fits, with some buffer built in.
- I want to be told plainly if my budget realistically isn't enough for my household and days, so I'm not misled into a plan that will fail at checkout.
- I want prices clearly labeled as estimates, not live store prices, so I don't over-trust a number the app can't guarantee.

**As a Chicago shopper deciding where to buy,**
- I want to see a small set of nearby stores with an estimated total cost for my plan, so I can compare my options instead of guessing.
- I want to sort those options by lowest cost or closest store, so I can prioritize what actually matters to me in the moment.
- I want the app to avoid claiming one store is "cheapest" when the difference is too small to trust, so I'm not steered toward a store based on noise in the sample data.
- I want distance clearly labeled as approximate, so I don't mistake it for something real until Version 2 adds actual location data.

**As Kendra, building and presenting this for the Phase 1 gate,**
- I want to build the whole app in plain HTML/CSS/JS first, with data I fully control, so I can demonstrate the core mechanics are entirely mine before anything external is introduced.
- I want a documented Prompt Log of how I used AI throughout the build, so I can demonstrate Fluency and Control on gate day.
- I want the app's current limitations (sample pricing, placeholder distance, no live grocery APIs, no AI-generated content yet) named explicitly, so my Trustworthy-AI Map/Measure/Manage answers are honest rather than overstated.
- I want a clear roadmap for what comes next (real location data, then a controlled AI enhancement) so I can speak to both what's built and what's deliberately deferred.

---

## 6. Related documents
- `scope-worksheet.md` — the Phase 1 Gate Scope Worksheet this plan is locked to
- `README.md` — current build status and project structure
- `ea-prompt-log.md` — verbatim prompt log for this build (Fluency/Control evidence)
- Next Chapter Project docs: `ethical-apple-spec-sheet.md` and `ethical-apple-data-investigation.md` (fuller architecture/data-source detail behind this plan)
