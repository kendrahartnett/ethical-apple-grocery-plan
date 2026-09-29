import { validateForm, eligibleMeals, validateGeneratedMeals, pricePlan, fallbackPlan, cents, preparationText, catalog } from './planner.js';
import { propose } from './ollama.js';

export async function createPlan(body, dependencies = {}) {
  const form = validateForm(body);
  const notes = ['Prices are editable sample figures, not live store quotes.'];
  if (form.onHand.trim()) notes.push('Pantry names alone do not reduce the total. Only the quantities entered below the form are subtracted.');
  const candidates = eligibleMeals(form);
  let meals, source = 'rules';
  try {
    const proposal = await (dependencies.propose || propose)(form);
    const generated = validateGeneratedMeals(proposal, form);
    meals = fallbackPlan(form, generated);
    if (meals) source = 'ollama';
    else notes.push('The model-created meals did not fit the sample-price budget; using the checked template planner.');
  } catch { notes.push('AI meal generation was unavailable or invalid; using the checked template planner.'); }
  if (!meals && ['breakfast', 'lunch', 'dinner'].every(t => candidates.some(m => m.mealType === t))) {
    meals = fallbackPlan(form, candidates);
  }
  const base = { source, warnings: notes, currency: 'USD', generatedAt: new Date().toISOString(), budget: form.budget };
  if (!meals) return { ...base, meals: [], shoppingList: [], totalCost: 0, infeasible: true,
    infeasibleReason: 'No plan within this budget was found using the eligible meal templates and sample prices. Adjust the budget, days, preferences, or verified pantry quantities.' };
  const priced = pricePlan(meals, form);
  if (priced.totalCents > cents(form.budget)) throw new Error('Plan failed final budget verification.');
  return { ...base, meals: meals.map(m => ({ ...m, preparationIdea: source === 'ollama' ? m.preparationIdea : preparationText(m), ingredients: m.ingredients.map(i => ({ ...i, name: catalog.find(c => c.id === i.itemId).name, unit: catalog.find(c => c.id === i.itemId).unit, householdQuantity: +(i.qtyPerPerson * form.household).toFixed(3) })) })),
    shoppingList: priced.shoppingList, totalCost: priced.totalCost, infeasible: false, infeasibleReason: null };
}
