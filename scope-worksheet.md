# Scope Worksheet: Ethical Apple

**Program:** Next Chapter Project — Phase 1 Gate
**Author:** Kendra Hartnett

---

## The real problem + who has it

People in Chicago shopping on very limited grocery budgets often can't tell how to turn the money they have into enough meals to last until they can shop again. They have to balance budget, household size, days to cover, food already at home, and prices, and that leads to overspending, wasted food, or a cart that doesn't stretch far enough. Maria, a parent with $35, two kids, and until Friday, is the example.

## My solution (one sentence)

Ethical Apple turns a Chicago user's grocery budget into a simple meal and shopping plan, then compares estimated prices at a few nearby stores.

## Form (site / assistant / tool)

A small website, a front-end prototype built with HTML, CSS, and JavaScript, with no backend.

## What's in scope (be tight)

- 3 screens: a landing page, a budget form, a meal and grocery plan with a store comparison and distance below.
- Inputs: budget, household size, days to cover, dietary preferences, and a checklist of common pantry staples already on hand.
- Output: a 3-meal plan and an itemized shopping list, built by rule-based JavaScript I wrote from my own hand-made dataset of about 20 staple items.
- Store comparison across 3 Chicago stores using labeled sample prices, sorted two ways: lowest cost and closest.
- Safeguards tied to my failure mode: the plan is built to about 85–90% of the budget as a buffer, totals show as a price range, and the app won't name a "cheapest" store when the gap between stores is smaller than the data's likely error.
- Clear labels that prices are estimates and distances are approximate.
- **Done means:** given a budget, household size, and number of days, the app produces the plan and list, shows the total against the budget, and says plainly when the budget can't work.
- **Stretch goal, only after all of the above works:** real straight-line distance using the free US Census Geocoder and my own distance calculation.

## What I'm deliberately leaving out

- **AI-generated meal ideas:** The app works without AI, so I'm proving the core logic first. I'll name this as a future step.
- **Live grocery prices:** There's no legitimate free API for most Chicago chains. Kroger's is the one realistic future option, so I use labeled sample data.
- **Real driving, walking, or transit distance:** The app only estimates straight-line distance, and it says so.
- **More stores, user accounts, and saved plans:** They add scope without helping show the core idea.
- **Matching users to food pantries or assistance programs:** It's a related but larger problem.
- **Medical or special dietary needs:** I can't give reliable health guidance, so the app doesn't try.
- **"One-stop" and "balanced" store sorting:** They add logic that's harder to test and explain.

## My first guess at the failure mode (Map)

The estimated shopping total and store ranking come from sample prices, so if real prices run 10–15% higher, someone like Maria could end up over budget at checkout. She might also travel farther to a store the app called cheaper when it isn't. She likely wouldn't notice beforehand, because a specific dollar amount looks like fact and a small "sample pricing" label is easy to skim past.
