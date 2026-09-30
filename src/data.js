/**
 * data.js — Ethical Apple
 *
 * All the "facts" the app runs on: staple grocery items with editable sample
 * prices and simple meal templates.
 * Nothing here calls an external API — this is the controlled dataset that
 * lets the app work end to end entirely in the browser, with no backend.
 * This is Kendra's own data, imported into the Replit-generated UI
 * (src/main.js) — it is not part of what Replit produced.
 *
 * planLogic.js's generatePlan() builds meal plans from these ingredients.
 * Every meal-template ingredient is listed in GROCERY_ITEMS. Prices remain
 * editable sample estimates; see docs/sample-price-sources.md for sources
 * of the 20 ingredients added on 2026-09-30.
 */

// ---------------------------------------------------------------------------
// Grocery items — id, display name, unit, sample price per unit, tags.
// Prices are illustrative sample figures. Replace them with researched USD
// prices for these exact units before making stronger budget claims.
// ---------------------------------------------------------------------------
export const GROCERY_ITEMS = [
  { id: "rice", name: "Rice", unit: "lb", price: 0.89, tags: ["vegetarian", "pantry"] },
  { id: "beans", name: "Canned Beans", unit: "can", price: 0.99, tags: ["vegetarian", "pantry"] },
  { id: "lentils", name: "Dry Lentils", unit: "bag", price: 1.79, tags: ["vegetarian", "pantry"] },
  { id: "pasta", name: "Pasta", unit: "box", price: 1.29, tags: ["vegetarian", "pantry"] },
  { id: "tomato_sauce", name: "Tomato Sauce", unit: "jar", price: 1.49, tags: ["vegetarian", "pantry"] },
  { id: "eggs", name: "Eggs (dozen)", unit: "dozen", price: 2.79, tags: ["vegetarian", "highProtein"] },
  { id: "peanut_butter", name: "Peanut Butter", unit: "jar", price: 3.29, tags: ["vegetarian", "pantry"] },
  { id: "bread", name: "Bread", unit: "loaf", price: 2.29, tags: ["vegetarian"], daysPerUnit: 5 }, // one loaf reasonably covers up to 5 days regardless of household size or how many meals use it
  { id: "oats", name: "Oats", unit: "bag", price: 2.49, tags: ["vegetarian", "pantry"] },
  { id: "bananas", name: "Bananas", unit: "lb", price: 0.59, tags: ["vegetarian"] },
  { id: "frozen_veg", name: "Frozen Mixed Vegetables", unit: "bag", price: 1.99, tags: ["vegetarian"] },
  { id: "chicken", name: "Chicken Thighs", unit: "lb", price: 3.15, tags: ["highProtein"] }, // nudged toward a live Walmart price check (~$3.16/lb) done 2026-09-29
  { id: "ground_beef", name: "Ground Beef", unit: "lb", price: 4.49, tags: ["highProtein"] },
  { id: "tortillas", name: "Tortillas", unit: "pack", price: 2.49, tags: ["vegetarian"], daysPerUnit: 5 }, // one pack reasonably covers up to 5 days regardless of household size or how many meals use it
  { id: "cheese", name: "Shredded Cheese", unit: "bag", price: 3.49, tags: ["vegetarian"] },
  { id: "onion", name: "Onion", unit: "each", price: 0.49, tags: ["vegetarian", "pantry"] },
  { id: "garlic", name: "Garlic", unit: "head", price: 0.59, tags: ["vegetarian", "pantry"] },
  { id: "cooking_oil", name: "Cooking Oil", unit: "bottle", price: 3.99, tags: ["vegetarian", "pantry"] },
  { id: "salt", name: "Salt", unit: "container", price: 0.99, tags: ["vegetarian", "pantry"] },
  { id: "potatoes", name: "Potatoes", unit: "lb", price: 0.69, tags: ["vegetarian"] },
  { id: "carrots", name: "Carrots", unit: "lb", price: 0.79, tags: ["vegetarian"] },
  { id: "greek_yogurt", name: "Plain Greek Yogurt", unit: "tub", price: 3.28, tags: ["vegetarian", "highProtein"] }, // added 2026-09-29 to give high-protein plans more real headroom
  { id: "tuna", name: "Canned Tuna (4-pack)", unit: "pack", price: 3.84, tags: ["highProtein"] }, // added 2026-09-29, same reason -- fish, so not tagged vegetarian
  // Product-by-product sources and package sizes: docs/sample-price-sources.md.
  { id: "ground_turkey", name: "Ground Turkey", unit: "lb", price: 1.98, tags: ["highProtein"] },
  { id: "black_beans", name: "Black Beans", unit: "can", price: 0.92, tags: ["vegetarian", "pantry"] },
  { id: "shredded_cheese", name: "Shredded Cheese", unit: "bag", price: 2.22, tags: ["vegetarian"] },
  { id: "lettuce", name: "Lettuce", unit: "head", price: 1.97, tags: ["vegetarian"] },
  { id: "salsa", name: "Salsa", unit: "jar", price: 1.97, tags: ["vegetarian", "pantry"] },
  { id: "frozen_pizza", name: "Frozen Pizza", unit: "pizza", price: 4.46, tags: ["under30"] },
  { id: "salad_mix", name: "Salad Mix", unit: "bag", price: 1.97, tags: ["vegetarian", "under30"] },
  { id: "salad_dressing", name: "Salad Dressing", unit: "bottle", price: 2.37, tags: ["vegetarian"] },
  { id: "chicken_breast", name: "Chicken Breast", unit: "lb", price: 2.57, tags: ["highProtein"] },
  { id: "romaine_lettuce", name: "Romaine Lettuce", unit: "head", price: 2.06, tags: ["vegetarian"] },
  { id: "caesar_dressing", name: "Caesar Dressing", unit: "bottle", price: 2.37, tags: [] },
  { id: "parmesan_cheese", name: "Parmesan Cheese", unit: "container", price: 3.00, tags: ["vegetarian"] },
  { id: "croutons", name: "Croutons", unit: "bag", price: 1.42, tags: ["vegetarian"] },
  { id: "burger_buns", name: "Burger Buns", unit: "pack", price: 1.48, tags: ["vegetarian"] },
  { id: "granola", name: "Granola", unit: "bag", price: 2.78, tags: ["vegetarian"] },
  { id: "banana", name: "Banana", unit: "lb", price: 0.50, tags: ["vegetarian"] },
  { id: "pasta_sauce", name: "Pasta Sauce", unit: "jar", price: 1.97, tags: ["vegetarian", "pantry"] },
  { id: "broccoli", name: "Broccoli", unit: "lb", price: 2.12, tags: ["vegetarian"] },
  { id: "mayonnaise", name: "Mayonnaise", unit: "jar", price: 3.57, tags: ["vegetarian"] },
  { id: "corn", name: "Corn", unit: "can", price: 0.82, tags: ["vegetarian", "pantry"] },
];

// ---------------------------------------------------------------------------
// Meal templates — used by the Version 1 rule-based planner. Each meal is
// tagged with a `mealType` (breakfast, lunch, or dinner) so the planner can
// build a full day (one of each) rather than a single meal per day. Each
// meal lists the ingredients it needs (by GROCERY_ITEMS id) and the
// approximate quantity needed to feed ONE person for ONE meal. planLogic.js
// scales this by household size. `pantryFriendly: true` means the meal
// leans on common pantry staples, which helps the planner prefer ingredient
// reuse and substitute toward cheaper meals when a plan runs over budget.
// ---------------------------------------------------------------------------
export const MEAL_TYPES = ["breakfast", "lunch", "dinner"];

// Dietary preference checklist offered on the budget form. Each meal
// template lists which of these it satisfies in its own `dietaryTags`
// array (alongside "vegetarian"), computed from its ingredients -- not
// verified nutrition data, so these stay clearly labeled as preferences,
// not medical or nutritional claims.
export const DIETARY_PREFERENCES = [
  { key: "highProtein", label: "High Protein" },
  { key: "highFiber", label: "High Fiber" },
  { key: "budgetFriendly", label: "Budget-Friendly" },
  { key: "under30", label: "Under 30 Minutes" },
  { key: "vegetarian", label: "Vegetarian" },
];

// ---------------------------------------------------------------------------
// Stores — the 3 Chicago-area stores locked in scope-worksheet.md, used for
// the sample store-price comparison. priceMultiplier scales GROCERY_ITEMS'
// sample prices for that store type (a discount grocer runs cheaper, a
// full-size supercenter runs closer to average); coverage is how much of a
// typical list that store type realistically carries in one trip;
// sampleDistanceMiles is a fixed placeholder distance from a Logan Square
// reference point, not a real geocoded distance (see scope-worksheet.md's
// stretch goal for that future step). planLogic.js's computeStoreResults()
// turns these into a priced, distance-labeled basket estimate per store.
// ---------------------------------------------------------------------------
export const STORES = [
  {
    id: "aldi",
    name: "ALDI",
    address: "1753 N Milwaukee Ave, Chicago, IL 60647",
    area: "Wicker Park / Bucktown",
    detail: "A discount grocer with more store-brand substitutions, usually the cheapest basket.",
    priceMultiplier: 0.85,
    coverage: 0.85,
    sampleDistanceMiles: 1.0,
  },
  {
    id: "walmart_supercenter",
    name: "Walmart Supercenter",
    address: "4626 W Diversey Ave, Chicago, IL 60639",
    area: "Hermosa",
    detail: "A full-size supercenter with the broadest one-trip coverage, at close-to-average prices.",
    priceMultiplier: 0.97,
    coverage: 1,
    sampleDistanceMiles: 2.6,
  },
  {
    id: "rico_fresh_market",
    name: "Rico Fresh Market",
    address: "3552 W Armitage Ave, Chicago, IL 60647",
    area: "Logan Square",
    detail: "A local grocer with strong fresh produce, less packaged-goods variety, and the shortest trip for this area.",
    priceMultiplier: 0.9,
    coverage: 0.75,
    sampleDistanceMiles: 0.4,
  },
];

export const MEAL_TEMPLATES = [
  // --- Breakfasts ---------------------------------------------------------
  {
    id: "eggs_and_toast",
    name: "Eggs and Toast",
    mealType: "breakfast",
    note: "an easy, protein-forward meal to start the day",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highProtein", "budgetFriendly", "under30"],
    prepMinutes: 15,
    pantryFriendly: true,
    ingredients: [
      { itemId: "eggs", qtyPerPerson: 0.2 },
      { itemId: "bread", qtyPerPerson: 0.25 },
      { itemId: "cooking_oil", qtyPerPerson: 0.03 },
    ],
  },
  {
    id: "oatmeal_and_banana",
    name: "Oatmeal with Banana",
    mealType: "breakfast",
    note: "a warm, inexpensive way to start the day",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highFiber", "budgetFriendly", "under30"],
    prepMinutes: 8,
    pantryFriendly: true,
    ingredients: [
      { itemId: "oats", qtyPerPerson: 0.15 },
      { itemId: "bananas", qtyPerPerson: 1 },
    ],
  },
  {
    id: "peanut_butter_toast",
    name: "Peanut Butter Toast",
    mealType: "breakfast",
    note: "no cooking required and ready in minutes",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highProtein", "budgetFriendly", "under30"],
    prepMinutes: 5,
    pantryFriendly: true,
    ingredients: [
      { itemId: "bread", qtyPerPerson: 0.25 },
      { itemId: "peanut_butter", qtyPerPerson: 0.15 },
    ],
  },
  {
    id: "cheesy_scrambled_eggs",
    name: "Cheesy Scrambled Eggs",
    mealType: "breakfast",
    note: "a heartier egg breakfast with melted cheese",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highProtein", "budgetFriendly", "under30"],
    prepMinutes: 12,
    pantryFriendly: false,
    ingredients: [
      { itemId: "eggs", qtyPerPerson: 0.25 },
      { itemId: "cheese", qtyPerPerson: 0.1 },
      { itemId: "cooking_oil", qtyPerPerson: 0.03 },
    ],
  },
  {
    id: "breakfast_potato_hash",
    name: "Breakfast Potato Hash",
    mealType: "breakfast",
    note: "crisped potatoes and onion to start the day",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highFiber", "budgetFriendly", "under30"],
    prepMinutes: 25,
    pantryFriendly: false,
    ingredients: [
      { itemId: "potatoes", qtyPerPerson: 0.4 },
      { itemId: "onion", qtyPerPerson: 0.15 },
      { itemId: "cooking_oil", qtyPerPerson: 0.05 },
    ],
  },
  {
    id: "peanut_butter_banana_toast",
    name: "Peanut Butter Banana Toast",
    mealType: "breakfast",
    note: "a filling, naturally sweet twist on toast",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highProtein", "budgetFriendly", "under30"],
    prepMinutes: 5,
    pantryFriendly: true,
    ingredients: [
      { itemId: "bread", qtyPerPerson: 0.25 },
      { itemId: "peanut_butter", qtyPerPerson: 0.12 },
      { itemId: "bananas", qtyPerPerson: 0.5 },
    ],
  },
  {
    id: "breakfast_egg_burrito",
    name: "Breakfast Egg and Bean Burrito",
    mealType: "breakfast",
    note: "a wrap-and-go breakfast with protein to spare",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highProtein", "highFiber", "under30"],
    prepMinutes: 15,
    pantryFriendly: false,
    ingredients: [
      { itemId: "eggs", qtyPerPerson: 0.2 },
      { itemId: "beans", qtyPerPerson: 0.3 },
      { itemId: "tortillas", qtyPerPerson: 1 },
      { itemId: "cheese", qtyPerPerson: 0.08 },
    ],
  },
 
  {
    id: "peanut_butter_oat_bowl",
    name: "Peanut Butter Oat Bowl",
    mealType: "breakfast",
    note: "stick-to-your-ribs oats with a spoonful of peanut butter",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highProtein", "highFiber", "budgetFriendly", "under30"],
    prepMinutes: 8,
    pantryFriendly: true,
    ingredients: [
      { itemId: "oats", qtyPerPerson: 0.15 },
      { itemId: "peanut_butter", qtyPerPerson: 0.1 },
      { itemId: "bananas", qtyPerPerson: 0.5 },
    ],
  },
 

  // --- Lunches -------------------------------------------------------------
  {
    id: "peanut_butter_sandwich",
    name: "Peanut Butter Sandwich",
    mealType: "lunch",
    note: "no cooking required and keeps well for a packed lunch",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highProtein", "budgetFriendly", "under30"],
    prepMinutes: 5,
    pantryFriendly: true,
    ingredients: [
      { itemId: "bread", qtyPerPerson: 0.25 },
      { itemId: "peanut_butter", qtyPerPerson: 0.15 },
    ],
  },
   {
    id: "garlic_home_fries",
    name: "Garlic Herb Home Fries",
    mealType: "breakfast",
    note: "a simple skillet side that also works as a full plate",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highFiber", "budgetFriendly", "under30"],
    prepMinutes: 20,
    pantryFriendly: true,
    ingredients: [
      { itemId: "potatoes", qtyPerPerson: 0.35 },
      { itemId: "garlic", qtyPerPerson: 0.15 },
      { itemId: "cooking_oil", qtyPerPerson: 0.05 },
    ],
  },
  {
    id: "bean_cheese_quesadilla",
    name: "Bean and Cheese Quesadilla",
    mealType: "lunch",
    note: "a warm, filling midday option built around pantry beans",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highProtein", "highFiber", "under30"],
    prepMinutes: 15,
    pantryFriendly: true,
    ingredients: [
      { itemId: "tortillas", qtyPerPerson: 2 },
      { itemId: "beans", qtyPerPerson: 0.4 },
      { itemId: "cheese", qtyPerPerson: 0.15 },
    ],
  },
  {
    id: "grilled_cheese",
    name: "Grilled Cheese Sandwich",
    mealType: "lunch",
    note: "a classic, budget-friendly lunch staple",
    vegetarian: true,
    dietaryTags: ["vegetarian", "budgetFriendly", "under30"],
    prepMinutes: 10,
    pantryFriendly: true,
    ingredients: [
      { itemId: "bread", qtyPerPerson: 0.3 },
      { itemId: "cheese", qtyPerPerson: 0.15 },
      { itemId: "cooking_oil", qtyPerPerson: 0.03 },
    ],
  },
  {
    id: "rice_bean_lunch_bowl",
    name: "Rice and Bean Lunch Bowl",
    mealType: "lunch",
    note: "a lighter, midday take on a pantry favorite",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highProtein", "highFiber", "budgetFriendly", "under30"],
    prepMinutes: 20,
    pantryFriendly: true,
    ingredients: [
      { itemId: "rice", qtyPerPerson: 0.25 },
      { itemId: "beans", qtyPerPerson: 0.5 },
      { itemId: "onion", qtyPerPerson: 0.1 },
    ],
  },
  {
    id: "veggie_cheese_wrap",
    name: "Veggie and Cheese Wrap",
    mealType: "lunch",
    note: "an easy wrap built around frozen vegetables",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highFiber", "under30"],
    prepMinutes: 10,
    pantryFriendly: false,
    ingredients: [
      { itemId: "tortillas", qtyPerPerson: 1 },
      { itemId: "frozen_veg", qtyPerPerson: 0.3 },
      { itemId: "cheese", qtyPerPerson: 0.12 },
    ],
  },
  {
    id: "carrot_bean_salad",
    name: "Carrot and Bean Salad",
    mealType: "lunch",
    note: "a simple no-cook salad that travels well",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highProtein", "highFiber", "budgetFriendly", "under30"],
    prepMinutes: 10,
    pantryFriendly: true,
    ingredients: [
      { itemId: "carrots", qtyPerPerson: 0.3 },
      { itemId: "beans", qtyPerPerson: 0.4 },
      { itemId: "onion", qtyPerPerson: 0.1 },
      { itemId: "cooking_oil", qtyPerPerson: 0.04 },
    ],
  },
   {
    id: "cheese_toast",
    name: "Grilled Cheese Sandwiches",
    mealType: "lunch",
    note: "a quick melt when lunches are short on time",
    vegetarian: true,
    dietaryTags: ["vegetarian", "budgetFriendly", "under30"],
    prepMinutes: 8,
    pantryFriendly: true,
    ingredients: [
      { itemId: "bread", qtyPerPerson: 0.25 },
      { itemId: "cheese", qtyPerPerson: 0.12 },
      { itemId: "cooking_oil", qtyPerPerson: 0.02 },
    ],
  },
  {
    id: "pasta_salad",
    name: "Pasta Salad",
    mealType: "lunch",
    note: "a cold pasta dish that's easy to make ahead",
    vegetarian: true,
    dietaryTags: ["vegetarian", "budgetFriendly", "under30"],
    prepMinutes: 20,
    pantryFriendly: true,
    ingredients: [
      { itemId: "pasta", qtyPerPerson: 0.35 },
      { itemId: "tomato_sauce", qtyPerPerson: 0.2 },
      { itemId: "carrots", qtyPerPerson: 0.15 },
      { itemId: "onion", qtyPerPerson: 0.1 },
    ],
  },
  {
    id: "potato_salad",
    name: "Potato Salad",
    mealType: "lunch",
    note: "a hearty, make-ahead lunch side or main",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highFiber", "budgetFriendly"],
    prepMinutes: 35,
    pantryFriendly: false,
    ingredients: [
      { itemId: "potatoes", qtyPerPerson: 0.45 },
      { itemId: "onion", qtyPerPerson: 0.1 },
      { itemId: "cooking_oil", qtyPerPerson: 0.05 },
    ],
  },
  {
    id: "chicken_wrap",
    name: "Chicken Wrap",
    mealType: "lunch",
    note: "a protein-forward wrap using leftover-style chicken",
    vegetarian: false,
    dietaryTags: ["highProtein", "under30"],
    prepMinutes: 15,
    pantryFriendly: false,
    ingredients: [
      { itemId: "tortillas", qtyPerPerson: 1 },
      { itemId: "chicken", qtyPerPerson: 0.25 },
      { itemId: "cheese", qtyPerPerson: 0.1 },
    ],
  },
  {
    id: "tomato_rice_soup",
    name: "Tomato Rice Soup",
    mealType: "lunch",
    note: "a warm, simple soup built from staples",
    vegetarian: true,
    dietaryTags: ["vegetarian", "budgetFriendly", "under30"],
    prepMinutes: 25,
    pantryFriendly: true,
    ingredients: [
      { itemId: "rice", qtyPerPerson: 0.2 },
      { itemId: "tomato_sauce", qtyPerPerson: 0.35 },
      { itemId: "onion", qtyPerPerson: 0.1 },
      { itemId: "garlic", qtyPerPerson: 0.1 },
    ],
  },

  // --- Dinners ---------------------------------------------------------------

  {
    id: "pasta_with_sauce",
    name: "Spaghetti with Sauce",
    mealType: "dinner",
    note: "a quick, budget-friendly dinner with just a few ingredients",
    vegetarian: true,
    dietaryTags: ["vegetarian", "budgetFriendly", "under30"],
    prepMinutes: 20,
    pantryFriendly: true,
    ingredients: [
      { itemId: "pasta", qtyPerPerson: 0.4 },
      { itemId: "tomato_sauce", qtyPerPerson: 0.4 },
      { itemId: "garlic", qtyPerPerson: 0.2 },
    ],
  },
  {
    id: "chicken_rice_bowl",
    name: "Chicken and Rice Bowl",
    mealType: "dinner",
    note: "a heartier dinner built around rice you likely already have",
    vegetarian: false,
    dietaryTags: ["highProtein", "highFiber", "under30"],
    prepMinutes: 25,
    pantryFriendly: false,
    ingredients: [
      { itemId: "chicken", qtyPerPerson: 0.4 },
      { itemId: "rice", qtyPerPerson: 0.35 },
      { itemId: "frozen_veg", qtyPerPerson: 0.3 },
    ],
  },
  {
    id: "beef_taco",
    name: "Ground Beef Tacos",
    mealType: "dinner",
    note: "a family favorite that's easy to portion for any group size",
    vegetarian: false,
    dietaryTags: ["highProtein", "under30"],
    prepMinutes: 20,
    pantryFriendly: false,
    ingredients: [
      { itemId: "ground_beef", qtyPerPerson: 0.35 },
      { itemId: "tortillas", qtyPerPerson: 3 },
      { itemId: "cheese", qtyPerPerson: 0.15 },
      { itemId: "onion", qtyPerPerson: 0.15 },
    ],
  },
  {
    id: "veggie_taco",
    name: "Bean and Cheese Tacos",
    mealType: "dinner",
    note: "the same easy taco format, built around pantry beans instead of meat",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highProtein", "highFiber", "under30"],
    prepMinutes: 15,
    pantryFriendly: true,
    ingredients: [
      { itemId: "beans", qtyPerPerson: 0.6 },
      { itemId: "tortillas", qtyPerPerson: 3 },
      { itemId: "cheese", qtyPerPerson: 0.15 },
    ],
  },
  {
    id: "potato_hash",
    name: "Potato and Veggie Hash",
    mealType: "dinner",
    note: "a filling skillet meal that uses a few humble vegetables well",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highFiber", "budgetFriendly", "under30"],
    prepMinutes: 25,
    pantryFriendly: false,
    ingredients: [
      { itemId: "potatoes", qtyPerPerson: 0.5 },
      { itemId: "carrots", qtyPerPerson: 0.25 },
      { itemId: "onion", qtyPerPerson: 0.2 },
      { itemId: "cooking_oil", qtyPerPerson: 0.05 },
    ],
  },
  {
    id: "chicken_veggie_skillet",
    name: "Chicken and Vegetable Skillet",
    mealType: "dinner",
    note: "a one-pan dinner built around chicken and frozen vegetables",
    vegetarian: false,
    dietaryTags: ["highProtein", "highFiber", "under30"],
    prepMinutes: 25,
    pantryFriendly: false,
    ingredients: [
      { itemId: "chicken", qtyPerPerson: 0.4 },
      { itemId: "frozen_veg", qtyPerPerson: 0.35 },
      { itemId: "onion", qtyPerPerson: 0.15 },
      { itemId: "garlic", qtyPerPerson: 0.1 },
      { itemId: "cooking_oil", qtyPerPerson: 0.04 },
    ],
  },
  {
    id: "beef_potato_skillet",
    name: "Beef and Potato Skillet",
    mealType: "dinner",
    note: "a hearty stovetop dinner that stretches ground beef further",
    vegetarian: false,
    dietaryTags: ["highProtein", "highFiber"],
    prepMinutes: 35,
    pantryFriendly: false,
    ingredients: [
      { itemId: "ground_beef", qtyPerPerson: 0.3 },
      { itemId: "potatoes", qtyPerPerson: 0.4 },
      { itemId: "onion", qtyPerPerson: 0.15 },
      { itemId: "garlic", qtyPerPerson: 0.1 },
    ],
  },
  {
    id: "bean_rice_burrito_bowl",
    name: "Bean and Rice Burrito Bowl",
    mealType: "dinner",
    note: "a filling bowl that leans on rice and beans you likely have",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highProtein", "highFiber", "budgetFriendly", "under30"],
    prepMinutes: 22,
    pantryFriendly: true,
    ingredients: [
      { itemId: "rice", qtyPerPerson: 0.35 },
      { itemId: "beans", qtyPerPerson: 0.5 },
      { itemId: "cheese", qtyPerPerson: 0.1 },
      { itemId: "onion", qtyPerPerson: 0.15 },
    ],
  },
  {
    id: "garlic_veggie_pasta",
    name: "Garlic Pasta with Vegetables",
    mealType: "dinner",
    note: "a simple pasta dinner rounded out with frozen vegetables",
    vegetarian: true,
    dietaryTags: ["vegetarian", "highFiber", "budgetFriendly", "under30"],
    prepMinutes: 18,
    pantryFriendly: true,
    ingredients: [
      { itemId: "pasta", qtyPerPerson: 0.4 },
      { itemId: "frozen_veg", qtyPerPerson: 0.3 },
      { itemId: "garlic", qtyPerPerson: 0.15 },
      { itemId: "cooking_oil", qtyPerPerson: 0.04 },
    ],
  },
  {
  id: "ground_turkey_tacos",
  name: "Ground Turkey Tacos",
  mealType: "dinner",
  note: "seasoned ground turkey tacos with beans, cheese, and fresh toppings",
  vegetarian: false,
  dietaryTags: ["highProtein", "budgetFriendly", "under30"],
  prepMinutes: 25,
  pantryFriendly: true,
  ingredients: [
    { itemId: "ground_turkey", qtyPerPerson: 0.3 },
    { itemId: "tortillas", qtyPerPerson: 0.25 },
    { itemId: "black_beans", qtyPerPerson: 0.2 },
    { itemId: "shredded_cheese", qtyPerPerson: 0.1 },
    { itemId: "lettuce", qtyPerPerson: 0.1 },
    { itemId: "salsa", qtyPerPerson: 0.08 },
  ],
},

{
  id: "frozen_pizza_and_salad",
  name: "Frozen Pizza and Side Salad",
  mealType: "dinner",
  note: "an easy pizza night balanced with a simple fresh salad",
  vegetarian: true,
  dietaryTags: ["vegetarian", "budgetFriendly", "under30"],
  prepMinutes: 20,
  pantryFriendly: false,
  ingredients: [
    { itemId: "frozen_pizza", qtyPerPerson: 0.5 },
    { itemId: "salad_mix", qtyPerPerson: 0.2 },
    { itemId: "salad_dressing", qtyPerPerson: 0.05 },
  ],
},

{
  id: "chicken_caesar_salad",
  name: "Chicken Caesar Salad",
  mealType: "lunch",
  note: "a fresh, protein-packed salad with chicken and crunchy greens",
  vegetarian: false,
  dietaryTags: ["highProtein", "under30"],
  prepMinutes: 20,
  pantryFriendly: false,
  ingredients: [
    { itemId: "chicken_breast", qtyPerPerson: 0.3 },
    { itemId: "romaine_lettuce", qtyPerPerson: 0.25 },
    { itemId: "caesar_dressing", qtyPerPerson: 0.06 },
    { itemId: "parmesan_cheese", qtyPerPerson: 0.05 },
    { itemId: "croutons", qtyPerPerson: 0.08 },
  ],
},

{
  id: "turkey_burger_and_potatoes",
  name: "Turkey Burgers and Roasted Potatoes",
  mealType: "dinner",
  note: "a filling turkey burger served with crispy seasoned potatoes",
  vegetarian: false,
  dietaryTags: ["highProtein", "budgetFriendly"],
  prepMinutes: 30,
  pantryFriendly: true,
  ingredients: [
    { itemId: "ground_turkey", qtyPerPerson: 0.3 },
    { itemId: "burger_buns", qtyPerPerson: 0.2 },
    { itemId: "potatoes", qtyPerPerson: 0.35 },
    { itemId: "lettuce", qtyPerPerson: 0.08 },
    { itemId: "cheese", qtyPerPerson: 0.08 },
    { itemId: "cooking_oil", qtyPerPerson: 0.03 },
  ],
},

{
  id: "chicken_quesadillas",
  name: "Chicken Quesadillas",
  mealType: "dinner",
  note: "crispy cheesy quesadillas filled with seasoned chicken and beans",
  vegetarian: false,
  dietaryTags: ["highProtein", "budgetFriendly", "under30"],
  prepMinutes: 20,
  pantryFriendly: true,
  ingredients: [
    { itemId: "chicken_breast", qtyPerPerson: 0.25 },
    { itemId: "tortillas", qtyPerPerson: 0.3 },
    { itemId: "shredded_cheese", qtyPerPerson: 0.12 },
    { itemId: "black_beans", qtyPerPerson: 0.15 },
    { itemId: "salsa", qtyPerPerson: 0.08 },
  ],
},

{
  id: "greek_yogurt_parfait",
  name: "Greek Yogurt Parfait",
  mealType: "breakfast",
  note: "creamy Greek yogurt layered with fruit, granola, and peanut butter",
  vegetarian: true,
  dietaryTags: ["vegetarian", "highProtein", "under30"],
  prepMinutes: 5,
  pantryFriendly: false,
  ingredients: [
    { itemId: "greek_yogurt", qtyPerPerson: 0.3 },
    { itemId: "granola", qtyPerPerson: 0.12 },
    { itemId: "banana", qtyPerPerson: 0.2 },
    { itemId: "peanut_butter", qtyPerPerson: 0.05 },
  ],
},

{
  id: "turkey_pasta",
  name: "Turkey and Tomato Pasta",
  mealType: "dinner",
  note: "a hearty pasta tossed with ground turkey and tomato sauce",
  vegetarian: false,
  dietaryTags: ["highProtein", "budgetFriendly", "under30"],
  prepMinutes: 25,
  pantryFriendly: true,
  ingredients: [
    { itemId: "ground_turkey", qtyPerPerson: 0.25 },
    { itemId: "pasta", qtyPerPerson: 0.25 },
    { itemId: "pasta_sauce", qtyPerPerson: 0.2 },
    { itemId: "parmesan_cheese", qtyPerPerson: 0.05 },
    { itemId: "cooking_oil", qtyPerPerson: 0.02 },
  ],
},

{
  id: "loaded_baked_potato",
  name: "Loaded Chicken Baked Potato",
  mealType: "dinner",
  note: "a baked potato loaded with chicken, broccoli, and melted cheese",
  vegetarian: false,
  dietaryTags: ["highProtein", "budgetFriendly"],
  prepMinutes: 30,
  pantryFriendly: true,
  ingredients: [
    { itemId: "potatoes", qtyPerPerson: 0.4 },
    { itemId: "chicken_breast", qtyPerPerson: 0.25 },
    { itemId: "broccoli", qtyPerPerson: 0.2 },
    { itemId: "shredded_cheese", qtyPerPerson: 0.1 },
    { itemId: "greek_yogurt", qtyPerPerson: 0.06 },
  ],
},

{
  id: "tuna_melt",
  name: "Tuna Melt",
  mealType: "lunch",
  note: "a warm cheesy tuna sandwich that's quick, filling, and protein-rich",
  vegetarian: false,
  dietaryTags: ["highProtein", "budgetFriendly", "under30"],
  prepMinutes: 15,
  pantryFriendly: true,
  ingredients: [
    { itemId: "tuna", qtyPerPerson: 0.2 },
    { itemId: "bread", qtyPerPerson: 0.25 },
    { itemId: "cheese", qtyPerPerson: 0.08 },
    { itemId: "mayonnaise", qtyPerPerson: 0.04 },
  ],
},

{
  id: "black_bean_burrito_bowl",
  name: "Black Bean Burrito Bowl",
  mealType: "lunch",
  note: "a colorful rice bowl with seasoned beans, vegetables, salsa, and cheese",
  vegetarian: true,
  dietaryTags: ["vegetarian", "budgetFriendly", "highProtein", "under30"],
  prepMinutes: 20,
  pantryFriendly: true,
  ingredients: [
    { itemId: "black_beans", qtyPerPerson: 0.3 },
    { itemId: "rice", qtyPerPerson: 0.25 },
    { itemId: "corn", qtyPerPerson: 0.12 },
    { itemId: "shredded_cheese", qtyPerPerson: 0.08 },
    { itemId: "salsa", qtyPerPerson: 0.08 },
    { itemId: "lettuce", qtyPerPerson: 0.08 },
  ],
},

  // --- Added for the Dietary Preferences checklist -------------------------
  {
    id: "bean_veggie_breakfast_bowl",
    name: "Bean and Veggie Breakfast Bowl",
    mealType: "breakfast",
    note: "a savory, high-fiber way to start the day without eggs",
    vegetarian: true,
    pantryFriendly: true,
    dietaryTags: ["vegetarian", "highProtein", "highFiber", "budgetFriendly", "under30"],
    prepMinutes: 15,
    ingredients: [
      { itemId: "beans", qtyPerPerson: 0.4 },
      { itemId: "frozen_veg", qtyPerPerson: 0.3 },
      { itemId: "onion", qtyPerPerson: 0.1 },
    ],
  },
  {
    id: "lentil_rice_bowl",
    name: "Lentil and Rice Bowl",
    mealType: "lunch",
    note: "a filling, plant-based lunch built on a classic pantry pairing",
    vegetarian: true,
    pantryFriendly: true,
    dietaryTags: ["vegetarian", "highProtein", "highFiber", "budgetFriendly", "under30"],
    prepMinutes: 25,
    ingredients: [
      { itemId: "lentils", qtyPerPerson: 0.3 },
      { itemId: "rice", qtyPerPerson: 0.25 },
      { itemId: "onion", qtyPerPerson: 0.1 },
    ],
  },
  {
    id: "lentil_soup",
    name: "Lentil Soup",
    mealType: "dinner",
    note: "a warm, stick-to-your-ribs soup that stretches a bag of lentils far",
    vegetarian: true,
    pantryFriendly: true,
    dietaryTags: ["vegetarian", "highProtein", "highFiber", "budgetFriendly"],
    prepMinutes: 35,
    ingredients: [
      { itemId: "lentils", qtyPerPerson: 0.4 },
      { itemId: "carrots", qtyPerPerson: 0.2 },
      { itemId: "onion", qtyPerPerson: 0.15 },
      { itemId: "garlic", qtyPerPerson: 0.1 },
    ],
  },

  // --- Additional sample ingredients for varied meal plans ----
  // --- weren't being used up; these give high-protein plans real headroom -
  {
    id: "greek_yogurt_protein_bowl",
    name: "Greek Yogurt Protein Bowl",
    mealType: "breakfast",
    note: "a no-cook, protein-dense way to start the day",
    vegetarian: true,
    pantryFriendly: false,
    dietaryTags: ["vegetarian", "highProtein", "under30"],
    prepMinutes: 5,
    ingredients: [
      { itemId: "greek_yogurt", qtyPerPerson: 0.3 },
      { itemId: "peanut_butter", qtyPerPerson: 0.08 },
      { itemId: "bananas", qtyPerPerson: 0.5 },
    ],
  },
  {
    id: "tuna_rice_bowl",
    name: "Tuna and Rice Bowl",
    mealType: "lunch",
    note: "a filling, protein-forward lunch built around canned tuna",
    vegetarian: false,
    pantryFriendly: false,
    dietaryTags: ["highProtein", "highFiber", "under30"],
    prepMinutes: 20,
    ingredients: [
      { itemId: "tuna", qtyPerPerson: 0.5 },
      { itemId: "rice", qtyPerPerson: 0.25 },
      { itemId: "frozen_veg", qtyPerPerson: 0.2 },
    ],
  },
  {
    id: "grilled_chicken_broccoli_bowl",
    name: "Grilled Chicken and Broccoli Bowl",
    mealType: "dinner",
    note: "a heartier, protein-forward dinner with a bigger portion of chicken",
    vegetarian: false,
    pantryFriendly: false,
    dietaryTags: ["highProtein", "highFiber", "under30"],
    prepMinutes: 28,
    ingredients: [
      { itemId: "chicken", qtyPerPerson: 0.4 },
      { itemId: "frozen_veg", qtyPerPerson: 0.35 },
      { itemId: "rice", qtyPerPerson: 0.3 },
    ],
  },
];
// ---------------------------------------------------------------------------
