import { validateForm, eligibleMeals, validateProposal, compare, fallbackPlan, cents, preparationText, catalog } from './planner.js';
import { loadPrices } from './prices.js';
import { propose } from './ollama.js';

export async function createPlan(body, dependencies = {}) {
  const form = validateForm(body);
  const { stores, warnings } = await (dependencies.loadPrices || loadPrices)(form.pricingMode);
  const notes = [...warnings];
  if (form.onHand.trim()) notes.push('Pantry names alone do not reduce the total. Only the quantities entered below the form are subtracted.');
  const candidates = eligibleMeals(form);
  let meals, source = 'rules', feedback = '';
  if (['breakfast', 'lunch', 'dinner'].every(t => candidates.some(m => m.mealType === t))) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const proposal = await (dependencies.propose || propose)(form, candidates, stores, feedback);
        const trial = validateProposal(proposal, form, candidates);
        const cheapest = compare(trial, form, stores)[0];
        if (cheapest?.complete && cheapest.totalCents <= cents(form.budget)) { meals = trial; source = 'ollama'; break; }
        feedback = cheapest?.complete ? `The computed basket costs $${cheapest.estimate}; the total budget is $${form.budget}. Choose cheaper combinations.` : 'The proposal has no complete priced basket. Use ingredients with prices at a single store.';
      } catch {
        feedback = 'The previous output was unavailable or invalid. Use exactly the schema and allowed meal IDs in breakfast, lunch, dinner order.';
        // Network timeouts should not cause a second lengthy wait.
        if (attempt === 0) { notes.push('AI assistance was unavailable or invalid; using the checked rule-based planner.'); break; }
      }
    }
    if (!meals) {
      meals = fallbackPlan(form, stores, candidates);
      if (!notes.some(n => n.includes('rule-based'))) notes.push('The AI proposal did not pass the budget checks; using the checked rule-based planner.');
    }
  }
  const base = { pricingMode: form.pricingMode, source, warnings: notes, currency: 'USD', generatedAt: new Date().toISOString(), budget: form.budget };
  if (!meals) return { ...base, meals: [], shoppingList: [], totalCost: 0, stores: [], infeasible: true,
    infeasibleReason: 'No complete plan within this budget was found using the eligible meal templates and available prices. This is not proof that no affordable plan exists. Adjust the budget, days, preferences, or verified pantry quantities.' };
  const results = compare(meals, form, stores);
  const chosen = results[0];
  if (!chosen?.complete || chosen.totalCents > cents(form.budget)) throw new Error('Plan failed final budget verification.');
  return { ...base, meals: meals.map(m => ({ ...m, preparationIdea: preparationText(m), ingredients: m.ingredients.map(i => ({ ...i, name: catalog.find(c => c.id === i.itemId).name, unit: catalog.find(c => c.id === i.itemId).unit, householdQuantity: +(i.qtyPerPerson * form.household).toFixed(3) })) })),
    shoppingList: chosen.shoppingList, totalCost: chosen.estimate, selectedStoreId: chosen.storeId, selectedStore: chosen.name,
    stores: results, infeasible: false, infeasibleReason: null };
}
