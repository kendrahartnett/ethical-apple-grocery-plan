/**
 * data.js — Ethical Apple (Version 1)
 *
 * All the "facts" the app runs on: staple grocery items with sample prices,
 * a small set of Chicago-area sample stores, and simple meal templates.
 * Nothing here calls an external API — this is the controlled dataset that
 * lets Version 1 work end to end on its own. This is Kendra's own data,
 * imported into the Replit-generated UI (src/main.js) — it is not part
 * of what Replit produced.
 *
 * V2 will add real geocoded coordinates + a Haversine distance calculation
 * to replace the `sampleDistanceMiles` placeholder below.
 * V3 will add an LLM meal-idea step that is only ever allowed to choose from
 * the GROCERY_ITEMS ingredient names defined here.
 */

// ---------------------------------------------------------------------------
// Grocery items — id, display name, unit, sample price per unit, tags.
// Prices are illustrative/sample figures, not live store prices.
// ---------------------------------------------------------------------------
export const GROCERY_ITEMS = [
  { id: "rice", name: "Rice", unit: "lb", price: 0.89, tags: ["vegetarian", "pantry"] },
  { id: "beans", name: "Canned Beans", unit: "can", price: 0.99, tags: ["vegetarian", "pantry"] },
  { id: "pasta", name: "Pasta", unit: "box", price: 1.29, tags: ["vegetarian", "pantry"] },
  { id: "tomato_sauce", name: "Tomato Sauce", unit: "jar", price: 1.49, tags: ["vegetarian", "pantry"] },
  { id: "eggs", name: "Eggs (dozen)", unit: "dozen", price: 2.79, tags: ["vegetarian"] },
  { id: "peanut_butter", name: "Peanut Butter", unit: "jar", price: 3.29, tags: ["vegetarian", "pantry"] },
  { id: "bread", name: "Bread", unit: "loaf", price: 2.29, tags: ["vegetarian"], daysPerUnit: 5 }, // one loaf reasonably covers up to 5 days regardless of household size or how many meals use it
  { id: "oats", name: "Oats", unit: "bag", price: 2.49, tags: ["vegetarian", "pantry"] },
  { id: "bananas", name: "Bananas", unit: "lb", price: 0.59, tags: ["vegetarian"] },
  { id: "frozen_veg", name: "Frozen Mixed Vegetables", unit: "bag", price: 1.99, tags: ["vegetarian"] },
  { id: "chicken", name: "Chicken Thighs", unit: "lb", price: 2.49, tags: [] },
  { id: "ground_beef", name: "Ground Beef", unit: "lb", price: 4.49, tags: [] },
  { id: "tortillas", name: "Tortillas", unit: "pack", price: 2.49, tags: ["vegetarian"], daysPerUnit: 5 }, // one pack reasonably covers up to 5 days regardless of household size or how many meals use it
  { id: "cheese", name: "Shredded Cheese", unit: "bag", price: 3.49, tags: ["vegetarian"] },
  { id: "onion", name: "Onion", unit: "each", price: 0.49, tags: ["vegetarian", "pantry"] },
  { id: "garlic", name: "Garlic", unit: "head", price: 0.59, tags: ["vegetarian", "pantry"] },
  { id: "cooking_oil", name: "Cooking Oil", unit: "bottle", price: 3.99, tags: ["vegetarian", "pantry"] },
  { id: "salt", name: "Salt", unit: "container", price: 0.99, tags: ["vegetarian", "pantry"] },
  { id: "potatoes", name: "Potatoes", unit: "lb", price: 0.69, tags: ["vegetarian"] },
  { id: "carrots", name: "Carrots", unit: "lb", price: 0.79, tags: ["vegetarian"] },
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

export const MEAL_TEMPLATES = [
  // --- Breakfasts ---------------------------------------------------------
  {
    id: "eggs_and_toast",
    name: "Eggs and Toast",
    mealType: "breakfast",
    note: "an easy, protein-forward meal to start the day",
    vegetarian: true,
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
    pantryFriendly: false,
    ingredients: [
      { itemId: "eggs", qtyPerPerson: 0.2 },
      { itemId: "beans", qtyPerPerson: 0.3 },
      { itemId: "tortillas", qtyPerPerson: 1 },
      { itemId: "cheese", qtyPerPerson: 0.08 },
    ],
  },
  {
    id: "garlic_home_fries",
    name: "Garlic Herb Home Fries",
    mealType: "breakfast",
    note: "a simple skillet side that also works as a full plate",
    vegetarian: true,
    pantryFriendly: true,
    ingredients: [
      { itemId: "potatoes", qtyPerPerson: 0.35 },
      { itemId: "garlic", qtyPerPerson: 0.15 },
      { itemId: "cooking_oil", qtyPerPerson: 0.05 },
    ],
  },
  {
    id: "peanut_butter_oat_bowl",
    name: "Peanut Butter Oat Bowl",
    mealType: "breakfast",
    note: "stick-to-your-ribs oats with a spoonful of peanut butter",
    vegetarian: true,
    pantryFriendly: true,
    ingredients: [
      { itemId: "oats", qtyPerPerson: 0.15 },
      { itemId: "peanut_butter", qtyPerPerson: 0.1 },
      { itemId: "bananas", qtyPerPerson: 0.5 },
    ],
  },
  {
    id: "cheese_toast",
    name: "Cheese Toast",
    mealType: "breakfast",
    note: "a quick melt when mornings are short on time",
    vegetarian: true,
    pantryFriendly: true,
    ingredients: [
      { itemId: "bread", qtyPerPerson: 0.25 },
      { itemId: "cheese", qtyPerPerson: 0.12 },
      { itemId: "cooking_oil", qtyPerPerson: 0.02 },
    ],
  },

  // --- Lunches -------------------------------------------------------------
  {
    id: "peanut_butter_sandwich",
    name: "Peanut Butter Sandwich",
    mealType: "lunch",
    note: "no cooking required and keeps well for a packed lunch",
    vegetarian: true,
    pantryFriendly: true,
    ingredients: [
      { itemId: "bread", qtyPerPerson: 0.25 },
      { itemId: "peanut_butter", qtyPerPerson: 0.15 },
    ],
  },
  {
    id: "bean_cheese_quesadilla",
    name: "Bean and Cheese Quesadilla",
    mealType: "lunch",
    note: "a warm, filling midday option built around pantry beans",
    vegetarian: true,
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
    pantryFriendly: true,
    ingredients: [
      { itemId: "carrots", qtyPerPerson: 0.3 },
      { itemId: "beans", qtyPerPerson: 0.4 },
      { itemId: "onion", qtyPerPerson: 0.1 },
      { itemId: "cooking_oil", qtyPerPerson: 0.04 },
    ],
  },
  {
    id: "pasta_salad",
    name: "Pasta Salad",
    mealType: "lunch",
    note: "a cold pasta dish that's easy to make ahead",
    vegetarian: true,
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
    id: "rice_and_beans",
    name: "Rice and Beans",
    mealType: "dinner",
    note: "a simple, filling pantry staple that stretches a long way",
    vegetarian: true,
    pantryFriendly: true,
    ingredients: [
      { itemId: "rice", qtyPerPerson: 0.35 },
      { itemId: "beans", qtyPerPerson: 1 },
      { itemId: "onion", qtyPerPerson: 0.25 },
      { itemId: "cooking_oil", qtyPerPerson: 0.05 },
    ],
  },
  {
    id: "pasta_with_sauce",
    name: "Pasta with Tomato Sauce",
    mealType: "dinner",
    note: "a quick, budget-friendly dinner with just a few ingredients",
    vegetarian: true,
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
    pantryFriendly: true,
    ingredients: [
      { itemId: "pasta", qtyPerPerson: 0.4 },
      { itemId: "frozen_veg", qtyPerPerson: 0.3 },
      { itemId: "garlic", qtyPerPerson: 0.15 },
      { itemId: "cooking_oil", qtyPerPerson: 0.04 },
    ],
  },
];
// ---------------------------------------------------------------------------
// Sample Chicago stores. `sampleDistanceMiles` is a placeholder used only in
// Version 1; Version 2 replaces it with a real Haversine calculation off
// geocoded coordinates. `priceMultiplier` nudges the same base grocery
// prices up/down per store, and `coverage` is a sample fraction of the
// shopping list this store type is assumed to carry — both are
// illustrative, not live retailer data.
// ---------------------------------------------------------------------------
export const STORES = [
  {
    id: "aldi_logan_square",
    name: "Aldi (Logan Square)",
    address: "2515 N Milwaukee Ave, Chicago, IL",
    detail: "A sample discount grocer with more store-brand substitutions.",
    priceMultiplier: 0.85,
    coverage: 0.8,
    sampleDistanceMiles: 1.0,
  },
  {
    id: "jewel_osco_lincoln_park",
    name: "Jewel-Osco (Lincoln Park)",
    address: "1341 W Fullerton Ave, Chicago, IL",
    detail: "A full-service sample grocer with the broadest list coverage.",
    priceMultiplier: 1.05,
    coverage: 1,
    sampleDistanceMiles: 2.4,
  },
  {
    id: "food4less_pilsen",
    name: "Food 4 Less (Pilsen)",
    address: "3220 W 26th St, Chicago, IL",
    detail: "A balanced sample option for everyday pantry and fresh items.",
    priceMultiplier: 0.92,
    coverage: 0.9,
    sampleDistanceMiles: 3.6,
  },
  {
    id: "walmart_north_ave",
    name: "Walmart Supercenter (North Ave)",
    address: "4626 W North Ave, Chicago, IL 60639",
    detail: "A sample big-box store with the lowest prices and full coverage.",
    priceMultiplier: 0.80,
    coverage: 1.0,
    sampleDistanceMiles: 1.8,
  },
  {
    id: "target_logan_square",
    name: "Target (Logan Square/Milwaukee Ave)",
    address: "2434 N. Sacramento Ave, Chicago, IL 60647",
    detail: "A sample big-box grocery aisle with broad selection.",
    priceMultiplier: 0.95,
    coverage: 0.9,
    sampleDistanceMiles: 1.1,
  },
  {
    id: "rico_fresh_market",
    name: "Rico Fresh Market",
    address: "3552 W. Armitage Ave, Chicago, IL 60647",
    detail: "A sample local grocer with strong fresh produce and meat, less packaged-goods variety.",
    priceMultiplier: 0.88,
    coverage: 0.7,
    sampleDistanceMiles: 0.5,
  },
];
