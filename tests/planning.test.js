import test from 'node:test';
import assert from 'node:assert/strict';
import { validateForm, eligibleMeals, priceBasket, compare, fallbackPlan, validateProposal, catalog } from '../server/planner.js';
import { sampleStores, normalizeOffer, opeRequest } from '../server/prices.js';
import { createPlan } from '../server/service.js';
import { makeServer } from '../server/index.js';
import { MEAL_TEMPLATES } from '../src/data.js';

const form = { budget: 95, household: 2, days: 5, onHand: '', pantry: {}, dietaryPreferences: [], pricingMode: 'sample' };
test('form validation rejects malformed and excessive inputs', () => {
  for (const change of [{ budget: -1 }, { budget: 1.001 }, { household: 1.5 }, { days: 15 }, { pantry: { rice: -2 } }, { dietaryPreferences: ['unknown'] }, { onHand: 'x'.repeat(1001) }]) assert.throws(() => validateForm({ ...form, ...change }));
  assert.equal(validateForm(form).budget, 95);
});
test('all template ingredients resolve to priced catalog items', () => {
  for (const m of MEAL_TEMPLATES) for (const i of m.ingredients) assert.ok(catalog.some(c => c.id === i.itemId), i.itemId);
});
test('whole packages scale with people; pantry names alone do not waive cost', () => {
  const meal = { ingredients: [{ itemId: 'tortillas', qtyPerPerson: 3 }, { itemId: 'bread', qtyPerPerson: 0.25 }] };
  const store = sampleStores()[0];
  const large = priceBasket([meal, meal], { ...form, household: 10, onHand: 'bread, tortillas' }, store);
  assert.equal(large.shoppingList[0].qty, 8); // 60 tortillas / 8 per package
  assert.equal(large.shoppingList[1].qty, 5); // no daysPerUnit shortcut
  const pantry = priceBasket([meal], { ...form, pantry: { tortillas: 6, bread: 0.25 } }, store);
  assert.equal(pantry.shoppingList[0].estimatedCost, 0);
  assert.equal(pantry.shoppingList[1].qty, 1);
});
test('incomplete baskets never masquerade as cheaper complete baskets', () => {
  const meals = [MEAL_TEMPLATES[0]];
  const results = compare(meals, form, [{ id: 'empty', name: 'Missing', offers: [] }, sampleStores()[0]]);
  assert.equal(results[0].complete, true);
  assert.equal(results[1].estimate, null);
  assert.ok(results[1].missingItems.length);
});
test('under $10 excludes oil and seasonings and honors every preference', () => {
  const meals = eligibleMeals({ ...form, budget: 9.99, dietaryPreferences: ['vegetarian'] });
  assert.ok(meals.length);
  for (const meal of meals) {
    assert.ok(meal.dietaryTags.includes('vegetarian'));
    assert.ok(!meal.ingredients.some(i => ['cooking_oil', 'salt', 'garlic'].includes(i.itemId)));
  }
});
test('model output cannot change prices, portions, types or introduce preparation HTML', () => {
  const candidates = eligibleMeals(form);
  const oneDay = { ...form, days: 1 };
  const meals = ['breakfast', 'lunch', 'dinner'].map(t => ({ mealId: candidates.find(m => m.mealType === t).id, preparation: 'fresh', price: 0 }));
  assert.equal(validateProposal({ meals }, oneDay, candidates).length, 3);
  assert.throws(() => validateProposal({ meals: meals.slice(1) }, oneDay, candidates));
  assert.throws(() => validateProposal({ meals: meals.map(m => ({ ...m, preparation: '<img onerror=alert(1)>' })) }, oneDay, candidates));
  assert.throws(() => validateProposal({ meals: meals.toReversed() }, oneDay, candidates));
});
test('fallback returns exactly three meals daily within full-package budget', () => {
  const meals = fallbackPlan(form, sampleStores(), eligibleMeals(form));
  assert.ok(meals);
  assert.equal(meals.length, 15);
  assert.ok(new Set(meals.map(m => m.id)).size > 3);
  const basket = compare(meals, form, sampleStores())[0];
  assert.ok(basket.totalCents <= 9500);
});
test('unavailable Ollama falls back; insufficient budget never returns an accepted expensive plan', async () => {
  const dependencies = { propose: async () => { throw new Error('offline'); } };
  const plan = await createPlan(form, dependencies);
  assert.equal(plan.source, 'rules');
  assert.ok(plan.totalCost <= form.budget);
  const impossible = await createPlan({ ...form, budget: 1, household: 20, days: 14 }, dependencies);
  assert.equal(impossible.infeasible, true);
  assert.deepEqual(impossible.meals, []);
});

const mapping = { itemId: 'rice', storeId: 'test', storeName: 'Test Store', productName: 'Rice 2 lb', productUrl: 'https://example.com/rice', quantity: 2, packageLabel: '2 lb bag' };
const record = { Country: 'United States', Currency: 'USD', Store: 'Test Store', 'Product Name': 'Rice 2 lb', 'Product URL': 'https://example.com/rice', 'Price over time': [{ Date: '2026-09-28', Price: 2.25 }] };
test('prices require exact product match, US/USD, valid dates and fresh positive numbers', () => {
  const now = new Date('2026-09-29T12:00:00Z');
  assert.equal(normalizeOffer([record], mapping, now).priceCents, 225);
  for (const change of [{ Currency: 'GBP' }, { Country: 'England' }, { Store: 'Other' }, { 'Product Name': 'Chicken Feet' }, { 'Price over time': [{ Date: '2023-07-20', Price: 7.9 }] }, { 'Price over time': [{ Date: '2026-09-30', Price: 1 }] }, { 'Price over time': [{ Date: '2026-09-28', Price: '$1' }] }]) assert.equal(normalizeOffer([{ ...record, ...change }], mapping, now), null);
});
test('price adapter sends key only as Authorization and refuses redirects', async () => {
  await opeRequest('/stores', {}, 'test-secret', async (url, options) => {
    assert.equal(url.origin, 'https://openpricengine.com');
    assert.ok(!String(url).includes('test-secret'));
    assert.equal(options.headers.Authorization, 'test-secret');
    assert.equal(options.redirect, 'error');
    return new Response('[]');
  });
});
test('local API rejects foreign origins, invalid bodies and oversized payloads', async () => {
  const server = makeServer({ planner: async () => ({ ok: true }), port: 3001 });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/plan`;
  const headers = { Host: '127.0.0.1:3001', 'Content-Type': 'application/json', Origin: 'http://127.0.0.1:5173' };
  try {
    assert.equal((await fetch(url, { method: 'POST', headers, body: JSON.stringify(form) })).status, 200);
    assert.equal((await fetch(url, { method: 'POST', headers: { ...headers, Origin: 'https://evil.example' }, body: '{}' })).status, 403);
    assert.equal((await fetch(url, { method: 'POST', headers, body: '{}' })).status, 400);
    assert.equal((await fetch(url, { method: 'POST', headers, body: 'x'.repeat(17000) })).status, 413);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
