# Ethical Apple

![Ethical Apple landing page](docs/landing-page.png)

[View the live app](https://ethical-apple-grocery-plan.vercel.app/)

Ethical Apple is a browser-based grocery budgeting and meal-planning prototype for Chicago households. It turns a total budget, household size, and number of days into one breakfast, lunch, and dinner per day, an itemized shopping list, and sample basket comparisons for three nearby stores.

**Author:** Kendra Hartnett

**Program:** Next Chapter Project — Week 3, Phase 1 Gate

## Why this project exists

People shopping on tight budgets need to know whether a set of meals will last until the next shopping trip and what the ingredients might cost. Ethical Apple starts with the budget rather than a prewritten grocery list. It is a small, testable part of a larger food access and affordability app.

## What the prototype does

- Accepts a total budget, household size, days to cover, dietary preferences, ingredients the user would like to use, and optional pantry quantities.
- Selects one breakfast, lunch, and dinner for each day from 45 meal templates using rule-based JavaScript. The ingredient catalog contains 41 items with editable sample prices.
- Aggregates ingredients into a shopping list, subtracts entered pantry quantities, rounds needed purchases to catalog units, and compares the estimated total with the entered budget. Names typed into the free-text on-hand field guide meal selection but do not reduce the purchase cost.
- Aims for 87.5% of the budget to leave a buffer. If no feasible plan is found at sample prices, the results page explains that instead of presenting an over-budget plan as feasible.
- Compares sample basket estimates for ALDI, Walmart Supercenter, and Rico Fresh Market. Users can sort by estimated cost or sample distance. When the two lowest estimates are within a 12.5% caution threshold, the app does not identify one as the cheapest.
- Lets users download, copy, or share the shopping list and budget totals.

The landing page, form, and results page are rendered by the front end. The store comparison appears on the results page.

## How it works

The production app is entirely client-side: there is no backend, live grocery-price API, or AI model running when someone submits the form.

- [`src/data.js`](src/data.js) defines the ingredient catalog, meal templates, dietary tags, and three sample store records.
- [`src/planLogic.js`](src/planLogic.js) selects meals, checks sample-price budget fit, builds the shopping list, and calculates and sorts store estimates. A meal is eligible only when every ingredient has a positive catalog price.
- [`src/main.js`](src/main.js) renders the interface and calls the planner directly in the browser.
- [`docs/sample-price-sources.md`](docs/sample-price-sources.md) records product references and package sizes for the 20 ingredients priced most recently.

A local Ollama integration and an external grocery-price API were explored during development. The final prototype uses the rule-based planner because the model integration was slow and the deployed static site could not access the model and backend running on the developer's computer.

## Run locally

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To run the automated checks and preview a production build:

```bash
npm test
npm run build
npm run preview
```

## Limits of the estimates

**The displayed totals are planning estimates, not checkout quotes.** Catalog prices are editable samples; the three store estimates apply sample adjustments rather than product-by-product observed prices at each location. The app displays a single estimated dollar total, not a price range. Taxes, fees, stock changes, and different package sizes can change the actual amount paid. The 87.5% buffer is a planning target, not a guarantee that real purchases will stay under budget.

Distances are fixed example values for the Logan Square area. They are not calculated from the user's location and do not represent a walking, driving, or transit route. The 12.5% store-comparison threshold is a cautious design choice, not a measured price-error rate. Dietary tags are planning preferences, not verified nutrition or allergy guidance.

## Project documents and next steps

- [`scope-worksheet.md`](scope-worksheet.md) records the final prototype scope, safeguards, and lessons learned.
- [`mvp-plan.md`](mvp-plan.md) explains the final user journey, implementation, verification, lessons learned, and future direction.
- [`ea-prompt-log.md`](ea-prompt-log.md) documents the build and learning process.

The larger vision includes current local grocery prices, real location-based travel information, and connections to food-access resources. Each would need its own data-quality and reliability checks before being presented as guidance to shoppers.
