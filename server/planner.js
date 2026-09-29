import { GROCERY_ITEMS, MEAL_TEMPLATES, MEAL_TYPES, DIETARY_PREFERENCES } from '../src/data.js';

export const catalog = GROCERY_ITEMS.map(item => ({ ...item, unit: item.id === 'tortillas' ? 'each' : item.unit }));
export const cents = value => Math.round(value * 100);
export function validateForm(body) {
  if (!body || typeof body !== 'object') throw new Error('A planning form is required.');
  const { budget, household, days, dietaryPreferences = [], onHand = '', pantry = {} } = body;
  if (!Number.isFinite(budget) || budget < 1 || budget > 10000 || Math.abs(budget * 100 - cents(budget)) > 0.0001) throw new Error('Budget must be $1–$10,000 with at most two decimal places.');
  if (!Number.isInteger(household) || household < 1 || household > 20) throw new Error('Household size must be 1–20.');
  if (!Number.isInteger(days) || days < 1 || days > 14) throw new Error('Days must be 1–14.');
  if (!Array.isArray(dietaryPreferences) || dietaryPreferences.length > DIETARY_PREFERENCES.length || dietaryPreferences.some(p => !DIETARY_PREFERENCES.some(d => d.key === p))) throw new Error('Invalid dietary preferences.');
  if (typeof onHand !== 'string' || onHand.length > 1000 || !pantry || typeof pantry !== 'object' || Array.isArray(pantry)) throw new Error('Invalid pantry information.');
  for (const [id, quantity] of Object.entries(pantry)) {
    if (!catalog.some(i => i.id === id) || !Number.isFinite(quantity) || quantity < 0 || quantity > 1000) throw new Error('Invalid pantry quantity.');
  }
  return { budget, household, days, dietaryPreferences, onHand, pantry };
}

export function eligibleMeals(form) {
  return MEAL_TEMPLATES.filter(m => form.dietaryPreferences.every(p => (m.dietaryTags || []).includes(p)))
    .filter(m => m.ingredients.every(i => catalog.some(c => c.id === i.itemId)))
    // Under $10 excludes oil and seasonings even when in the pantry. Do not silently rewrite recipes.
    .filter(m => form.budget >= 10 || !m.ingredients.some(i => ['cooking_oil', 'salt', 'garlic'].includes(i.itemId)));
}

export function requirements(meals, household) {
  const amounts = {};
  for (const meal of meals) for (const ing of meal.ingredients) {
    amounts[ing.itemId] = (amounts[ing.itemId] || 0) + ing.qtyPerPerson * household;
  }
  return amounts;
}

export function pricePlan(meals, form) {
  let totalCents = 0;
  const shoppingList = Object.entries(requirements(meals, form.household)).map(([itemId, required]) => {
    const item = catalog.find(i => i.id === itemId);
    const needed = Math.max(0, required - (form.pantry[itemId] || 0));
    const pantryMatch = needed < 1e-8;
    const packageSize = item.id === 'tortillas' ? 8 : 1;
    const qty = pantryMatch ? 0 : Math.ceil(needed / packageSize - 1e-8);
    const cost = qty * cents(item.price);
    totalCents += cost;
    const packageLabel = item.id === 'tortillas' ? '8 tortillas (sample assumption)' : `1 ${item.unit}`;
    return { itemId, name: item.name, unit: item.unit, required: +required.toFixed(4), pantryUsed: +Math.min(required, form.pantry[itemId] || 0).toFixed(4), qty, pantryMatch,
      quantity: pantryMatch ? 'on hand (quantity verified)' : `${qty} × ${packageLabel}`,
      estimatedCost: cost / 100 };
  });
  return { shoppingList, totalCents, totalCost: totalCents / 100 };
}

// A bounded deterministic fallback: seed with each breakfast/lunch/dinner combination,
// repeat to cover every day, then introduce variety only while the full basket fits.
export function fallbackPlan(form, candidates, preferredIds = []) {
  const types = MEAL_TYPES.map(type => candidates.filter(m => m.mealType === type));
  let best = null;
  for (const b of types[0]) for (const l of types[1]) for (const d of types[2]) {
    const meals = Array.from({ length: form.days }, () => [b, l, d]).flat();
    const priced = pricePlan(meals, form);
    if (priced.totalCents <= cents(form.budget) && (!best || priced.totalCents < best.cost)) best = { meals, cost: priced.totalCents };
  }
  if (!best) return null;
  const used = new Set(best.meals.map(m => m.id));
  for (let i = 0; i < best.meals.length; i++) {
    const choices = candidates.filter(m => m.mealType === best.meals[i].mealType && !used.has(m.id))
      .sort((a, b) => (preferredIds.indexOf(a.id) < 0 ? Infinity : preferredIds.indexOf(a.id)) - (preferredIds.indexOf(b.id) < 0 ? Infinity : preferredIds.indexOf(b.id)));
    for (const candidate of choices) {
      const trial = best.meals.slice(); trial[i] = candidate;
      const priced = pricePlan(trial, form);
      if (priced.totalCents <= cents(form.budget)) { best.meals = trial; used.add(candidate.id); break; }
    }
  }
  return best.meals;
}

export function validateGeneratedMeals(proposal, form) {
  if (!Array.isArray(proposal?.meals) || proposal.meals.length < 3 || proposal.meals.length > 12) throw new Error('Invalid model meal list.');
  const allowed = new Map(catalog.map(item => [item.id, item]));
  const meals = [];
  const names = new Set();
  for (const [index, raw] of proposal.meals.entries()) {
    if (!MEAL_TYPES.includes(raw?.mealType) || typeof raw.name !== 'string' || raw.name.trim().length < 3 || raw.name.length > 90) throw new Error('Invalid model meal.');
    if (names.has(raw.name.trim().toLowerCase())) throw new Error('Repeated model meal.');
    names.add(raw.name.trim().toLowerCase());
    if (typeof raw.preparationIdea !== 'string' || raw.preparationIdea.trim().length < 5 || raw.preparationIdea.length > 350) throw new Error('Invalid model preparation.');
    if (raw.note != null && (typeof raw.note !== 'string' || raw.note.length > 160)) throw new Error('Invalid model note.');
    if (!Array.isArray(raw.ingredients) || raw.ingredients.length < 1 || raw.ingredients.length > 5) throw new Error('Invalid model ingredients.');
    const seen = new Set();
    const ingredients = raw.ingredients.map(i => {
      if (!i || typeof i.itemId !== 'string' || !allowed.has(i.itemId) || seen.has(i.itemId) || !Number.isFinite(i.qtyPerPerson) || i.qtyPerPerson <= 0 || i.qtyPerPerson > 3) throw new Error('Unpriced or invalid model ingredient.');
      if (form.budget < 10 && ['cooking_oil', 'salt', 'garlic'].includes(i.itemId)) throw new Error('Seasoning excluded for budgets below $10.');
      seen.add(i.itemId);
      return { itemId: i.itemId, qtyPerPerson: i.qtyPerPerson };
    });
    if (form.dietaryPreferences.includes('highProtein') && !ingredients.some(i => ['eggs', 'chicken', 'ground_beef', 'tuna', 'greek_yogurt', 'beans', 'lentils', 'peanut_butter'].includes(i.itemId))) throw new Error('Model meal misses protein preference.');
    if (form.dietaryPreferences.includes('highFiber') && !ingredients.some(i => ['beans', 'lentils', 'oats', 'frozen_veg', 'carrots'].includes(i.itemId))) throw new Error('Model meal misses fiber preference.');
    meals.push({ id: `model-${index}`, mealType: raw.mealType, name: raw.name.trim(), note: (raw.note || '').trim(), preparationIdea: raw.preparationIdea.trim(), ingredients });
  }
  if (!MEAL_TYPES.every(type => meals.some(meal => meal.mealType === type))) throw new Error('Model omitted a meal type.');
  return meals;
}

export function preparationText(meal) {
  const ids = new Set(meal.ingredients.map(i => i.itemId));
  const steps = [];
  if (ids.has('rice')) steps.push('Cook the rice according to its package directions');
  if (ids.has('lentils')) steps.push('Cook the lentils according to their package directions');
  if (ids.has('oats')) steps.push('Prepare the oats according to their package directions');
  if (ids.has('pasta')) steps.push('Cook and drain the pasta');
  if (ids.has('potatoes')) steps.push('Cook the potatoes until tender');
  if (ids.has('chicken')) steps.push('Cook the chicken thoroughly');
  if (ids.has('ground_beef')) steps.push('Cook the ground beef thoroughly');
  if (ids.has('eggs')) steps.push('Cook the eggs to your preference');
  if (ids.has('beans')) steps.push('Drain and heat the beans if serving warm');
  if (ids.has('frozen_veg')) steps.push('Cook the frozen vegetables according to their package directions');
  if (ids.has('bread')) steps.push('Toast the bread if you like');
  if (ids.has('tortillas')) steps.push('Warm the tortillas');
  if (!steps.length) steps.push('Combine the listed ingredients');
  const add = ['bananas', 'peanut_butter', 'cheese', 'greek_yogurt', 'tuna', 'tomato_sauce', 'carrots', 'onion'].filter(id => ids.has(id)).map(id => catalog.find(i => i.id === id).name.toLowerCase());
  return `${steps.join('; ')}. ${add.length ? `Finish with ${add.join(', ')}.` : 'Divide into the planned household portions.'}`;
}
