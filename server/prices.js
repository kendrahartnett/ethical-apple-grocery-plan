import { readFile } from 'node:fs/promises';
import { catalog, cents } from './planner.js';

export const API_BASE = 'https://openpricengine.com/api/v1';
export async function boundedJson(response, limit = 2_000_000) {
  if (!response.ok) throw new Error(`Upstream request failed (${response.status}).`);
  let size = 0; const chunks = [];
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > limit) throw new Error('Upstream response too large.');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
export async function opeRequest(path, params, key, fetcher = fetch) {
  if (!key) throw new Error('Set GROCERY_API_KEY in the backend .env file.');
  const url = new URL(`${API_BASE}${path}`);
  for (const [k, v] of Object.entries(params || {})) for (const value of Array.isArray(v) ? v : [v]) url.searchParams.append(k, value);
  return boundedJson(await fetcher(url, { headers: { accept: 'application/json', Authorization: key }, redirect: 'error', signal: AbortSignal.timeout(12000) }));
}
export function sampleStores() {
  return [{ id: 'sample', name: 'Illustrative catalog (not a retailer)', offers: catalog.map(i => ({
    itemId: i.id, quantity: i.id === 'tortillas' ? 8 : 1,
    priceCents: cents(i.price), packageLabel: i.id === 'tortillas' ? '8 tortillas (sample assumption)' : `1 ${i.unit}`,
    productName: i.name, date: null,
  })) }];
}

export function validateMappings(mappings) {
  if (!Array.isArray(mappings) || mappings.length > 100) throw new Error('Product mappings must be an array of at most 100 entries.');
  for (const m of mappings) {
    if (!catalog.some(i => i.id === m.itemId) || !Number.isFinite(m.quantity) || m.quantity <= 0 || m.quantity > 1000 ||
      !['storeId', 'storeName', 'productName', 'productUrl', 'packageLabel'].every(k => typeof m[k] === 'string' && m[k].length > 0 && m[k].length < 1000) ||
      !/^https:\/\//.test(m.productUrl)) throw new Error('Invalid product mapping. Review the documented mapping format.');
  }
  return mappings;
}

export function normalizeOffer(records, mapping, now = new Date(), maxAgeDays = 3) {
  if (!Array.isArray(records)) return null;
  const record = records.find(r => r['Product Name'] === mapping.productName && r['Product URL'] === mapping.productUrl && r.Store === mapping.storeName && r.Currency === 'USD' && ['United States', 'United States of America', 'USA'].includes(r.Country));
  if (!record || !Array.isArray(record['Price over time'])) return null;
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const prices = record['Price over time'].filter(p => {
    if (typeof p.Date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(p.Date)) return false;
    const stamp = Date.parse(p.Date);
    return Number.isFinite(stamp) && new Date(stamp).toISOString().slice(0, 10) === p.Date && stamp <= today && today - stamp <= maxAgeDays * 86400000;
  }).sort((a, b) => b.Date.localeCompare(a.Date));
  const latest = prices[0];
  if (!latest || typeof latest.Price !== 'number' || !Number.isFinite(latest.Price) || latest.Price <= 0 || latest.Price > 10000 || cents(latest.Price) < 1) return null;
  return { itemId: mapping.itemId, quantity: mapping.quantity, packageLabel: mapping.packageLabel, priceCents: cents(latest.Price), productName: mapping.productName, productUrl: mapping.productUrl, date: latest.Date };
}

let cache;
export async function loadPrices(mode, env = process.env, fetcher = fetch) {
  if (mode === 'sample') return { stores: sampleStores(), warnings: ['Sample prices only. Whole-package costs are estimates; no retailer comparison is available.'] };
  const mappings = validateMappings(JSON.parse(await readFile(new URL('./product-mappings.json', import.meta.url), 'utf8')));
  if (!env.GROCERY_API_KEY || !mappings.length) throw new Error('Reported prices need a backend API key and reviewed product mappings. Select sample prices to try the planner.');
  const signature = JSON.stringify(mappings);
  if (cache && cache.signature === signature && cache.expires > Date.now()) return cache.value;
  const stores = new Map(); let unavailable = 0;
  // Small batches bound outbound concurrency and avoid unbounded upstream requests.
  for (let i = 0; i < mappings.length; i += 4) {
    await Promise.all(mappings.slice(i, i + 4).map(async m => {
      if (!stores.has(m.storeId)) stores.set(m.storeId, { id: m.storeId, name: m.storeName, offers: [] });
      try {
        const data = await opeRequest(`/${encodeURIComponent(m.storeId)}/products/today`, { productname: m.productName, currency: 'Default' }, env.GROCERY_API_KEY, fetcher);
        const offer = normalizeOffer(data, m);
        if (offer) stores.get(m.storeId).offers.push(offer); else unavailable++;
      } catch { unavailable++; }
    }));
  }
  const value = { stores: [...stores.values()], warnings: [
    'Prices reported by Open Price Engine, at most 3 days old. Chicago branch prices, stock, taxes, delivery fees and loyalty eligibility are not verified.',
    ...(unavailable ? [`${unavailable} product matches have missing, invalid, or outdated prices and cannot be used for a complete basket.`] : []),
  ] };
  cache = { signature, expires: Date.now() + 5 * 60000, value };
  return value;
}
