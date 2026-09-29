# Local Ollama and grocery pricing

## Run locally

Requires Node 22+ and the installed local Ollama model. A local `.env` has been initialized with `OLLAMA_MODEL=llama3`; no API key is stored by this implementation.

```powershell
npm run dev
```

Open http://127.0.0.1:5173. This starts Vite and the loopback-only API at port 3001. Select sample prices to test immediately. The API attempts Ollama first, then uses a validated deterministic fallback if unavailable or over budget. `npm test` checks the integration with mocked external services. `npm run build` builds the frontend. Preview requires a separately running `npm run server`.

The existing static Vercel deployment will need a separately deployed authenticated backend and private access to Ollama. This local backend is not a public hosting solution. Do not expose port 11434 or this development API to the internet. Browser authentication, HTTPS, CSRF/session handling, and per-user quotas are required before a public deployment.

## Enable reported store prices

1. Put your replacement credential in the ignored `.env`: `GROCERY_API_KEY=...`. Never use `VITE_` for a secret. Restart the app after changing it.
2. Run `npm run pricing:catalog` to discover the exact store identifiers accessible to your key.
3. Run `npm run pricing:catalog -- STORE_ID` to inspect product names, then `npm run pricing:catalog -- STORE_ID "EXACT PRODUCT NAME"` for a product record.
4. Review product identities, US coverage, package sizes, dietary suitability and reference units. Add mappings to `server/product-mappings.json`.
5. Select reported prices in the form. Nothing silently substitutes sample prices if a mapping or request fails.

Mapping shape (illustrative only; replace every product/store value with verified API data):

```json
[
  {
    "itemId": "rice",
    "storeId": "EXACT_API_STORE_ID",
    "storeName": "EXACT_RESPONSE_STORE_NAME",
    "productName": "EXACT_RESPONSE_PRODUCT_NAME",
    "productUrl": "https://retailer.example/exact-product",
    "quantity": 2,
    "packageLabel": "2 lb bag"
  }
]
```

`quantity` is the number of catalog units in ONE purchasable package, not the number of packages. Here rice uses pounds, so a 2 lb bag contains 2 units. Tortillas use individual tortillas, so an 8-count package has quantity 8. Eggs use dozens, so 6 eggs is quantity 0.5. For bag/box/jar/loaf/tub units, document a reference package size before mapping other sizes; do not assume two differently sized packages are equivalent. The initial sample catalog retains illustrative package-based portions. Verify those reference portions and nutrition before presenting production meal plans.

Exact product name, URL, store name, US country and USD currency must match. Only positive numeric prices with valid, nonfuture dates at most three days old are accepted. Failed or missing matches make a basket incomplete. Requests go to the fixed Open Price Engine HTTPS origin with the key in `Authorization` (no Bearer prefix). Redirects are refused. Offers are cached for five minutes; expiry never turns an invalid price into a valid one. Current code supports at most 100 reviewed mappings; use one product per ingredient per store.

The checked-in mapping list is deliberately empty: the provided documentation does not establish exact products, units or Chicago availability. A rotated credential and reviewed matches are still required to validate the live integration. The documentation's old chicken example is not used as price data.

## Planning and UI contract

`POST /api/plan` accepts `{ budget, household, days, dietaryPreferences, onHand, pantry, pricingMode }`. Budget is total USD across all people and days. The optional address stays in the browser. Pantry names influence the model but never waive costs; only explicit nonnegative quantities reduce purchases.

Ollama selects known eligible meal IDs in breakfast/lunch/dinner order and chooses approved preparation options. Backend-owned portions, ingredient IDs, dietary tags and prices cannot be overridden. Preparation options render bounded, approved ideas rather than unvalidated recipe instructions. Polish the selection prompt in `server/ollama.js`; expand approved preparation fragments in `server/planner.js`.

The response preserves `meals`, `shoppingList`, `totalCost`, `infeasible`, `infeasibleReason`, and adds `stores`, `selectedStore`, `source`, `pricingMode`, `warnings`, and timestamps. Each meal includes household ingredient quantities. Store results compare the SAME meal plan with each store's package sizes; incomplete baskets have a null total and are placed last. The selected shopping list belongs to the lowest complete basket.

All math uses integer price cents and rounded-up package counts after subtracting pantry quantities. Bread and tortillas scale with household demand rather than the old `daysPerUnit` shortcut. Under $10, templates containing cooking oil, salt or garlic are excluded even when those ingredients are on hand. This interpretation treats garlic as seasoning. The recipe set currently has no other standalone seasonings.

Budget acceptance is for the displayed grocery subtotal only. Unverified tax, shipping, service charges, stock, membership/loyalty conditions, branch price differences and subsequent price changes are not covered. Dietary tags in the original catalog are heuristic preferences, not verified nutrition/allergen constraints.

The fallback searches repeated breakfast/lunch/dinner combinations, then adds variety while keeping the full basket within budget. It is bounded, not an exhaustive optimization proof; failure says no plan was found rather than claiming no affordable plan can exist. Live mode never falls back to illustrative prices.

## Security and verification

Local API binds only 127.0.0.1, validates Host/Origin and JSON content type, caps bodies at 16 KB, allows one generation at a time and six requests per minute. Outbound API responses, concurrency and timeouts are bounded. Ollama has a fixed loopback URL, no tools, a server-selected model and a JSON schema. UI text is HTML-escaped. The backend never logs keys or raw upstream failures. Health exposes only whether a key is configured, not the value.

Sources: https://docs.ollama.com/api/chat and https://openpricengine.com/documentation/ (reviewed September 29, 2026).
