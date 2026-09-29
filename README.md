# Ethical Apple

![Ethical Apple landing page](docs/landing-page.png)

🚧 [View Live App](ethical-apple-grocery-plan.vercel.app)

A grocery budgeting and meal-planning app for Chicago residents.

**Program:** Next Chapter Project — Week 3, Phase 1 Gate ("The AI-Built Solution")
**Author:** Kendra Hartnett

## What it does

Tell Ethical Apple your grocery budget, household size, how many days it needs to cover, your dietary preferences, and what food you already have on hand — it builds a realistic meal plan and itemized shopping list that fits your budget, entirely with Kendra's own rule-based JavaScript.

## Problem

People shopping on very limited grocery budgets often have difficulty determining how to turn the money they have available into enough food and meals to last until they can shop again. Planning requires balancing budget, household size, number of days, existing food at home, dietary needs, nutrition, and grocery prices — all at once, which can lead to overspending, food waste, or food that doesn't stretch far enough.

**What can I make, with exactly what I have?**

See `mvp-plan.md` for the full problem statement, scope, and user stories.

## How it works

Everything runs client-side in the browser — no backend, no external API calls, and no AI model in the loop. This is a deliberate choice: an earlier local Ollama + grocery-pricing-API backend was built, tested, and then removed after testing surfaced real problems — an unreliable fallback path, no clean way to deploy it alongside the static Vercel frontend, and meal-plan generation that took far longer than the rule-based planner it was meant to improve on, for a list this app already fully controls in code.

- `src/data.js` holds the controlled dataset: grocery items with editable sample prices, and meal templates tagged by meal type (breakfast/lunch/dinner) and dietary tag.
- `src/planLogic.js` is Kendra's own decision-making logic: it selects one breakfast, one lunch, and one dinner per day from the eligible meals, builds the shopping list, and adjusts the meal selection up or down to land within 85–90% of the stated budget (a buffer against real prices running higher than the sample data).
- Only meal templates whose every ingredient exists in `GROCERY_ITEMS` are ever selectable — a handful of templates added during earlier work reference ingredients (e.g. ground turkey, chicken breast, salsa) that were never added to the sample dataset, so they're excluded from rotation rather than silently priced at $0. Adding matching grocery items would bring them back into use.
- A verified pantry quantity (entered in the "Pantry quantities" section of the form) is what actually reduces the shopping list and its cost. Typing an ingredient's name in the free-text "on hand" field only helps steer which meals get picked — it never waives a purchase on its own.
- `src/main.js` renders the UI and calls `generatePlan()` directly — no network request, no loading wait. The visual design/UI shell was generated with Replit (a Vite-based front end); all decision-making logic was written and tested independently, then wired into that UI.

## Supported stores

Three Chicago-area stores (ALDI, Walmart Supercenter, and Rico Fresh Market, all in/around Logan Square) are shown on the plan screen as reference locations with a map link — helpful for knowing where to shop, but this is not a live price or distance comparison. See "Future plans" below.

## Project structure

```
ethical-apple/
├── index.html          (Vite entry point — Replit-generated markup/shell)
├── package.json         (Vite project config + scripts)
├── vite.config.js        (Vite build/dev server config)
├── public/
│   └── favicon.svg
├── docs/
│   └── landing-page.png
└── src/
    ├── main.js           (renders the UI and calls generatePlan() directly)
    ├── data.js           (Controlled dataset: grocery items with sample
    │                       prices, meal templates)
    ├── planLogic.js       (Kendra's own decision-making logic: budget math,
    │                       meal selection, shopping list construction)
    ├── styles.css         (Directed by builder Replit-generated visual system)
    └── reference.css      (Directed by builder Replit-generated supporting styles)
```

Run locally with `npm install` then `npm run dev`, or `npm run build` / `npm run preview` for a production build. Run `npm test` to check the planner's logic (`tests/planLogic.test.js`).

## Future plans (not yet built)

- **Real location/distance and store price comparison.** Add the free US Census Geocoder (no API key/account needed) plus a self-written Haversine formula for real straight-line distance, and bring back a store-by-store cost comparison driven by the sample dataset, sortable by cost or distance.
- **More meal variety.** Add the currently-excluded ingredients (ground turkey, chicken breast, salsa, and others) to `GROCERY_ITEMS` with real sample prices, so the meal templates that already reference them become selectable.
- **A link to real food-access resources** when a plan is genuinely infeasible on the given budget, pointing users toward food-assistance programs instead of just asking them to raise the budget.

See `mvp-plan.md` for the full phased architecture.

## Project docs

- `mvp-plan.md` — problem statement, scope (in/out), and user stories
- `scope-worksheet.md` — the locked-down MVP scope (screens, stores, sort options, safeguards)
- `ea-prompt-log.md` — organized, phase-by-phase log of every prompt used to build this project, kept for the gate's Fluency/Control evidence

## Status

The app is fully client-side: built, tested, and deployed to Vercel with no backend. A local Ollama + grocery-pricing-API backend was built and tested, then removed after testing showed it wasn't a good fit — see "How it works" above. Real distance and a restored store-price comparison are planned next.

## Security and limitations (disclosed intentionally)

- Store prices shown are illustrative sample figures, not live pricing.
- The nearby-store section shows fixed locations, not live distance or a cost comparison (see Future plans above).
- Only a small set of Chicago stores and staple items are supported in this MVP.
- A handful of meal templates are currently excluded from rotation because they reference grocery items not yet in the sample dataset (see "How it works" above) — this keeps every displayed price accurate rather than silently understating a plan's cost.
- Dietary tags are preferences based on ingredients, not verified nutrition or allergy guidance.
