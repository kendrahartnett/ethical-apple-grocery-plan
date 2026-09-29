import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePlan, parseOnHand, AVAILABLE_MEAL_TEMPLATES } from '../src/planLogic.js';
import { GROCERY_ITEMS, MEAL_TEMPLATES, MEAL_TYPES } from '../src/data.js';

const baseForm = { budget: 95, householdSize: 2, days: 5, onHandIds: new Set(), pantry: {}, dietaryPreferences: [] };

test('only meals with fully-priced ingredients are ever selectable', () => {
  assert.ok(AVAILABLE_MEAL_TEMPLATES.length < MEAL_TEMPLATES.length, 'expected some templates to reference unpriced ingredients');
  const knownIds = new Set(GROCERY_ITEMS.map(i => i.id));
  for (const meal of AVAILABLE_MEAL_TEMPLATES) {
    for (const ing of meal.ingredients) assert.ok(knownIds.has(ing.itemId), `${meal.id} references unknown ingredient ${ing.itemId}`);
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
