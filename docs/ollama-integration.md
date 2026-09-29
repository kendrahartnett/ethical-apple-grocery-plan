# Local Ollama planning

Run `npm run dev` to start the Vite frontend and loopback-only planning API. The local `.env` should contain `OLLAMA_MODEL=llama3`, `API_PORT=3001`, and `PORT=5180`. No grocery-price credential is needed. Ollama remains on `127.0.0.1:11434`.

The form sends `{ budget, household, days, dietaryPreferences, onHand, pantry }` to `POST /api/plan`. Budget is total USD for all people and days. Free-text pantry names guide selection but do not reduce purchase cost; only explicit pantry quantities do.

The editable `SYSTEM_PROMPT` in `server/ollama.js` asks Ollama for two original meals of each type, using only catalog ingredient IDs and per-person quantities. The backend rejects unknown items, malformed quantities, missing meal types, and oil or seasonings for budgets below $10. It assembles exactly one breakfast, lunch, and dinner per day from those model-created meals, preserving their names and preparation ideas. It calculates the full shopping list using sample prices in `src/data.js`, subtracts entered pantry quantities, rounds purchases up to whole packages, and accepts a plan only when that subtotal fits the entered budget. If the model is unavailable, invalid, or over budget, the app uses checked file-based templates and labels that fallback. If no plan is found, it reports infeasibility rather than showing an over-budget plan. Dietary preferences are planning prompts and ingredient-level heuristics, not verified nutritional or allergy claims.

The response contains `meals`, `shoppingList`, `totalCost`, `infeasible`, `infeasibleReason`, `source`, and `warnings`. Shopping-list rows have `itemId`, `name`, `qty`, `quantity`, `pantryMatch`, and `estimatedCost` for the existing frontend.

To add your own researched prices, edit `GROCERY_ITEMS.price` in `src/data.js`. Each price is USD for that item's declared unit. Confirm package counts, weights and usable quantities. The sample tortilla package currently assumes eight tortillas. Costs exclude checkout taxes and fees, and the app makes no claim about availability or prices at a particular store.

The API binds to loopback, validates Host and Origin, limits form size and request rate, and calls only a fixed loopback Ollama URL. There is no browser API key. The existing public static site cannot access the user's local Ollama through the server's `localhost`; public deployment requires an authenticated HTTPS backend with private model access.
