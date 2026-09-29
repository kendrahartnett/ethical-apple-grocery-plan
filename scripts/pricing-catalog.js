import { opeRequest } from '../server/prices.js';
// Read-only discovery. Never print credentials or include them in query strings.
const [store, product] = process.argv.slice(2);
try {
  const path = product ? `/${encodeURIComponent(store)}/products/today` : store ? '/stores/products/names' : '/stores';
  const params = product ? { productname: product, currency: 'Default' } : store ? { stores: [store] } : {};
  console.log(JSON.stringify(await opeRequest(path, params, process.env.GROCERY_API_KEY), null, 2));
} catch { console.error('Could not retrieve catalog. Check the backend key, subscription, and store identifier.'); process.exitCode = 1; }
