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

test('an unaffordable sample-price plan is reported infeasible', () => {
  const plan = generatePlan({ ...baseForm, budget: 1, householdSize: 20, days: 14 });
  assert.equal(plan.infeasible, true);
  assert.match(plan.infeasibleReason, /could not find a meal plan/);
  assert.match(plan.infeasibleReason, /does not mean feeding your household on that budget is impossible/);
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

test('bread loaves and tortilla packs cover the selected recipes for the whole household', () => {
  const plans = [
    generatePlan({ ...baseForm, budget: 10000, days: 1, householdSize: 20 }),
    generatePlan({ ...baseForm, budget: 35, days: 4, householdSize: 3 }),
  ];
  assert.ok(plans.some(plan => plan.shoppingList.some(line => line.itemId === 'bread')));
  assert.ok(plans.some(plan => plan.shoppingList.some(line => line.itemId === 'tortillas')));
  for (const plan of plans) {
    const householdSize = plan === plans[0] ? 20 : 3;
    for (const itemId of ['bread', 'tortillas']) {
      const required = plan.meals.reduce((sum, meal) => sum + meal.ingredients
        .filter(ing => ing.itemId === itemId)
        .reduce((subtotal, ing) => subtotal + ing.qtyPerPerson * householdSize, 0), 0);
      const line = plan.shoppingList.find(i => i.itemId === itemId);
      if (required > 0) {
        const unitsPerPackage = GROCERY_ITEMS.find(i => i.id === itemId).unitsPerPackage || 1;
        assert.equal(line.qty, Math.ceil(required / unitsPerPackage));
      }
    }
  }
});

test('entered tortillas cover individual tortillas before packs are calculated', () => {
  const form = { ...baseForm, budget: 10000, days: 1, householdSize: 20 };
  const withoutPantry = generatePlan(form);
  const needed = withoutPantry.meals.reduce((sum, meal) => sum + meal.ingredients
    .filter(ing => ing.itemId === 'tortillas')
    .reduce((subtotal, ing) => subtotal + ing.qtyPerPerson * 20, 0), 0);
  if (needed > 0) {
    const withPantry = generatePlan({ ...form, pantry: { tortillas: needed } });
    assert.equal(withPantry.shoppingList.find(i => i.itemId === 'tortillas').pantryMatch, true);
  }
});

test('a low cash budget can use entered pantry quantities', () => {
  const pantry = Object.fromEntries(GROCERY_ITEMS.map(item => [item.id, 1000]));
  const plan = generatePlan({ ...baseForm, budget: 1, pantry });
  assert.equal(plan.infeasible, false);
  assert.equal(plan.totalCost, 0);
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
