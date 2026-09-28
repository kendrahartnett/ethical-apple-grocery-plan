/**
 * planLogic.js — Ethical Apple (Version 1)
 *
 * All of the app's decision-making: budget math, meal selection, shopping
 * list construction, budget-fit substitution, and store comparison/sorting.
 * This is Kendra's own logic (originally written and tested as app.js
 * before the Replit frontend arrived) — main.js only renders whatever
 * this module decides. No external API calls happen here in Version 1.
 */

import { GROCERY_ITEMS, MEAL_TEMPLATES, MEAL_TYPES, STORES } from "./data.js";

// Roughly $1.30 (breakfast) + $1.30 (lunch) + $1.90 (dinner) per person per
// day is the floor for even the cheapest staples across three meals a day.
const MIN_PER_PERSON_PER_DAY = 4.5;

/**
 * Parse the "already on hand" free-text field into a Set of GROCERY_ITEMS
 * ids, matched loosely by name. Anything typed that doesn't match a known
 * item is ignored for now (Version 1 keeps this simple and controlled).
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
    return sum + item.price * ing.qtyPerPerson * householdSize;
  }, 0);
}

/**
 * Aggregate ingredient quantities across all selected meals and price out
 * what still needs to be bought. Ingredients already on hand are still
 * listed (so the user can see the full picture) but marked pantryMatch
 * with $0 estimated cost.
 *
 * A few staples (bread, tortillas) are bought in bulk units that
 * realistically cover several days on their own, no matter how many meals
 * use them or how large the household is (one loaf of bread, one pack of
 * tortillas). Those items carry a `daysPerUnit` on GROCERY_ITEMS and are
 * quantified off the plan length instead of summed per-meal usage.
 */
function buildShoppingList(meals, householdSize, onHandIds, days) {
  const quantities = {}; // itemId -> total qty needed across the whole plan

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

    const pantryMatch = onHandIds.has(itemId);
    const roundedQty = item.daysPerUnit
      ? Math.max(1, Math.ceil(days / item.daysPerUnit)) // bulk staple: covers several days per unit
      : Math.max(1, Math.ceil(qty)); // buy in whole units
    const estimatedCost = pantryMatch ? 0 : roundedQty * item.price;
    if (!pantryMatch) totalCost += estimatedCost;

    shoppingList.push({
      itemId,
      name: item.name,
      unit: item.unit,
      qty: roundedQty,
      pantryMatch,
      quantity: pantryMatch ? "on hand" : `${roundedQty} ${item.unit}${roundedQty === 1 ? "" : "s"}`,
      estimatedCost,
    });
  });

  return { shoppingList, totalCost };
}

/**
 * Core rule-based planner.
 * budget, householdSize, days: numbers
 * onHandIds: Set of GROCERY_ITEMS ids the user already has
 * vegetarianOnly: boolean
 *
 * Returns { meals, shoppingList, totalCost, infeasible, infeasibleReason }
 */
export function generatePlan({ budget, householdSize, days, onHandIds, vegetarianOnly }) {
  const budgetPerDay = budget / days;
  const budgetPerPersonPerDay = budgetPerDay / householdSize;

  if (budgetPerPersonPerDay < MIN_PER_PERSON_PER_DAY) {
    return {
      meals: [],
      shoppingList: [],
      totalCost: 0,
      infeasible: true,
      infeasibleReason: `$${budget.toFixed(2)} for ${householdSize} ${
        householdSize === 1 ? "person" : "people"
      } over ${days} day${days === 1 ? "" : "s"} works out to about $${budgetPerPersonPerDay.toFixed(
        2
      )} per person per day, which isn't realistically enough even for the cheapest staples. Try a larger budget, fewer days, or a smaller household size.`,
    };
  }

  let candidates = MEAL_TEMPLATES.filter((m) => !vegetarianOnly || m.vegetarian);

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
      infeasibleReason: "No meals in the current dataset fit the dietary preference selected. Try a different dietary option.",
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

  let { shoppingList, totalCost } = buildShoppingList(selectedMeals, householdSize, onHandIds, days);

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

  while (totalCost > budget && attempts < selectedMeals.length) {
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

    const rebuilt = buildShoppingList(selectedMeals, householdSize, onHandIds, days);
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
      infeasibleReason: `Even after substituting cheaper meals, the estimated total ($${totalCost.toFixed(
        2
      )}) is above your $${budget.toFixed(2)} budget. Consider a larger budget or fewer days.`,
    };
  }

  return { meals: selectedMeals, shoppingList, totalCost, infeasible: false, infeasibleReason: null };
}

// ---------------------------------------------------------------------------
// Store comparison (Version 1 — sample distance; Version 2 will replace
// sampleDistanceMiles with a real Haversine calculation from geocoded
// coordinates).
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
      detail: store.detail,
      estimate,
      // Placeholder in V1. V2 replaces this with real Haversine distance.
      distance: store.sampleDistanceMiles,
      coveredItems: Math.round(itemsToBuy * store.coverage),
    };
  });
}

/**
 * sortBy matches the data-store-sort values already used in the Replit
 * markup: "cost" | "distance" | "one-stop" | "balanced".
 */
export function sortStoreResults(results, sortBy) {
  const sorted = results.slice();

  switch (sortBy) {
    case "distance":
      return sorted.sort((a, b) => a.distance - b.distance || a.estimate - b.estimate);
    case "one-stop":
      return sorted.sort((a, b) => b.coveredItems - a.coveredItems || a.estimate - b.estimate);
    case "balanced": {
      const costs = sorted.map((s) => s.estimate);
      const distances = sorted.map((s) => s.distance);
      const minCost = Math.min(...costs);
      const maxCost = Math.max(...costs);
      const minDistance = Math.min(...distances);
      const maxDistance = Math.max(...distances);
      const normalized = (value, min, max) => (max === min ? 0 : (value - min) / (max - min));
      return sorted.sort((a, b) => {
        const scoreA = normalized(a.estimate, minCost, maxCost) * 0.55 + normalized(a.distance, minDistance, maxDistance) * 0.45;
        const scoreB = normalized(b.estimate, minCost, maxCost) * 0.55 + normalized(b.distance, minDistance, maxDistance) * 0.45;
        return scoreA - scoreB;
      });
    }
    case "cost":
    default:
      return sorted.sort((a, b) => a.estimate - b.estimate);
  }
}
