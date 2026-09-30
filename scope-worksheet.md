# Scope Worksheet: Ethical Apple — Final Prototype

**Program:** Next Chapter Project — Phase 1 Gate
**Author:** Kendra Hartnett

## The problem and who has it

People shopping on tight grocery budgets need to turn a limited amount of money into enough meals for everyone in their household until they can shop again. They have to consider the budget, household size, number of days, food already at home, and grocery prices at the same time. Maria—a Chicago parent with two kids and $35 to last until Friday—is the person I kept in mind. Her question is: “What meals can I make, what do I need to buy, and will it fit?”

## My solution in one sentence

Ethical Apple starts with a household’s budget and builds a three-meals-per-day plan, an itemized shopping list, and sample basket comparisons for three nearby Chicago stores.

## Form

A front-end website built with HTML, CSS, and JavaScript. The final app runs in the browser, with no backend or AI model at runtime.

## What is in scope

- **Three screens:** a landing page, a form, and a results page containing the meal plan, shopping list, and store comparison.
- **Inputs:** total budget, household size, days to cover, ingredients the user would like to use, optional pantry quantities, and dietary preferences.
- **Meal planning:** My rule-based JavaScript selects one breakfast, one lunch, and one dinner per day from 45 meal templates. A catalog of 41 ingredients supplies editable sample prices. Only entered pantry *quantities* reduce the estimated cost; typing an ingredient’s name guides selection but does not make it free.
- **Shopping output:** An itemized list and estimated total shown against the entered budget. Users can download, copy, or share the grocery list and totals.
- **Store comparison:** Sample basket estimates for ALDI, Walmart Supercenter, and Rico Fresh Market, sortable by estimated cost or sample distance. The store estimates are adjustments to sample prices, not observed prices for every product at each store.
- **Budget safeguards:** The planner aims for 87.5% of the budget to leave a buffer. It does not display an over-budget sample-price plan as feasible, and it gives a clear message when it cannot find a workable plan. If the two lowest store estimates are within a 12.5% caution threshold, it avoids calling either one the cheapest.
- **Clear limits:** The page labels prices as estimates and distances as fixed example values. It tells users to confirm prices, stock, and hours before shopping.

**Done means:** A user can enter their household details and receive three meals per day, a shopping list, and a sample-price total—or a clear message that the app could not find a plan within the entered budget. Tests check the budget calculation across selected cases; they do not guarantee a real checkout total.

## What I left out

- **AI-generated meals and prices:** I tested a local Ollama integration. It was slow, initially had little influence on the meals, and did not work as intended on the Vercel deployment because the deployed site could not reach the model and backend on my computer. I kept the final version rule-based so I could inspect and test its decisions. AI remains a possible future feature if its output can be validated before users see it.
- **Live grocery prices:** I tested an external grocery-price API, but it did not give dependable coverage for the products and stores this prototype needed. The current prices are labeled samples. I recorded sources for the 20 ingredients I priced most recently.
- **Real travel distance:** The current distances are fixed samples, not distances from a user’s location or estimates of walking, driving, or transit time.
- **Accounts, saved plans, more stores, and assistance-program matching:** These belong to the larger food access app I hope to build, beyond this prototype’s scope.
- **Medical or allergy guidance:** Dietary tags are planning preferences, not verified health advice.
- **Additional store rankings:** The app supports sorting by estimated cost or sample distance, without “best overall” or “one-stop” claims.

## Trustworthy-AI lens

**Map the risk:** Sample prices can look more certain than they are. If checkout prices are higher, someone like Maria could go over budget. A store ranking based on sample adjustments could also lead her to make an unnecessary trip.

**Measure it:** I tested normal and difficult budgets, household sizes, pantry quantities, dietary preferences, and store-ranking behavior. One test checks that feasible plans stay within the entered budget **at the catalog’s sample prices**. This does not measure price accuracy at a Chicago store.

**Manage it:** The app aims below the full budget, labels its estimates and sample distances, avoids declaring a cheapest store when estimates are close, and gives a clear result when it cannot find a feasible plan. The 12.5% comparison threshold is a cautious design choice, not a measured error rate.

**What I learned:** Staying in control of the build meant understanding what the model was—and was not—doing, testing the fallback, and recognizing that a local model does not automatically become available to a deployed website. This prototype is a small, testable part of a larger food access and affordability app.
