import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePlan, parseOnHand, AVAILABLE_MEAL_TEMPLATES, computeStoreResults, sortStoreResults, isCheapestTooCloseToCall, PRICE_ERROR_MARGIN } from '../src/planLogic.js';
import { GROCERY_ITEMS, MEAL_TEMPLATES, MEAL_TYPES, STORES } from '../src/data.js';

const baseForm = { budget: 95, householdSize: 2, days: 5, onHandIds: new Set(), pantry: {}, dietaryPreferences: [] };

test('all template ingredients have positive catalog prices', () => {
  const items = new Map(GROCERY_ITEMS.map(item => [item.id, item]));
  assert.equal(items.size, GROCERY_ITEMS.length, 'catalog IDs should be unique');
  for (const meal of MEAL_TEMPLATES) for (const ing of meal.ingredients) {
    assert.ok(items.has(ing.itemId), `${meal.id} references unknown ingredient ${ing.itemId}`);
  }
  assert.equal(AVAILABLE_MEAL_TEMPLATES.length, MEAL_TEMPLATES.length);
  for (const meal of AVAILABLE_MEAL_TEMPLATES) for (const ing of meal.ingredients) {
    assert.ok(Number.isFinite(items.get(ing.itemId).price) && items.get(ing.itemId).price > 0, `${meal.id} includes unpriced ${ing.itemId}`);
  }
});

test('a normal plan builds one breakfast, lunch, and dinner per day within budget', () => {
  const plan = generatePlan(baseForm);
  assert.equal(plan.infeasible, false);
  assert.equal(plan.meals.length, baseForm.days * 3);
  assert.deepEqual(plan.meals.slice(0, 3).map(m => m.mealType), MEAL_TYPES);
  assert.ok(plan.totalCost <= baseForm.budget);
});

test('an unrealistically small budget is reported infeasible with no meals', () => {
  const plan = generatePlan({ ...baseForm, budget: 1, householdSize: 20, days: 14 });
  assert.equal(plan.infeasible, true);
  assert.deepEqual(plan.meals, []);
  assert.deepEqual(plan.shoppingList, []);
});

test('dietary preferences filter which meals can be selected', () => {
  const plan = generatePlan({ ...baseForm, dietaryPreferences: ['vegetarian'] });
  assert.equal(plan.infeasible, false);
  for (const meal of plan.meals) assert.ok((meal.dietaryTags || []).includes('vegetarian'), meal.id);
});

test('a verified pantry quantity reduces cost; typing the name alone does not', () => {
  const named = generatePlan({ ...baseForm, onHandIds: parseOnHand('rice, beans') });
  const quantified = generatePlan({ ...baseForm, pantry: { rice: 10, beans: 10 } });
  const namedItem = named.shoppingList.find(i => i.itemId === 'rice');
  const quantifiedItem = quantified.shoppingList.find(i => i.itemId === 'rice');
  assert.ok(namedItem && namedItem.estimatedCost > 0, 'typing an ingredient name alone should not zero its cost');
  assert.ok(quantifiedItem && quantifiedItem.pantryMatch, 'a large verified pantry quantity should fully cover the item');
});

test('bulk staples (bread, tortillas) scale with plan length, not per-meal usage', () => {
  const plan = generatePlan({ ...baseForm, days: 5, householdSize: 4 });
  const bread = plan.shoppingList.find(i => i.itemId === 'bread');
  if (bread && !bread.pantryMatch) assert.equal(bread.qty, 1, 'a 5-day plan should need only 1 loaf regardless of household size');
});

test('the plan never exceeds the stated budget', () => {
  for (const budget of [50, 95, 150, 200]) {
    const plan = generatePlan({ ...baseForm, budget, days: 7, householdSize: 3 });
    if (!plan.infeasible) assert.ok(plan.totalCost <= budget, `$${plan.totalCost} exceeded $${budget} budget`);
  }
});

test('computeStoreResults returns one priced, distance-labeled result per store', () => {
  const plan = generatePlan(baseForm);
  const results = computeStoreResults(plan.shoppingList);
  assert.equal(results.length, STORES.length);
  for (const result of results) {
    assert.ok(result.estimate > 0, `${result.name} should have a positive basket estimate`);
    assert.ok(typeof result.distance === 'number', `${result.name} should carry a sample distance`);
    assert.ok(result.name && result.address, `${result.name} should carry display fields`);
  }
});

test('sortStoreResults only supports cost and distance, matching the locked scope', () => {
  const plan = generatePlan(baseForm);
  const results = computeStoreResults(plan.shoppingList);
  const byCost = sortStoreResults(results, 'cost');
  const byDistance = sortStoreResults(results, 'distance');
  for (let i = 1; i < byCost.length; i++) assert.ok(byCost[i].estimate >= byCost[i - 1].estimate, 'cost sort should be ascending');
  for (let i = 1; i < byDistance.length; i++) assert.ok(byDistance[i].distance >= byDistance[i - 1].distance, 'distance sort should be ascending');
});

test('a "cheapest" store is only named when the price gap clears the error margin', () => {
  const closeCall = [{ estimate: 20 }, { estimate: 20.5 }, { estimate: 30 }];
  const clearWinner = [{ estimate: 10 }, { estimate: 30 }, { estimate: 35 }];
  assert.equal(isCheapestTooCloseToCall(closeCall), true, `a ${((0.5 / 20) * 100).toFixed(1)}% gap is inside the ${PRICE_ERROR_MARGIN * 100}% margin and should be suppressed`);
  assert.equal(isCheapestTooCloseToCall(clearWinner), false, 'a wide gap should not be suppressed');
});
