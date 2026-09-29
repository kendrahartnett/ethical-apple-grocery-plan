import './styles.css';
import './reference.css';
import { DIETARY_PREFERENCES, GROCERY_ITEMS } from './data.js';
import { generatePlan, parseOnHand } from './planLogic.js';

const root = document.querySelector('#root');

const defaultForm = {
  budget: 95,
  household: 2,
  days: 5,
  onHand: 'rice, eggs, olive oil',
  dietaryPreferences: [],
  pantry: {},
};

const state = {
  form: { ...defaultForm },
};

const icons = {
  arrow: '<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="m4 10 4 4 8-9" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  apple: '<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M10 6.9c-.9-.8-1.7-1.1-2.7-1.1-1.6 0-2.9 1.3-2.9 3.3 0 3.3 2 6.3 4.1 6.3.6 0 1-.3 1.5-.3s.9.3 1.5.3c2.1 0 4.1-3 4.1-6.3 0-2-1.3-3.3-2.9-3.3-1 0-1.8.3-2.7 1.1Z" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><path d="M10 6.5V5.8m.2 0c.2-1.5 1.3-2.5 3-2.5-.3 1.4-1.3 2.4-3 2.5Z" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  info: '<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 9v4M10 6.6v.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  download: '<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M10 3v9m0 0 3.2-3.2M10 12 6.8 8.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 14.5v.8A1.7 1.7 0 0 0 5.7 17h8.6a1.7 1.7 0 0 0 1.7-1.7v-.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  copy: '<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><rect x="7.2" y="7.2" width="8.8" height="8.8" rx="1.4" stroke="currentColor" stroke-width="1.5"/><path d="M12.8 7.2V5.6A1.4 1.4 0 0 0 11.4 4.2H5.6A1.4 1.4 0 0 0 4.2 5.6v5.8a1.4 1.4 0 0 0 1.4 1.4h1.6" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  share: '<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M10 3v9.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="m6.8 6.2 3.2-3.2 3.2 3.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.5 10.5v3.8A1.7 1.7 0 0 0 6.2 16h7.6a1.7 1.7 0 0 0 1.7-1.7v-3.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  list: '<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M7.3 5.5h8M7.3 10h8M7.3 14.5h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="4" cy="5.5" r="1" fill="currentColor"/><circle cx="4" cy="10" r="1" fill="currentColor"/><circle cx="4" cy="14.5" r="1" fill="currentColor"/></svg>',
};

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
}

/**
 * Totals are shown as a range, not a single number, per the scope
 * worksheet's safeguard: real prices could run higher than the sample
 * data, so a specific dollar figure overstates what the estimate can
 * actually guarantee.
 */
function moneyRange(value) {
  return money(value);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function currentScreen() {
  const screen = window.location.hash.replace('#/', '').replace('#', '');
  return ['setup', 'overview'].includes(screen) ? screen : 'home';
}

function navigate(screen) {
  window.location.hash = screen === 'home' ? '' : `/${screen}`;
}

function logo() {
  return `<a class="brand" href="#" aria-label="Ethical Apple home">
    <span class="brand-mark">${icons.apple}</span><span>Ethical Apple</span>
  </a>`;
}

function header(screen) {
  return `<header class="site-header ${screen === 'home' ? 'site-header--home' : 'site-header--app'}">
    ${logo()}
    ${screen !== 'home' ? '<button class="start-over" type="button" data-action="start-over">Start Over</button>' : ''}
  </header>`;
}

function homeView() {
  return `<div class="screen-in ea-ref">
    ${header('home')}
    <main>
      <section class="home-hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <div class="eyebrow">Good food, fewer guesses</div>
          <h1 class="hero-title" id="hero-title">A grocery plan with a little more <em>care.</em></h1>
          <p class="hero-lede">Ethical Apple helps Chicago households make the most of what is already in the kitchen, then fills in the gaps with a calm, affordable plan.</p>
          <div class="hero-actions">
            <button class="primary-button" type="button" data-action="go-setup">Build my grocery plan ${icons.arrow}</button>
            <a class="secondary-button" href="#how-it-works">See how it works ${icons.arrow}</a>
          </div>
          <p class="hero-note">${icons.check} A sample plan in about two minutes</p>
        </div>
        <div class="hero-art" aria-label="Illustration of a colorful planned meal">
          <div class="art-blob"></div>
          <div class="plate">
            <div class="plate-inner">
              <span class="food food--apple"></span><span class="food food--lemon"></span>
              <span class="food food--tomato"></span><span class="food food--greens"></span>
            </div>
          </div>
          <div class="art-tag art-tag--budget"><strong>Budget first</strong>stretch the good stuff</div>
          <div class="art-tag art-tag--pantry"><strong>Pantry aware</strong>use what you have</div>
        </div>
      </section>
      <div class="home-strip">
        <div class="home-strip-inner">
          <div class="strip-words"><span>thoughtful</span><span>practical</span><span>Chicago-made</span></div>
          <div class="strip-aside">Budget-checked meals using editable sample prices.</div>
        </div>
      </div>
      <section class="story-section" id="how-it-works" aria-labelledby="story-title">
        <div class="story-intro">
          <div class="section-kicker">The nice part</div>
          <h2 class="story-title" id="story-title">Planning dinner should not feel like a second job.</h2>
          <p>Tell us the shape of your week. We will turn it into a small, legible plan you can actually take to the store.</p>
        </div>
        <div class="steps">
          <article class="step-card step-card--featured"><div class="step-number">01 / START WITH REAL LIFE</div><h3>Set the shape of your week.</h3><p>Budget, people, days, and the ingredients already waiting for you.</p><span class="step-scribble">↗</span></article>
          <article class="step-card"><div class="step-number">02 / MAKE IT FIT</div><h3>Get a flexible menu.</h3><p>A simple sample plan that makes smart overlaps instead of more work.</p><span class="step-scribble">○</span></article>
          <article class="step-card"><div class="step-number">03 / TAKE IT WITH YOU</div><h3>Shop with a short list.</h3><p>Check things off as you go. Add a forgotten favorite on the spot.</p><span class="step-scribble">✓</span></article>
        </div>
        <div class="closing-cta">
          <p>Ready to see your plan?</p>
          <button class="primary-button" type="button" data-action="go-setup">Build my grocery plan ${icons.arrow}</button>
        </div>
      </section>
    </main>
    <footer class="home-footer"><span><strong>Ethical Apple</strong> · a kinder starting point for dinner</span><span>Built for Chicago households</span></footer>
  </div>`;
}

function setupView() {
  const f = state.form;
  return `<div class="screen-in ea-ref">
    ${header('setup')}
    <main class="app-main">
      <div class="page-heading">
        <div class="section-kicker">First, a little context</div>
        <h1>Let’s make a plan that feels like yours.</h1>
        <p>No perfect pantry required. A few honest details help us build a useful starting point for your household.</p>
      </div>
      <div class="setup-layout">
        <form class="panel setup-form" id="setup-form">
          <p class="form-section-label">The shape of your week</p>
          <div class="form-grid">
            <div class="field"><label for="budget">Total budget in dollars</label><input id="budget" name="budget" type="number" min="1" max="10000" step="0.01" value="${f.budget}" required aria-describedby="budget-help"><small id="budget-help">For everyone and all requested days. Excludes unverified taxes and fees.</small></div>
            <div class="field"><label for="household">Household size</label><input id="household" name="household" type="number" min="1" max="20" step="1" value="${f.household}" required></div>
            <div class="field"><label for="days">Days to cover</label><input id="days" name="days" type="number" min="1" max="14" step="1" value="${f.days}" required></div>
          </div>
            <div class="field"><label for="on-hand">Ingredients you would like to use</label><input id="on-hand" name="onHand" type="text" maxlength="1000" value="${escapeHTML(f.onHand)}" placeholder="rice, beans, frozen spinach"><small>Names guide meal choices. Enter quantities below to reduce purchases; unknown amounts are not treated as free food.</small></div>
          <details><summary>Pantry quantities (optional)</summary><p>Enter usable amounts in the units shown. Leave zero when uncertain. Package-based units refer to the reference sizes used by your ingredient catalog.</p><div class="form-grid">
            ${GROCERY_ITEMS.map(i => `<div class="field"><label for="pantry-${i.id}">${escapeHTML(i.name)} (${i.id === 'tortillas' ? 'individual tortillas' : escapeHTML(i.unit)})</label><input id="pantry-${i.id}" name="pantry-${i.id}" type="number" min="0" max="1000" step="0.01" value="${f.pantry[i.id] || 0}"></div>`).join('')}
          </div></details>
          <hr class="form-divider">
          <p class="form-section-label">The way you like to eat</p>
          <div class="field"><span class="field-legend">Dietary preferences <span style="font-weight:400;color:var(--muted)">(optional, choose any that apply)</span></span>
            <div class="checkbox-group" role="group" aria-label="Dietary preferences">
              ${DIETARY_PREFERENCES.map(pref => `<label class="checkbox-option"><input type="checkbox" name="dietaryPreferences" value="${pref.key}" ${f.dietaryPreferences.includes(pref.key) ? 'checked' : ''}><span>${pref.label}</span></label>`).join('')}
            </div>
          </div>
          <div class="form-bottom"><button class="back-button" type="button" data-action="home">← Back to home</button><button class="primary-button" type="submit">Build My Plan ${icons.arrow}</button></div>
        </form>
        <aside class="panel setup-aside">
          <div class="aside-kicker">A gentle nudge</div>
          <h2>Good planning starts with what is already there.</h2>
          <p>We keep the list focused, so your budget has room for the things that make a meal yours.</p>
          <ul class="aside-list"><li>${icons.check}<span>Overlapping ingredients, fewer one-off buys</span></li><li>${icons.check}<span>Simple meals you can remix through the week</span></li><li>${icons.check}<span>A list that is clear at the store</span></li></ul>
        </aside>
      </div>
    </main>
  </div>`;
}

/**
 * Runs Kendra's own generatePlan() logic in planLogic.js, entirely in the
 * browser -- no network call, no backend. The result is cached for the
 * current form values so the overview screen can reuse it.
 */
let cachedPlan = null;

function planData() {
  return cachedPlan || { meals: [], shoppingList: [], totalCost: 0, infeasible: true, infeasibleReason: 'Build a plan from the form first.' };
}

/**
 * Plain-text shopping list for download, copy, and share actions.
 */
const MEAL_TYPE_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };

/**
 * Splits the flat plan.meals array (breakfast, lunch, dinner, repeat) back
 * into per-day groups of 3 for display and export.
 */
function chunkMealsByDay(meals) {
  const days = [];
  for (let i = 0; i < meals.length; i += 3) {
    days.push(meals.slice(i, i + 3));
  }
  return days;
}

function buildShoppingListText(plan, form) {
  const lines = ['SHOPPING LIST'];
  plan.shoppingList.forEach(item => {
    const suffix = item.pantryMatch ? '' : ` — ${money(item.estimatedCost)}`;
    lines.push(`${item.name} — ${item.quantity}${suffix}`);
  });
  lines.push('');
  lines.push(`Estimated shopping total: ${moneyRange(plan.totalCost)}`);
  lines.push(`Budget: ${money(form.budget)}`);
  return lines.join('\n');
}

const supportsShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

const nearbyStores = [
  { name: 'ALDI', address: '1753 N Milwaukee Ave, Chicago, IL 60647', area: 'Wicker Park / Bucktown' },
  { name: 'Walmart Supercenter', address: '4626 W Diversey Ave, Chicago, IL 60639', area: 'Hermosa' },
  { name: 'Rico Fresh Market', address: '3552 W Armitage Ave, Chicago, IL 60647', area: 'Logan Square' },
];

function downloadPlanText(text) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ethical-apple-shopping-list.txt';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function copyPlanText(text, button) {
  const originalLabel = button.dataset.originalLabel || button.innerHTML;
  button.dataset.originalLabel = originalLabel;
  try {
    await navigator.clipboard.writeText(text);
    button.innerHTML = 'Copied!';
  } catch (error) {
    button.innerHTML = 'Could not copy';
  }
  setTimeout(() => {
    button.innerHTML = originalLabel;
  }, 1800);
}

function overviewView() {
  const plan = planData();
  return `<div class="screen-in ea-ref">
    ${header('overview')}
    <main class="app-main">
      <div class="plan-summary">
        <div class="page-heading"><div class="section-kicker">Your grocery and meal plan</div><h1>A week with a little more ease.</h1><p>${state.form.days} ${state.form.days == 1 ? 'day' : 'days'} of meals for ${state.form.household} ${state.form.household == 1 ? 'person' : 'people'}, shaped around ${state.form.dietaryPreferences.length ? escapeHTML(state.form.dietaryPreferences.map(key => (DIETARY_PREFERENCES.find(p => p.key === key) || {}).label || key).join(', ').toLowerCase()) : 'your'} preferences and what is already in the kitchen.</p></div>
        ${plan.infeasible ? '' : `<div class="summary-meta">Estimate ${moneyRange(plan.totalCost)} · budget ${money(state.form.budget)}</div>`}
      </div>
      <p class="estimate-disclosure">Rule-based meal plan. Prices are illustrative samples, not live store quotes.</p>
      ${plan.infeasible ? `<div class="budget-warning" role="alert">${icons.info}<div><strong>Heads up:</strong> ${escapeHTML(plan.infeasibleReason)}</div></div>
      <div class="flow-actions"><button class="back-button" type="button" data-action="edit-plan">← Adjust budget, household, or days</button></div>` : `
      <div class="plan-layout">
        <section class="panel meal-panel" aria-labelledby="meals-title">
          <div class="panel-heading"><h2 id="meals-title">Meals for the week</h2><span>${state.form.days} ${state.form.days == 1 ? 'day' : 'days'} · ${plan.meals.length} meals</span></div>
          <div class="meal-stack">${chunkMealsByDay(plan.meals).map((dayMeals, dayIndex) => `<div class="day-group"><div class="day-group-heading">Day ${dayIndex + 1}</div>${dayMeals.map(meal => `<article class="day-meal"><div class="day-label">${MEAL_TYPE_LABELS[meal.mealType] || ''}</div><div><h3>${escapeHTML(meal.name)}</h3><p>${escapeHTML(meal.note || '')}.</p><details><summary>Ingredients for ${state.form.household} people</summary><ul>${meal.ingredients.map(i => { const item = GROCERY_ITEMS.find(g => g.id === i.itemId); return `<li>${escapeHTML(item ? item.name : i.itemId)}: ${(i.qtyPerPerson * state.form.household).toFixed(2)} ${escapeHTML(item ? item.unit : '')}</li>`; }).join('')}</ul></details></div></article>`).join('')}</div>`).join('')}</div>
        </section>
        <section class="panel shopping-panel" aria-labelledby="shopping-title">
          <div class="panel-heading"><h2 id="shopping-title">Shopping list</h2><span>sample prices</span></div>
          <table class="shopping-table">
            <caption>Whole packages after subtracting entered pantry quantities.</caption>
            <thead><tr><th scope="col">Item</th><th scope="col">Quantity</th><th scope="col">Estimated cost</th></tr></thead>
            <tbody>${plan.shoppingList.map(item => `<tr><td>${escapeHTML(item.name)}${item.pantryMatch ? ' <small>(on hand)</small>' : ''}</td><td>${escapeHTML(item.quantity)}</td><td>${money(item.estimatedCost)}</td></tr>`).join('')}</tbody>
            <tfoot><tr><td colspan="2">Estimated shopping total</td><td>${moneyRange(plan.totalCost)}</td></tr></tfoot>
          </table>
          <p class="estimate-disclosure">${icons.info}<span>This subtotal fits the entered budget at the displayed prices. Taxes, fees and checkout changes are not included. Dietary tags are preferences, not verified nutrition or allergy guidance.</span></p>
          <div class="plan-actions" role="group" aria-label="Save or share this plan">
            <button class="plan-action-button" type="button" data-action="download-plan">${icons.download}<span>Download</span></button>
            <button class="plan-action-button" type="button" data-action="copy-plan">${icons.copy}<span>Copy</span></button>
            ${supportsShare ? `<button class="plan-action-button" type="button" data-action="share-plan">${icons.share}<span>Share</span></button>` : ''}
          </div>
        </section>
      </div>
      <section class="nearby-stores" aria-labelledby="nearby-stores-title">
        <div class="nearby-stores__heading"><div><div class="section-kicker">Where to shop</div><h2 id="nearby-stores-title">Grocery stores in and around Logan Square</h2></div><p>Locations only. Check each store for current hours, stock, and prices.</p></div>
        <div class="nearby-stores__grid">${nearbyStores.map(store => `<article class="panel nearby-store"><span class="nearby-store__area">${escapeHTML(store.area)}</span><h3>${escapeHTML(store.name)}</h3><p>${escapeHTML(store.address)}</p><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}" target="_blank" rel="noopener noreferrer" aria-label="Get directions to ${escapeHTML(store.name)}">Get directions ${icons.arrow}</a></article>`).join('')}</div>
      </section>
       <div class="flow-actions"><button class="back-button" type="button" data-action="edit-plan">← Back to form</button></div>`}
    </main>
  </div>`;
}

function render() {
  const screen = currentScreen();
  root.innerHTML = screen === 'home' ? homeView() : screen === 'setup' ? setupView() : overviewView();
  bindEvents(screen);
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function bindEvents(screen) {
  root.querySelectorAll('[data-action="go-setup"]').forEach(button => button.addEventListener('click', () => navigate('setup')));
  root.querySelectorAll('[data-action="home"]').forEach(button => button.addEventListener('click', () => navigate('home')));
  root.querySelectorAll('[data-action="overview"]').forEach(button => button.addEventListener('click', () => navigate('overview')));
  root.querySelectorAll('[data-action="edit-plan"]').forEach(button => button.addEventListener('click', () => navigate('setup')));
  root.querySelectorAll('[data-action="print"]').forEach(button => button.addEventListener('click', () => window.print()));
  root.querySelectorAll('[data-action="download-plan"]').forEach(button => button.addEventListener('click', () => {
    downloadPlanText(buildShoppingListText(planData(), state.form));
  }));
  root.querySelectorAll('[data-action="copy-plan"]').forEach(button => button.addEventListener('click', () => {
    copyPlanText(buildShoppingListText(planData(), state.form), button);
  }));
  root.querySelectorAll('[data-action="share-plan"]').forEach(button => button.addEventListener('click', () => {
    navigator.share({
      title: 'Shopping List',
      text: buildShoppingListText(planData(), state.form),
    }).catch(() => {});
  }));
  root.querySelectorAll('[data-action="start-over"]').forEach(button => button.addEventListener('click', () => {
    state.form = { ...defaultForm, dietaryPreferences: [...defaultForm.dietaryPreferences] };
    cachedPlan = null;
    navigate('home');
  }));

  const setupForm = root.querySelector('#setup-form');
  if (setupForm) {
    setupForm.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(setupForm);
      state.form = {
        budget: Math.min(10000, Math.max(1, Number(data.get('budget')) || defaultForm.budget)),
        household: Math.min(20, Math.max(1, Number(data.get('household')) || defaultForm.household)),
        days: Math.min(14, Math.max(1, Number(data.get('days')) || defaultForm.days)),
        onHand: String(data.get('onHand') || '').trim(),
        dietaryPreferences: data.getAll('dietaryPreferences').map(String),
        pantry: Object.fromEntries(GROCERY_ITEMS.map(i => [i.id, Math.max(0, Number(data.get(`pantry-${i.id}`)) || 0)])),
      };
      cachedPlan = generatePlan({
        budget: state.form.budget,
        householdSize: state.form.household,
        days: state.form.days,
        onHandIds: parseOnHand(state.form.onHand),
        pantry: state.form.pantry,
        dietaryPreferences: state.form.dietaryPreferences,
      });
      navigate('overview');
    });
  }
}

window.addEventListener('hashchange', render);
render();
