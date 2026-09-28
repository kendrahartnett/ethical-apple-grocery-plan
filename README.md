# Ethical Apple

A front-end grocery budgeting and meal-planning app for Chicago residents, built with HTML, CSS, and JavaScript — no backend, no database, no external AI/LLM API calls at runtime.

**Program:** Next Chapter Project — Week 3, Phase 1 Gate ("The AI-Built Solution")
**Author:** Kendra Hartnett

## What it does

Tell Ethical Apple your grocery budget, household size, how many days it needs to cover, and what food you already have on hand — it builds a realistic meal plan and itemized shopping list that fits your budget, then compares a small set of nearby Chicago grocery stores on estimated cost and approximate distance so you can decide where to shop.

## Problem

People shopping on very limited grocery budgets often have difficulty determining how to turn the money they have available into enough food and meals to last until they can shop again. Planning requires balancing budget, household size, number of days, existing food at home, dietary needs, nutrition, and grocery prices — all at once, which can lead to overspending, food waste, or food that doesn't stretch far enough.

See `mvp-plan.md` for the full problem statement, scope, and user stories.

## How it's built

- **HTML / CSS / JavaScript only** — a static front-end prototype, no backend or database.
- **All affordability and recommendation logic is hand-written JavaScript**: budget ÷ days ÷ household size → meal selection accounting for what's on hand → itemized shopping list with estimated costs → budget check → substitutions if over budget.
- **Mapbox Geocoding API** is used for one thing only: converting a Chicago ZIP/neighborhood and the supported stores' addresses into coordinates. A self-written Haversine formula then calculates approximate straight-line distance between them.
- **Sample/illustrative grocery pricing data** for a small set of Chicago stores and staple items — not live store pricing (see the data investigation doc for why).
- Store comparison can be sorted four ways: Lowest Grocery Cost, Closest Store, One-Stop Shopping, Balance of Price and Distance.

## Project docs

- `mvp-plan.md` — problem statement, scope (in/out), and user stories
- `ea-prompt-log.md` — verbatim log of every prompt used to build this project, kept for the gate's Fluency/Control evidence

## Status

Actively being built for the Week 3 Phase 1 gate. Front-end design provided via Loveable; JavaScript logic (budgeting, meal planning, Mapbox geocoding + Haversine distance, store comparison) is being wired into it.

## Limitations (disclosed intentionally)

- Store prices shown are sample/illustrative figures, not live pricing.
- Distances shown are approximate straight-line distances, not driving, walking, or transit distance.
- Only a small set of Chicago stores and staple items are supported in this MVP.
