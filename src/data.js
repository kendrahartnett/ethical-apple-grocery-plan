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
  { id: "bread", name: "Bread", unit: "loaf", price: 2.29, tags: ["vegetarian"] },
  { id: "oats", name: "Oats", unit: "bag", price: 2.49, tags: ["vegetarian", "pantry"] },
  { id: "bananas", name: "Bananas", unit: "lb", price: 0.59, tags: ["vegetarian"] },
  { id: "frozen_veg", name: "Frozen Mixed Vegetables", unit: "bag", price: 1.99, tags: ["vegetarian"] },
  { id: "chicken", name: "Chicken Thighs", unit: "lb", price: 2.49, tags: [] },
  { id: "ground_beef", name: "Ground Beef", unit: "lb", price: 4.49, tags: [] },
  { id: "tortillas", name: "Tortillas", unit: "pack", price: 2.49, tags: ["vegetarian"] },
  { id: "cheese", name: "Shredded Cheese", unit: "bag", price: 3.49, tags: ["vegetarian"] },
  { id: "onion", name: "Onion", unit: "each", price: 0.49, tags: ["vegetarian", "pantry"] },
  { id: "garlic", name: "Garlic", unit: "head", price: 0.59, tags: ["vegetarian", "pantry"] },
  { id: "cooking_oil", name: "Cooking Oil", unit: "bottle", price: 3.99, tags: ["vegetarian", "pantry"] },
  { id: "salt", name: "Salt", unit: "container", price: 0.99, tags: ["vegetarian", "pantry"] },
  { id: "potatoes", name: "Potatoes", unit: "lb", price: 0.69, tags: ["vegetarian"] },
  { id: "carrots", name: "Carrots", unit: "lb", price: 0.79, tags: ["vegetarian"] },
];

// ---------------------------------------------------------------------------
// Simple meal templates — used by the Version 1 rule-based planner.
// Each meal lists the ingredients it needs (by GROCERY_ITEMS id) and the
// approximate quantity needed to feed ONE person for ONE meal. planLogic.js
// scales this by household size. `pantryFriendly: true` means the meal
// leans on common pantry staples, which helps the planner prefer ingredient
// reuse and substitute toward cheaper meals when a plan runs over budget.
// ---------------------------------------------------------------------------
export const MEAL_TEMPLATES = [
  {
    id: "rice_and_beans",
    name: "Rice and Beans",
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
    id: "egg_and_toast",
    name: "Eggs and Toast",
    note: "an easy, protein-forward meal any time of day",
    vegetarian: true,
    pantryFriendly: true,
    ingredients: [
      { itemId: "eggs", qtyPerPerson: 0.2 },
      { itemId: "bread", qtyPerPerson: 0.25 },
      { itemId: "cooking_oil", qtyPerPerson: 0.03 },
    ],
  },
  {
    id: "peanut_butter_sandwich",
    name: "Peanut Butter Sandwich",
    note: "no cooking required and keeps well for a packed lunch",
    vegetarian: true,
    pantryFriendly: true,
    ingredients: [
      { itemId: "bread", qtyPerPerson: 0.25 },
      { itemId: "peanut_butter", qtyPerPerson: 0.15 },
    ],
  },
  {
    id: "oatmeal_and_banana",
    name: "Oatmeal with Banana",
    note: "a warm, inexpensive way to start the day",
    vegetarian: true,
    pantryFriendly: true,
    ingredients: [
      { itemId: "oats", qtyPerPerson: 0.15 },
      { itemId: "bananas", qtyPerPerson: 1 },
    ],
  },
  {
    id: "chicken_rice_bowl",
    name: "Chicken and Rice Bowl",
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
