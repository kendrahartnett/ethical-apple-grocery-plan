import test from 'node:test';
import assert from 'node:assert/strict';
import { validateForm, eligibleMeals, pricePlan, fallbackPlan, validateGeneratedMeals, catalog } from '../server/planner.js';
import { createPlan } from '../server/service.js';
import { makeServer } from '../server/index.js';
import { MEAL_TEMPLATES } from '../src/data.js';

const form = { budget: 95, household: 2, days: 5, onHand: '', pantry: {}, dietaryPreferences: [] };

test('form validation rejects invalid budget, size, preferences, and pantry quantities', () => {
  for (const change of [{ budget: -1 }, { budget: 1.001 }, { household: 1.5 }, { days: 15 }, { pantry: { rice: -2 } }, { dietaryPreferences: ['unknown'] }, { onHand: 'x'.repeat(1001) }]) assert.throws(() => validateForm({ ...form, ...change }));
  assert.equal(validateForm(form).budget, 95);
});

test('templates without priced ingredients are excluded from fallback choices', () => {
  const eligible = eligibleMeals(form);
  assert.ok(eligible.length < MEAL_TEMPLATES.length);
  for (const meal of eligible) for (const ing of meal.ingredients) {
    const item = catalog.find(c => c.id === ing.itemId);
    assert.ok(item, ing.itemId);
    assert.ok(Number.isFinite(item.price) && item.price > 0, ing.itemId);
  }
});

test('whole packages scale with people; names alone do not waive prices', () => {
  const meal = { ingredients: [{ itemId: 'tortillas', qtyPerPerson: 3 }, { itemId: 'bread', qtyPerPerson: 0.25 }] };
  const large = pricePlan([meal, meal], { ...form, household: 10, onHand: 'bread, tortillas' });
  assert.equal(large.shoppingList[0].qty, 8);
  assert.equal(large.shoppingList[1].qty, 5);
  const pantry = pricePlan([meal], { ...form, pantry: { tortillas: 6, bread: 0.25 } });
  assert.equal(pantry.shoppingList[0].estimatedCost, 0);
  assert.equal(pantry.shoppingList[1].qty, 1);
});

test('under $10 excludes oil and seasonings', () => {
  for (const meal of eligibleMeals({ ...form, budget: 9.99 })) assert.ok(!meal.ingredients.some(i => ['cooking_oil', 'salt', 'garlic'].includes(i.itemId)));
});

const modelProposal = { meals: [
  { mealType: 'breakfast', name: 'Banana oat bowl', note: 'Warm and filling', preparationIdea: 'Cook oats and top with banana.', ingredients: [{ itemId: 'oats', qtyPerPerson: 0.1 }, { itemId: 'bananas', qtyPerPerson: 0.2 }] },
  { mealType: 'lunch', name: 'Bean rice bowl', note: 'Simple lunch', preparationIdea: 'Cook rice and warm the beans.', ingredients: [{ itemId: 'rice', qtyPerPerson: 0.2 }, { itemId: 'beans', qtyPerPerson: 0.25 }] },
  { mealType: 'dinner', name: 'Lentil potato plate', note: 'Hearty dinner', preparationIdea: 'Cook lentils and potatoes until tender.', ingredients: [{ itemId: 'lentils', qtyPerPerson: 0.15 }, { itemId: 'potatoes', qtyPerPerson: 0.2 }] },
] };

test('model can author meals, but unknown ingredients and forbidden seasonings are rejected', async () => {
  assert.equal(validateGeneratedMeals(modelProposal, form).length, 3);
  assert.throws(() => validateGeneratedMeals({ meals: modelProposal.meals.map((meal, index) => index ? meal : { ...meal, ingredients: [{ itemId: 'invented', qtyPerPerson: 1 }] }) }, form));
  assert.throws(() => validateGeneratedMeals({ meals: modelProposal.meals.map((meal, index) => index ? meal : { ...meal, ingredients: [{ itemId: 'salt', qtyPerPerson: 0.1 }] }) }, { ...form, budget: 9 }));
  const plan = await createPlan(form, { propose: async () => modelProposal });
  assert.equal(plan.source, 'ollama');
  assert.equal(plan.meals.length, 15);
  assert.equal(plan.meals[0].name, 'Banana oat bowl');
  assert.equal(plan.meals[0].preparationIdea, 'Cook oats and top with banana.');
  assert.ok(plan.totalCost <= form.budget);
});

test('fallback builds one of each meal type daily within the sample budget', () => {
  const meals = fallbackPlan(form, eligibleMeals(form));
  assert.equal(meals.length, 15);
  assert.deepEqual(meals.slice(0, 3).map(m => m.mealType), ['breakfast', 'lunch', 'dinner']);
  assert.ok(new Set(meals.map(m => m.id)).size > 3);
  assert.ok(pricePlan(meals, form).totalCost <= form.budget);
});

test('unavailable Ollama falls back; impossible sample budget is reported as infeasible', async () => {
  const deps = { propose: async () => { throw new Error('offline'); } };
  const plan = await createPlan(form, deps);
  assert.equal(plan.source, 'rules');
  assert.ok(plan.totalCost <= form.budget);
  assert.equal(plan.stores, undefined);
  const impossible = await createPlan({ ...form, budget: 1, household: 20, days: 14 }, deps);
  assert.equal(impossible.infeasible, true);
  assert.deepEqual(impossible.meals, []);
});

test('local API checks origin and input size', async () => {
  const server = makeServer({ planner: async () => ({ ok: true }), port: 3001 });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/plan`;
  const headers = { Host: '127.0.0.1:3001', 'Content-Type': 'application/json', Origin: 'http://127.0.0.1:5173' };
  try {
    assert.equal((await fetch(url, { method: 'POST', headers, body: JSON.stringify(form) })).status, 200);
    assert.equal((await fetch(url, { method: 'POST', headers: { ...headers, Origin: 'https://evil.example' }, body: '{}' })).status, 403);
    assert.equal((await fetch(url, { method: 'POST', headers, body: 'x'.repeat(17000) })).status, 413);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
