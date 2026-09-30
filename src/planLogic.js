/**
 * planLogic.js — Ethical Apple
 *
 * All of the app's decision-making: budget math, meal selection, shopping
 * list construction, and budget-fit substitution. This is Kendra's own
 * logic (originally written and tested as app.js before the Replit
 * frontend arrived) — main.js only renders whatever this module decides.
 * No external API or backend is used here: this runs entirely in the
 * browser, so the app can be deployed as a static site with no server.
 */

import { GROCERY_ITEMS, MEAL_TEMPLATES, MEAL_TYPES, STORES } from "./data.js";

// Scope worksheet safeguard: build the plan to about 85-90% of budget, not
// the full amount, so there's a buffer if real prices run higher than the
// sample data. 0.875 is the midpoint of that range.
const BUDGET_BUFFER_FRACTION = 0.875;

const PRICED_ITEM_IDS = new Set(GROCERY_ITEMS.filter((i) => Number.isFinite(i.price) && i.price > 0).map((i) => i.id));

/**
 * A meal is selectable only when every ingredient has a positive catalog
 * price. Newly cataloged ingredients with price: null cannot be mistaken
 * for free food while their researched prices are still pending.
 */
export const AVAILABLE_MEAL_TEMPLATES = MEAL_TEMPLATES.filter((m) =>
  m.ingredients.every((ing) => PRICED_ITEM_IDS.has(ing.itemId))
);

/**
 * Parse the "already on hand" free-text field into a Set of GROCERY_ITEMS
 * ids, matched loosely by name. This only guides which meals are preferred
 * (ingredient reuse) -- it never reduces cost on its own. Only a verified
 * quantity entered in the pantry fields below reduces what's shown as
 * needing to be bought (see buildShoppingList).
 */
export function parseOnHand(text) {
  const onHandIds = new Set();
  if (!text) return onHandIds;
  const typed = text
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  GROCERY_ITEMS.forEach((item) => {
    const itemName = item.name.toLowerCase();
    if (typed.some((t) => itemName.includes(t) || t.includes(item.id.replace(/_/g, " ")))) {
      onHandIds.add(item.id);
    }
  });
  return onHandIds;
}

function mealCost(meal, householdSize, onHandIds) {
  return meal.ingredients.reduce((sum, ing) => {
    if (onHandIds.has(ing.itemId)) return sum; // already have it, no added cost
    const item = GROCERY_ITEMS.find((g) => g.id === ing.itemId);
    if (!item) return sum;
    return sum + item.price * ing.qtyPerPerson * householdSize / (item.unitsPerPackage || 1);
  }, 0);
}

/**
 * Aggregate ingredient quantities across all selected meals and price out
 * what still needs to be bought. Only a verified quantity entered in the
 * pantry field (pantry[itemId]) is subtracted from what's needed -- typing
 * an ingredient's name in the free-text "on hand" field is a preference
 * signal for meal selection only, never a free supply.
 *
 * Recipe quantities and pantry quantities use the same units. An item with
 * unitsPerPackage (tortillas) is purchased as enough whole packs to cover
 * the remaining individual units after pantry quantities are subtracted.
 */
function buildShoppingList(meals, householdSize, pantry) {
  const quantities = {}; // itemId -> total raw qty needed across the whole plan

  meals.forEach((meal) => {
    meal.ingredients.forEach((ing) => {
      const totalQty = ing.qtyPerPerson * householdSize;
      quantities[ing.itemId] = (quantities[ing.itemId] || 0) + totalQty;
    });
  });

  const shoppingList = [];
  let totalCost = 0;

  Object.entries(quantities).forEach(([itemId, qty]) => {
    const item = GROCERY_ITEMS.find((g) => g.id === itemId);
    if (!item) return;

    const pantryQty = Math.max(0, Number(pantry?.[itemId]) || 0);
    const neededQty = Math.max(0, qty - pantryQty);
    const pantryMatch = neededQty < 1e-8;
    const roundedQty = pantryMatch ? 0 : Math.max(1, Math.ceil(neededQty / (item.unitsPerPackage || 1) - 1e-8));
    const estimatedCost = pantryMatch ? 0 : roundedQty * item.price;
    if (!pantryMatch) totalCost += estimatedCost;

    shoppingList.push({
      itemId,
      name: item.name,
      unit: item.unit,
      qty: roundedQty,
      pantryMatch,
      quantity: pantryMatch ? "on hand" : `${roundedQty} ${roundedQty === 1 ? item.unit : item.unit === "loaf" ? "loaves" : `${item.unit}s`}`,
      estimatedCost,
    });
  });

  return { shoppingList, totalCost };
}

/**
 * Core rule-based planner.
 * budget, householdSize, days: numbers
 * onHandIds: Set of GROCERY_ITEMS ids typed into the free-text "on hand"
 *   field -- used only to prefer meals built around them, never to reduce
 *   cost.
 * pantry: { [itemId]: quantity } verified amounts already on hand; these
 *   are what actually reduce the shopping list and its cost.
 * dietaryPreferences: array of DIETARY_PREFERENCES keys, all of which a
 *   candidate meal's dietaryTags must include.
 *
 * Returns { meals, shoppingList, totalCost, infeasible, infeasibleReason }
 */
export function generatePlan({ budget, householdSize, days, onHandIds = new Set(), pantry = {}, dietaryPreferences = [] }) {
  // The buffer target the plan aims for; the full budget is still the hard
  // ceiling used for the final feasibility check below.
  const targetBudget = budget * BUDGET_BUFFER_FRACTION;

  // Dietary Preferences checklist: a meal is a candidate only if it carries
  // every preference the user checked, in its own `dietaryTags` array. With
  // nothing checked, every meal with fully-priced ingredients is a
  // candidate.
  let candidates = dietaryPreferences.length
    ? AVAILABLE_MEAL_TEMPLATES.filter((m) => dietaryPreferences.every((pref) => (m.dietaryTags || []).includes(pref)))
    : AVAILABLE_MEAL_TEMPLATES.slice();

  const onHandScore = (meal) => meal.ingredients.filter((ing) => onHandIds.has(ing.itemId)).length;

  candidates = candidates.slice().sort((a, b) => {
    const scoreDiff = onHandScore(b) - onHandScore(a);
    if (scoreDiff !== 0) return scoreDiff;
    return (b.pantryFriendly ? 1 : 0) - (a.pantryFriendly ? 1 : 0);
  });

  // Partition the sorted candidates by meal type (breakfast/lunch/dinner)
  // so each day gets one of each, instead of one meal total.
  const byType = {};
  MEAL_TYPES.forEach((type) => {
    byType[type] = candidates.filter((m) => m.mealType === type);
  });
  const missingType = MEAL_TYPES.find((type) => byType[type].length === 0);

  if (candidates.length === 0 || missingType) {
    return {
      meals: [],
      shoppingList: [],
      totalCost: 0,
      infeasible: true,
      infeasibleReason: "No meals in the current dataset fit every dietary preference checked. Try unchecking one to see more options.",
    };
  }

  // Pick one breakfast, one lunch, and one dinner per day, cycling through
  // each type's sorted candidates for variety (repeats are allowed once a
  // type's options run out for longer plans).
  let selectedMeals = [];
  for (let day = 0; day < days; day++) {
    MEAL_TYPES.forEach((type) => {
      const typeCandidates = byType[type];
      selectedMeals.push(typeCandidates[day % typeCandidates.length]);
    });
  }

  let { shoppingList, totalCost } = buildShoppingList(selectedMeals, householdSize, pantry);

  // If the initial (cheapest-first) plan leaves a lot of the budget unused,
  // swap in pricier, more varied meals from the same eligible set -- the
  // mirror image of the over-budget substitution below, but upward -- so a
  // generous budget actually gets used instead of always settling near the
  // cheapest possible plan. This never pushes the total past targetBudget,
  // so it can't undo the budget-buffer safeguard.
  if (totalCost < targetBudget * 0.7) {
    const priciestByType = {};
    const upgradeIndex = {};
    MEAL_TYPES.forEach((type) => {
      priciestByType[type] = byType[type]
        .slice()
        .sort((a, b) => mealCost(b, householdSize, onHandIds) - mealCost(a, householdSize, onHandIds));
      upgradeIndex[type] = 0;
    });

    for (let i = 0; i < selectedMeals.length; i++) {
      if (totalCost >= targetBudget) break;
      const type = selectedMeals[i].mealType;
      const options = priciestByType[type];
      if (!options.length) continue;
      const candidate = options[upgradeIndex[type] % options.length];
      upgradeIndex[type]++;
      if (candidate.id === selectedMeals[i].id) continue;

      const trial = selectedMeals.slice();
      trial[i] = candidate;
      const rebuilt = buildShoppingList(trial, householdSize, pantry);
      if (rebuilt.totalCost > targetBudget) continue; // would overshoot the buffer target -- skip this swap

      selectedMeals = trial;
      shoppingList = rebuilt.shoppingList;
      totalCost = rebuilt.totalCost;
    }
  }

  // If over budget, substitute the priciest non-pantry-friendly meals with
  // cheaper pantry-friendly meals of the SAME type (swapping a dinner for a
  // pantry-friendly dinner, not a breakfast) until it fits, or until
  // substitutions run out.
  let attempts = 0;
  const pantryFriendlyByType = {};
  const substitutionCounts = {};
  MEAL_TYPES.forEach((type) => {
    pantryFriendlyByType[type] = byType[type].filter((m) => m.pantryFriendly);
    substitutionCounts[type] = 0;
  });

  while (totalCost > targetBudget && attempts < selectedMeals.length) {
    let worstIndex = -1;
    let worstCost = -1;
    selectedMeals.forEach((meal, idx) => {
      if (meal.pantryFriendly) return;
      const cost = mealCost(meal, householdSize, onHandIds);
      if (cost > worstCost) {
        worstCost = cost;
        worstIndex = idx;
      }
    });

    if (worstIndex === -1) break;

    const type = selectedMeals[worstIndex].mealType;
    const replacements = pantryFriendlyByType[type];
    if (!replacements || replacements.length === 0) break;

    const replacement = replacements[substitutionCounts[type] % replacements.length];
    selectedMeals[worstIndex] = replacement;
    substitutionCounts[type]++;

    const rebuilt = buildShoppingList(selectedMeals, householdSize, pantry);
    shoppingList = rebuilt.shoppingList;
    totalCost = rebuilt.totalCost;
    attempts++;
  }

  if (totalCost > budget) {
    return {
      meals: selectedMeals,
      shoppingList,
      totalCost,
      infeasible: true,
      infeasibleReason: `This planner could not find a meal plan within your $${budget.toFixed(2)} budget using its sample prices. Its current plan estimates $${totalCost.toFixed(
        2
      )}. Pantry quantities, different meals, fewer days, or a larger budget may help. This does not mean feeding your household on that budget is impossible.`,
    };
  }

  return { meals: selectedMeals, shoppingList, totalCost, infeasible: false, infeasibleReason: null };
}

// ---------------------------------------------------------------------------
// Store comparison (scope-worksheet.md: 3 Chicago stores, sample prices,
// sorted two ways -- lowest cost and closest). sampleDistanceMiles is a
// fixed placeholder, not a real geocoded distance; that's the stretch goal
// noted in scope-worksheet.md, not part of this MVP.
// ---------------------------------------------------------------------------
export function computeStoreResults(shoppingList) {
  return STORES.map((store) => {
    const estimate = shoppingList.reduce((sum, line) => {
      if (line.pantryMatch) return sum;
      const item = GROCERY_ITEMS.find((g) => g.id === line.itemId);
      if (!item) return sum;
      return sum + item.price * store.priceMultiplier * line.qty;
    }, 0);

    const itemsToBuy = shoppingList.filter((line) => !line.pantryMatch).length;

    return {
      storeId: store.id,
      name: store.name,
      address: store.address,
      area: store.area,
      detail: store.detail,
      estimate,
      distance: store.sampleDistanceMiles,
      coveredItems: Math.round(itemsToBuy * store.coverage),
      itemsToBuy,
    };
  });
}

/**
 * sortBy matches the data-store-sort values used in main.js: "cost" |
 * "distance". Scope-worksheet.md caps store sorting at these two options --
 * "one-stop" and "balanced" sorting are deliberately out of scope.
 */
export function sortStoreResults(results, sortBy) {
  const sorted = results.slice();
  switch (sortBy) {
    case "distance":
      return sorted.sort((a, b) => a.distance - b.distance || a.estimate - b.estimate);
    case "cost":
    default:
      return sorted.sort((a, b) => a.estimate - b.estimate);
  }
}

// Real prices are only estimated, so a lead this small is noise, not a
// trustworthy "cheapest" claim. Matches scope-worksheet.md's safeguard:
// don't name a cheapest store when the gap between stores is smaller than
// a 12.5% caution threshold. This is a design choice, not a measured error rate.
export const PRICE_ERROR_MARGIN = 0.125;

/**
 * True when the lowest-cost store's estimate isn't clearly ahead of the
 * next cheapest one -- i.e. the gap is within the likely pricing error, so
 * calling it "cheapest" would overstate what the sample data can support.
 */
export function isCheapestTooCloseToCall(results) {
  if (results.length < 2) return false;
  const sortedByCost = results.slice().sort((a, b) => a.estimate - b.estimate);
  const [lowest, nextLowest] = sortedByCost;
  if (lowest.estimate <= 0) return false;
  const gap = (nextLowest.estimate - lowest.estimate) / lowest.estimate;
  return gap < PRICE_ERROR_MARGIN;
}

// ---------------------------------------------------------------------------
