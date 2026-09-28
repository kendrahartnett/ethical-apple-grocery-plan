# Ethical Apple — MVP Plan

**Program:** Next Chapter Project — Week 3, Phase 1 Gate ("The AI-Built Solution")
**Author:** Kendra Hartnett
**Status:** Locked scope — building

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

## 2. Solution

**Ethical Apple** — a front-end prototype (HTML/CSS/JavaScript) that turns a Chicago user's limited grocery budget into an affordable meal and shopping plan, then compares estimated prices and real straight-line distance across a small set of nearby grocery stores.

### Architecture
```
User enters Chicago ZIP code or neighborhood
        ↓
Mapbox geocodes that input
        ↓
Mapbox geocodes the addresses of the supported stores
        ↓
Kendra's JavaScript receives latitude + longitude
        ↓
Kendra's Haversine function calculates straight-line distance
        ↓
Kendra's own grocery dataset supplies estimated basket prices
        ↓
Kendra's own logic determines:
70 % grocery cost/30% store distance
  • lowest grocery cost
  • closest store
  • one-stop option
  • balance of price + distance
```

**What the API does vs. what Kendra built:** Mapbox (a public, URL-restricted token, no backend needed) converts locations into coordinates — nothing more. Every affordability decision, the meal plan, the shopping list, the distance calculation, and the four sort/priority rankings are Kendra's own JavaScript, fully explainable and demonstrable as build control.

---

## 3. Scope

### MVP — 4 screens/states
1. **Landing page** — opens with Maria's journey + the supporting stats; frames the problem
2. **Budget form** — budget ($), household size, days to cover, food already on hand, optional dietary needs, Chicago ZIP/neighborhood
3. **Grocery/meal plan** — rule-based JS generates a short meal plan, itemized estimated shopping list, running total vs. budget, and substitutions when something would bust the budget
4. **Store comparison** — "Compare where to shop": a small set of nearby Chicago stores with sample/illustrative pricing + real, straight-line distance (via Mapbox + Haversine), sortable by four options: Lowest Grocery Cost, Closest Store, One-Stop Shopping, Balance of Price and Distance

### In scope
- The 4 screens above, built in HTML/CSS/JS (frontend from Lovable, logic wired in by Kendra/Claude)
- Rule-based plan-generation logic (Kendra's own code): budget ÷ days ÷ household size → meal selection accounting for what's on hand → shopping list with estimated per-item cost → budget check → substitution if over budget
- Store comparison combining sample pricing data + real straight-line distance, with the four sort/priority options
- Clear on-page disclosure: store prices are illustrative/sample, distances are approximate straight-line (not travel) distance
- A documented Prompt Log (`ea-prompt-log.md`) showing how AI was used throughout design and build, for the gate's Fluency/Control dimensions

### Deliberately out of scope (named explicitly on gate day as "Future")
- Live grocery pricing via real store APIs (Kroger's Developer API is the one legitimate path found — see data investigation — pending confirmation of Chicago/Mariano's coverage)
- Real travel distance (driving/walking/transit), beyond straight-line
- More stores / broader chain coverage
- Matching to specific food pantries or assistance programs (a related, larger problem explored earlier and set aside)
- Nutrition/medical dietary restrictions beyond general healthy-eating framing
- User accounts, saved plans, notifications
- Backend, database, or any external AI/LLM API call at runtime — the "AI-built" story lives in the Prompt Log, not in a live AI feature
- Any affordability or recommendation decision made by an external API — that logic is entirely Kendra's own JavaScript

---

## 4. User Stories

**As a Chicago resident on a tight grocery budget (like Maria),**
- I want to enter my budget, household size, and how many days it needs to cover, so that the plan reflects my actual situation instead of a generic one.
- I want to tell the app what food I already have at home, so I'm not shown a plan that wastes money re-buying things I don't need.
- I want to see a clear, specific meal plan instead of vague advice, so I know exactly what to cook.
- I want an itemized shopping list with estimated costs and a running total against my budget, so I can tell before I shop whether the plan actually fits.
- I want to be told plainly if my budget realistically isn't enough for my household and days, so I'm not misled into a plan that will fail at checkout.
- I want prices clearly labeled as estimates, not live store prices, so I don't over-trust a number the app can't guarantee.

**As a Chicago shopper deciding where to buy,**
- I want to see a small set of nearby stores with an estimated total cost and distance for my plan, so I can compare my real options instead of guessing.
- I want to sort those options by lowest cost, closest store, one-stop convenience, or a balance of price and distance, so I can prioritize what actually matters to me in the moment (money vs. time vs. transportation).
- I want distance labeled clearly as approximate/straight-line, not driving or transit distance, so I don't underestimate how far I'd actually need to travel.

**As Kendra, building and presenting this for the Phase 1 gate,**
- I want a documented Prompt Log of how I used AI throughout the build, so I can demonstrate Fluency and Control on gate day.
- I want a clean separation between what the Mapbox API does (location only) and what my own code does (all affordability/recommendation logic), so I can clearly explain every part of the build and answer questions about it.
- I want the app's limitations (sample pricing, straight-line distance, no live grocery APIs) named explicitly, so my Trustworthy-AI Map/Measure/Manage answers are honest rather than overstated.

---

## 5. Related documents
- `ea-prompt-log.md` — verbatim prompt log for this build (Fluency/Control evidence)
- Next Chapter Project docs: `ethical-apple-spec-sheet.md` and `ethical-apple-data-investigation.md` (fuller architecture/data-source detail behind this plan)
