import { GROCERY_ITEMS, MEAL_TEMPLATES, MEAL_TYPES, DIETARY_PREFERENCES } from '../src/data.js';

export const catalog = GROCERY_ITEMS.map(item => ({ ...item, unit: item.id === 'tortillas' ? 'each' : item.unit }));
export const cents = value => Math.round(value * 100);
export function validateForm(body) {
  if (!body || typeof body !== 'object') throw new Error('A planning form is required.');
  const { budget, household, days, dietaryPreferences = [], onHand = '', pantry = {}, pricingMode = 'sample' } = body;
  if (!Number.isFinite(budget) || budget < 1 || budget > 10000 || Math.abs(budget * 100 - cents(budget)) > 0.0001) throw new Error('Budget must be $1–$10,000 with at most two decimal places.');
  if (!Number.isInteger(household) || household < 1 || household > 20) throw new Error('Household size must be 1–20.');
  if (!Number.isInteger(days) || days < 1 || days > 14) throw new Error('Days must be 1–14.');
  if (!Array.isArray(dietaryPreferences) || dietaryPreferences.length > DIETARY_PREFERENCES.length || dietaryPreferences.some(p => !DIETARY_PREFERENCES.some(d => d.key === p))) throw new Error('Invalid dietary preferences.');
  if (typeof onHand !== 'string' || onHand.length > 1000 || !pantry || typeof pantry !== 'object' || Array.isArray(pantry)) throw new Error('Invalid pantry information.');
  for (const [id, quantity] of Object.entries(pantry)) {
    if (!catalog.some(i => i.id === id) || !Number.isFinite(quantity) || quantity < 0 || quantity > 1000) throw new Error('Invalid pantry quantity.');
  }
  if (!['sample', 'live'].includes(pricingMode)) throw new Error('Select sample or reported prices.');
  return { budget, household, days, dietaryPreferences, onHand, pantry, pricingMode };
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

export function priceBasket(meals, form, store) {
  let totalCents = 0;
  const missingItems = [];
  const shoppingList = Object.entries(requirements(meals, form.household)).map(([itemId, required]) => {
    const item = catalog.find(i => i.id === itemId);
    const needed = Math.max(0, required - (form.pantry[itemId] || 0));
    const offer = store.offers.find(o => o.itemId === itemId);
    const pantryMatch = needed < 1e-8;
    if (!pantryMatch && !offer) missingItems.push(item.name);
    const qty = pantryMatch ? 0 : offer ? Math.ceil(needed / offer.quantity - 1e-8) : null;
    const cost = pantryMatch ? 0 : offer ? qty * offer.priceCents : null;
    if (cost !== null) totalCents += cost;
    return { itemId, name: item.name, unit: item.unit, required: +required.toFixed(4), pantryUsed: +Math.min(required, form.pantry[itemId] || 0).toFixed(4), qty, pantryMatch,
      quantity: pantryMatch ? 'on hand (quantity verified)' : offer ? `${qty} × ${offer.packageLabel}` : 'price unavailable',
      estimatedCost: cost === null ? null : cost / 100,
      productName: offer?.productName, productUrl: offer?.productUrl, priceUpdatedAt: offer?.date };
  });
  return { storeId: store.id, name: store.name, shoppingList, complete: missingItems.length === 0, missingItems,
    totalCents: missingItems.length ? null : totalCents, estimate: missingItems.length ? null : totalCents / 100,
    coveredItems: shoppingList.filter(i => !i.pantryMatch && i.estimatedCost !== null).length };
}

export function compare(meals, form, stores) {
  return stores.map(s => priceBasket(meals, form, s)).sort((a, b) => Number(b.complete) - Number(a.complete) || (a.totalCents ?? Infinity) - (b.totalCents ?? Infinity));
}

// A bounded deterministic fallback: seed with each breakfast/lunch/dinner combination,
// repeat to cover every day, then introduce variety only while the full basket fits.
export function fallbackPlan(form, stores, candidates) {
  const types = MEAL_TYPES.map(type => candidates.filter(m => m.mealType === type));
  let best = null;
  for (const store of stores) {
    for (const b of types[0]) for (const l of types[1]) for (const d of types[2]) {
      const meals = Array.from({ length: form.days }, () => [b, l, d]).flat();
      const priced = priceBasket(meals, form, store);
      if (priced.complete && priced.totalCents <= cents(form.budget) && (!best || priced.totalCents < best.cost)) best = { meals, store, cost: priced.totalCents };
    }
  }
  if (!best) return null;
  const used = new Set(best.meals.map(m => m.id));
  for (let i = 0; i < best.meals.length; i++) {
    for (const candidate of candidates.filter(m => m.mealType === best.meals[i].mealType && !used.has(m.id))) {
      const trial = best.meals.slice(); trial[i] = candidate;
      const priced = priceBasket(trial, form, best.store);
      if (priced.complete && priced.totalCents <= cents(form.budget)) { best.meals = trial; used.add(candidate.id); break; }
    }
  }
  return best.meals;
}

export function validateProposal(proposal, form, candidates) {
  if (!proposal || !Array.isArray(proposal.meals) || proposal.meals.length !== form.days * 3) throw new Error('Expected exactly three meals per day.');
  return proposal.meals.map((entry, index) => {
    const meal = candidates.find(m => m.id === entry.mealId);
    if (!meal || meal.mealType !== MEAL_TYPES[index % 3]) throw new Error('Invalid meal ID, dietary preference, or meal order.');
    // Preparation is composed from approved fragments, not unchecked model prose.
    if (!['batch', 'portion', 'fresh'].includes(entry.preparation)) throw new Error('Invalid preparation option.');
    return { ...meal, preparation: entry.preparation };
  });
}

export function preparationText(meal) {
  const ideas = { batch: 'Prepare the listed ingredients in a batch, then divide into the planned household portions.', portion: 'Measure the listed ingredients for your household before preparing this meal.', fresh: 'Prepare this meal shortly before serving, using only its listed ingredients.' };
  return ideas[meal.preparation] || ideas.portion;
}
