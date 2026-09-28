# Ethical Apple — MVP Plan

**Program:** Next Chapter Project — Week 3, Phase 1 Gate ("The AI-Built Solution")
**Author:** Kendra Hartnett
**Status:** Building Version 1 (HTML/CSS/JS only, controlled data)

---

## 1. Problem Statement

People shopping on very limited grocery budgets often have difficulty determining how to turn the money they have available into enough food and meals to last until they can shop again.

Planning requires balancing budget, household size, number of days, existing food at home, dietary needs, nutrition, and grocery prices. This can make an already stressful situation more complicated and can lead to overspending, food waste, or purchasing food that does not stretch far enough.

**The problem to explore:** how might we help Chicago residents with limited grocery budgets figure out what food they can afford, plan meals that fit their budget, and identify nearby stores where they can purchase groceries at lower prices?

### Supporting research
- USDA: affordability is the most common barrier to a healthy diet reported by SNAP participants (61% of those surveyed).
- Feeding America 2026 survey: 68% of surveyed neighbors wanted to eat healthier but couldn't currently afford to.
- Feeding America 2025 survey: 80% of surveyed neighbors bought cheaper, less nutritious food due to high prices; 52% ran out of food before they could buy more at some point in the past year.
- USDA Economic Research Service: distance and transportation affect which food retailers households can reach and the time/cost required to shop, compounding the budgeting problem.

### The user journey this is built around — Maria
It's Tuesday afternoon. Maria has two children and $35 available for groceries until Friday. She already has rice, cooking oil, and a few basic seasonings. Her real question isn't "where's the nearest grocery store" — it's **"what can I buy with $35 that will actually get my family through to Friday?"**

Her current, manual journey: $35 left → figure out meals → figure out ingredients → estimate prices → decide where to shop → remove things that exceed budget → make substitutions → shop → hope the total isn't higher than expected. Every one of those steps is a place the plan can quietly fall apart.

---

## 2. Solution (current version)

**Ethical Apple** is a front-end app — HTML, CSS, and JavaScript only, no external API calls — that turns a Chicago user's limited grocery budget into an affordable meal and shopping plan, then compares estimated prices and distance across a small set of nearby grocery stores. Every calculation and decision runs in Kendra's own JavaScript, using a controlled sample dataset she wrote herself.

### Project structure
```
ethical-apple/
├── index.html   (screens and form structure)
├── styles.css   (visual system)
├── data.js      (controlled grocery items, sample store prices, meal templates)
└── app.js       (behavior: read form inputs, calculate budget per day/person, build the
                  shopping list, compare store totals, sort by cost/distance/one-stop/
                  balance, update the UI)
```

### How it works
1. The budget form collects: budget, household size, days to cover, food already on hand, optional dietary preference, and a Chicago ZIP/address.
2. `app.js` calculates budget per day and per person, and flags immediately if the budget is unrealistically low for the household/days given.
3. It selects meals from `data.js`'s meal templates — preferring ingredients the user already has on hand and pantry-friendly recipes — one per day of the plan.
4. It builds an itemized shopping list (aggregating ingredient quantities across meals, subtracting what's on hand) and totals the estimated cost.
5. If the plan comes in over budget, it substitutes cheaper, more pantry-friendly meals until it fits, or tells the user plainly that the budget isn't realistic for their household/days.
6. It compares the shopping list's cost across a small set of sample Chicago stores (with a placeholder distance for now — see Future Plans) and lets the user sort by Lowest Grocery Cost, Closest Store, One-Stop Shopping, or Balance of Price and Distance.

### MVP — 4 screens/states
1. **Landing page** — opens with Maria's journey + the supporting stats; frames the problem
2. **Budget form** — budget ($), household size, days to cover, food already on hand, optional dietary needs, Chicago ZIP/address
3. **Grocery/meal plan** — generated entirely by Kendra's own JavaScript: a short meal plan, itemized estimated shopping list, running total vs. budget, and substitutions when something would bust the budget
4. **Store comparison** — "Compare where to shop": a small set of nearby Chicago stores with sample/illustrative pricing and a placeholder distance, sortable by four options: Lowest Grocery Cost, Closest Store, One-Stop Shopping, Balance of Price and Distance

---

## 3. Scope (current version)

### In scope
- The 4 screens above, built in plain HTML/CSS/JS (frontend from Lovable, logic wired in by Kendra/Claude)
- Rule-based plan-generation logic, entirely Kendra's own code: budget ÷ days ÷ household size → meal selection accounting for what's on hand → shopping list with estimated per-item cost → budget check → substitution if over budget
- Store comparison using sample pricing data and a placeholder sample distance, with the four sort/priority options
- Clear on-page disclosure that store prices are illustrative/sample and distances shown are placeholders, not live or real
- A documented Prompt Log (`ea-prompt-log.md`) showing how AI was used throughout design and build, for the gate's Fluency/Control dimensions

### Deliberately out of scope for this version
- Any external API call (no location data, no AI-generated content) — see Future Plans below
- Live grocery pricing via real store APIs
- Real distance of any kind, straight-line or travel
- More stores / broader chain coverage
- Matching to specific food pantries or assistance programs (a related, larger problem explored earlier and set aside)
- Nutrition/medical dietary restrictions beyond general healthy-eating framing
- User accounts, saved plans, notifications
- Any backend or server-side code

---

## 4. Future Plans (not part of the current build)

These are named explicitly as "Future" on gate day, and built only after this version is fully working:

- **Version 2 — real location/distance.** Add the US Census Geocoder (free, no API key or account required) to convert the user's ZIP/address and each store's address into coordinates, and a self-written Haversine function to calculate real straight-line distance — replacing the placeholder distance from Version 1. Distances will always be labeled "approximate straight-line distance," never "travel distance."
- **Version 3 — hybrid LLM meal-plan enhancement.** Add an AI-generated meal-idea suggestion, in a controlled role only: Kendra's JavaScript will calculate the budget constraints and hand the LLM a pre-approved ingredient list; a small serverless function (`api/generateMealPlan.js`) will hold the secret OpenAI API key and call the OpenAI API; the LLM will return meal ideas as structured JSON only (no prices, no store claims); Kendra's JavaScript will validate that response, reject anything outside the allowed ingredient list, and calculate all quantities/cost/budget checks itself. Guiding principle: *"AI generates suggestions. My application validates decisions."* This is the only phase that introduces any backend, and it's added last, once Versions 1 and 2 already work on their own.
  - Future project structure (once this phase begins):
    ```
    ethical-apple/
    ├── index.html
    ├── styles.css
    ├── app.js
    ├── data/
    │   ├── groceries.js
    │   └── stores.js
    ├── js/
    │   ├── budget.js
    │   ├── mealPlan.js
    │   ├── storeCompare.js
    │   └── ui.js
    └── api/
        └── generateMealPlan.js   (serverless function — only file touching the OpenAI key)
    ```
- **Live grocery pricing.** Kroger's Developer API is the one legitimate path found to real, current, store-level pricing (Mariano's is Kroger-owned) — pending hands-on confirmation of Chicago coverage (see `ethical-apple-data-investigation.md`).
- **More stores / broader chain coverage.**
- **User accounts, saved plans, notifications.**

Building and proving this version before introducing any external API or AI is itself part of the Control story for the gate: *"The app worked before I added anything external. I deliberately added real location data, and then AI, only to improve the parts that benefit from them."*

---

## 5. User Stories

**As a Chicago resident on a tight grocery budget (like Maria),**
- I want to enter my budget, household size, and how many days it needs to cover, so that the plan reflects my actual situation instead of a generic one.
- I want to tell the app what food I already have at home, so I'm not shown a plan that wastes money re-buying things I don't need.
- I want to see a clear, specific meal plan instead of vague advice, so I know exactly what to cook.
- I want an itemized shopping list with estimated costs and a running total against my budget, so I can tell before I shop whether the plan actually fits.
- I want to be told plainly if my budget realistically isn't enough for my household and days, so I'm not misled into a plan that will fail at checkout.
- I want prices clearly labeled as estimates, not live store prices, so I don't over-trust a number the app can't guarantee.

**As a Chicago shopper deciding where to buy,**
- I want to see a small set of nearby stores with an estimated total cost for my plan, so I can compare my options instead of guessing.
- I want to sort those options by lowest cost, closest store, one-stop convenience, or a balance of price and distance, so I can prioritize what actually matters to me in the moment (money vs. time vs. transportation).
- I want distance clearly labeled as a placeholder for now, so I don't mistake it for something real until Version 2 adds actual location data.

**As Kendra, building and presenting this for the Phase 1 gate,**
- I want to build the whole app in plain HTML/CSS/JS first, with data I fully control, so I can demonstrate the core mechanics are entirely mine before anything external is introduced.
- I want a documented Prompt Log of how I used AI throughout the build, so I can demonstrate Fluency and Control on gate day.
- I want the app's current limitations (sample pricing, placeholder distance, no live grocery APIs, no AI-generated content yet) named explicitly, so my Trustworthy-AI Map/Measure/Manage answers are honest rather than overstated.
- I want a clear roadmap for what comes next (real location data, then a controlled AI enhancement) so I can speak to both what's built and what's deliberately deferred.

---

## 6. Related documents
- `ea-prompt-log.md` — verbatim prompt log for this build (Fluency/Control evidence)
- Next Chapter Project docs: `ethical-apple-spec-sheet.md` and `ethical-apple-data-investigation.md` (fuller architecture/data-source detail behind this plan)
