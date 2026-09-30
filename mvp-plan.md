# Ethical Apple — MVP Plan

**Program:** Next Chapter Project — Week 3, Phase 1 Gate

**Author:** Kendra Hartnett

**Status:** Final browser-based prototype. The [scope worksheet](scope-worksheet.md) is the source of truth for the current scope; this plan explains the user journey, implementation, testing, and next steps.

## Problem and intended user

People shopping on tight grocery budgets must decide what meals will cover their household until the next shopping trip, which ingredients they still need, and whether those purchases might fit the money available. Budget, household size, days to cover, food already at home, and prices all affect the decision.

Maria is an **illustrative user**, not a research participant: she has two kids, $35, and needs food to last until Friday. Her question is, “What meals can I make, what do I need to buy, and will it fit?” Today she might plan meals, write a list, estimate costs, remove items that exceed her budget, and then discover a different total at checkout. Ethical Apple helps with the planning steps; its sample prices cannot promise a checkout result.

## Solution and completed scope

Ethical Apple starts with a household's total grocery budget and builds a three-meals-per-day plan, an itemized shopping list, and sample basket comparisons for three nearby Chicago stores. It is a static website built with HTML, CSS, and JavaScript. The final app has no backend, live price API, or AI model at runtime.

The app has **three screens**:

1. **Landing page:** explains the purpose and opens the planner.
2. **Form:** collects budget, household size, days, dietary preferences, ingredients the user would like to use, and optional pantry quantities.
3. **Results page:** shows breakfast, lunch, and dinner for each day; the shopping list and estimated total; and a store-comparison section. The grocery list and budget totals can be downloaded, copied, or shared.

The ingredient catalog currently has **41 items** with editable sample prices, and the planner has **45 meal templates**. The three displayed stores are ALDI, Walmart Supercenter, and Rico Fresh Market in or around Logan Square.

### How a plan is made

1. [`src/main.js`](src/main.js) collects the form values and calls `generatePlan()` in the browser.
2. [`src/planLogic.js`](src/planLogic.js) considers only meal templates whose ingredients have positive catalog prices, then filters and ranks them using the selected dietary tags and ingredients the user would like to use.
3. The planner selects one breakfast, one lunch, and one dinner per day. It aggregates ingredient needs, subtracts **entered pantry quantities**, rounds purchases to catalog units, and calculates a sample-price total. Typing a name in the free-text field does not make that ingredient free.
4. The planner aims for **87.5% of the entered budget** to leave a buffer. It may swap meals to use more of a generous budget or to reduce an over-budget estimate. A feasible result must still pass the full-budget check at sample prices.
5. If the planner cannot find a feasible result, the page explains that limitation rather than showing an over-budget plan as feasible. Its low-budget screening rule is a planning heuristic, not proof that a household cannot afford food.
6. The results page calculates three **sample basket estimates** by adjusting catalog prices for each store. Users can sort by estimated cost or sample distance. When the lowest two estimates differ by less than the **12.5% caution threshold**, the app avoids naming one the cheapest.

[`src/data.js`](src/data.js) holds the controlled ingredient, meal, dietary-tag, and store data. The product references for the 20 ingredients priced most recently are in [`docs/sample-price-sources.md`](docs/sample-price-sources.md).

## Risks, safeguards, and limits

**The main risk is false precision.** A single dollar amount can look like a guaranteed checkout total even though the catalog uses sample prices. If real prices are higher, someone with a tight budget may have to put food back. A store ranking based on sample adjustments could also suggest an unnecessary trip.

- The app labels prices as **estimates**, shows the estimated total against the entered budget, and aims below the full budget. The 87.5% target reduces some planning risk; it does not guarantee real-world affordability.
- Store estimates are **not observed product-by-product prices** at ALDI, Walmart, or Rico Fresh Market. They are calculated from sample catalog prices with per-store adjustments.
- Distances are **fixed sample values** from a Logan Square reference point. They are not based on a user's location and do not represent walking, driving, or transit routes.
- The 12.5% comparison threshold is a **design choice**, not a measured error rate. The app does not call a store cheapest when the sample estimates are too close under that rule.
- The app displays **one estimated dollar total**, not a price range. Taxes, fees, stock, and actual package sizes may change the amount paid.
- Dietary tags express planning preferences. They are not verified nutrition, allergy, or medical guidance.

These limits are shown in the interface so users know to check current prices, stock, hours, and travel details before shopping.

## Verification and completion criteria

The automated tests in [`tests/planLogic.test.js`](tests/planLogic.test.js) check that template ingredients are priced, a normal plan contains all three meal types each day, infeasible cases are flagged, dietary tags filter candidates, entered pantry quantities affect cost, selected sample-price plans stay within tested budgets, and store sorting and cheapest-label suppression behave as intended. Run them with `npm test`; use `npm run build` to check the production build.

For this MVP, “done” means a user can enter their household details and receive a plan, shopping list, and sample-price total—or a clear explanation when the planner cannot find one. Passing tests does **not** establish that real Chicago checkout prices, nutrition claims, or travel distances are accurate.

## What I tested and learned

I explored a local Ollama meal-planning backend and an external grocery-price API. The first model integration mostly ranked existing templates, took too long in a local test, and did not work as intended on the Vercel deployment. A fallback inside a local backend could not help a deployed frontend that could not reach that backend or the model on my computer. The price API did not provide dependable coverage for the products and stores this prototype needed. I removed both integrations from the final app rather than present their output as reliable.

This decision keeps the current planner's choices and arithmetic inspectable. A future AI component would need a meaningful, bounded role, validated ingredient and quantity output, independent budget checks, and a secure service reachable by the deployed app.

## Out of scope and future direction

The finished prototype does not include live grocery prices, user-specific travel distances, accounts, saved plans, notifications, food-pantry matching, medical dietary advice, or “best overall” store rankings.

The larger food access and affordability app could add current local product prices, location-based travel information, and links to food-assistance resources. Each needs verified data coverage and a way to handle missing or outdated information. AI-generated meal ideas may be revisited only if the app can validate them against priced ingredients and budget constraints before displaying them.

## User stories

**As a household planning groceries, I want to:**

- Enter my total budget, number of people, and number of days so the plan fits my situation.
- Identify food already in my kitchen, including quantities when I know them, so the shopping estimate does not count verified pantry food as a purchase.
- See one breakfast, lunch, and dinner per day with an itemized shopping list and sample-price total.
- Receive a clear message when the planner cannot find a feasible result instead of a misleading plan.
- Know that the prices are estimates before I use the list at a store.

**As a Chicago shopper comparing options, I want to:**

- See a small set of nearby stores and sample basket estimates for the same list.
- Sort those stores by sample cost or sample distance while seeing what those measures do—and do not—mean.

**As the builder, I want to:**

- Explain and test the decisions the app makes with my controlled dataset.
- Document the experiments that did not work and the limits of the final version.

## Related documents

- [`scope-worksheet.md`](scope-worksheet.md) — final scope and trustworthy-AI framing.
- [`README.md`](README.md) — concise project overview and local setup.
- [`docs/sample-price-sources.md`](docs/sample-price-sources.md) — reference products behind the most recently added sample prices.
- [`ea-prompt-log.md`](ea-prompt-log.md) — build and prompting history.
