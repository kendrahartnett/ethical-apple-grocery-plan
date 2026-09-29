import './styles.css';
import './reference.css';
import { DIETARY_PREFERENCES, GROCERY_ITEMS } from './data.js';
import { comparisonView } from './planViews.js';

const root = document.querySelector('#root');

const defaultForm = {
  budget: 95,
  household: 2,
  days: 5,
  onHand: 'rice, eggs, olive oil',
  dietaryPreferences: [],
  location: '',
  pricingMode: 'sample',
  pantry: {},
};

const state = {
  form: { ...defaultForm },
  storeSort: 'cost',
  loading: false,
  error: '',
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
 * actually guarantee. The high end uses the same PRICE_ERROR_MARGIN as the
 * cheapest-store suppression logic, so both reflect the same stated
 * uncertainty in the sample pricing.
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
  return ['setup', 'overview', 'groceries'].includes(screen) ? screen : 'home';
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
          <div class="strip-aside">Budget-checked meals, with sample or reported grocery prices.</div>
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
          <div class="field"><label for="pricing-mode">Price source</label><select id="pricing-mode" name="pricingMode"><option value="sample" ${f.pricingMode === 'sample' ? 'selected' : ''}>Sample prices — try the planner</option><option value="live" ${f.pricingMode === 'live' ? 'selected' : ''}>Reported store prices</option></select><small>Reported prices require configured store products. Missing or old prices will not be silently replaced with samples.</small></div>
          <hr class="form-divider">
          <p class="form-section-label">The way you like to eat</p>
          <div class="field"><span class="field-legend">Dietary preferences <span style="font-weight:400;color:var(--muted)">(optional, choose any that apply)</span></span>
            <div class="checkbox-group" role="group" aria-label="Dietary preferences">
              ${DIETARY_PREFERENCES.map(pref => `<label class="checkbox-option"><input type="checkbox" name="dietaryPreferences" value="${pref.key}" ${f.dietaryPreferences.includes(pref.key) ? 'checked' : ''}><span>${pref.label}</span></label>`).join('')}
            </div>
          </div>
          <div class="field"><label for="location">Chicago ZIP or address <span style="font-weight:400;color:var(--muted)">(optional)</span></label><input id="location" name="location" type="text" value="${escapeHTML(f.location)}" placeholder="60647 or your neighborhood"><small>Reserved for a future real-distance feature. It does not affect this sample plan.</small></div>
          <p role="status" aria-live="polite">${state.loading ? 'Preparing meals and checking the full shopping cost… This may take up to two minutes.' : ''}</p>
          ${state.error ? `<p role="alert" class="budget-warning">${escapeHTML(state.error)}</p>` : ''}
          <div class="form-bottom"><button class="back-button" type="button" data-action="home">← Back to home</button><button class="primary-button" type="submit" ${state.loading ? 'disabled' : ''}>${state.loading ? 'Preparing your plan…' : 'Build My Plan'} ${icons.arrow}</button></div>
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
 * Bridges the Replit-designed form state to Kendra's own generatePlan()
 * logic in planLogic.js, and caches the result for the current form values
 * so overviewView() and groceriesView() don't recompute it independently.
 */
let cachedPlan = null;
let requestVersion = 0;

function planData() {
  return cachedPlan || { meals: [], shoppingList: [], stores: [], totalCost: 0, infeasible: true, infeasibleReason: 'Build a plan from the form first.', warnings: [] };
}

/**
 * Plain-text rendering of the current plan, used by the download, copy,
 * and share actions on the grocery/meal plan screen. Kept as simple text
 * (no HTML) so it pastes cleanly into Notes, Messages, email, etc.
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

function buildPlanText(plan, form) {
  const lines = [];
  lines.push('Ethical Apple \u2014 Grocery Plan');
  const dietLabel = form.dietaryPreferences && form.dietaryPreferences.length ? form.dietaryPreferences.map(key => (DIETARY_PREFERENCES.find(p => p.key === key) || {}).label || key).join(', ') : 'No specific preferences';
  lines.push(`${form.days} ${form.days == 1 ? 'day' : 'days'} of meals for ${form.household} ${form.household == 1 ? 'person' : 'people'} (${dietLabel})`);
  lines.push('');
  lines.push('MEALS');
  chunkMealsByDay(plan.meals).forEach((dayMeals, dayIndex) => {
    lines.push(`Day ${dayIndex + 1}:`);
    dayMeals.forEach(meal => {
      const label = MEAL_TYPE_LABELS[meal.mealType];
      lines.push(`  ${label ? label + ' - ' : ''}${meal.name}`);
      lines.push(`    ${meal.preparationIdea || ''}`);
    });
  });
  lines.push('');
  lines.push('SHOPPING LIST');
  plan.shoppingList.forEach(item => {
    const suffix = item.pantryMatch ? '' : ` \u2014 ${money(item.estimatedCost)}`;
    lines.push(`${item.name} \u2014 ${item.quantity}${suffix}`);
  });
  lines.push('');
  lines.push(`Estimated total: ${moneyRange(plan.totalCost)} (budget: ${money(form.budget)})`);
  if (plan.infeasible) {
    lines.push('');
    lines.push(`Heads up: ${plan.infeasibleReason}`);
  }
  lines.push('');
  lines.push(`Price source: ${plan.pricingMode === 'live' ? 'Open Price Engine' : 'sample catalog'}. Store: ${plan.selectedStore || 'none'}.`);
  lines.push(...(plan.warnings || []));
  lines.push('Totals exclude unverified taxes, fees and checkout changes.');
  return lines.join('\n');
}

const supportsShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

function downloadPlanText(text) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ethical-apple-grocery-plan.txt';
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
        ${plan.infeasible ? '' : `<div class="summary-meta">Estimate ${moneyRange(plan.totalCost)} \u00b7 budget ${money(state.form.budget)}</div>`}
      </div>
      <p class="estimate-disclosure">${plan.source === 'ollama' ? 'AI-assisted meals, with backend-checked costs.' : 'Rule-based meal plan.'} ${plan.pricingMode === 'live' ? 'Prices reported by Open Price Engine.' : 'Illustrative sample prices.'} ${plan.selectedStore ? `Basket: ${escapeHTML(plan.selectedStore)}.` : ''}</p>
      ${(plan.warnings || []).map(w => `<p class="estimate-disclosure">${escapeHTML(w)}</p>`).join('')}
      ${plan.infeasible ? `<div class="budget-warning" role="alert">${icons.info}<div><strong>Heads up:</strong> ${escapeHTML(plan.infeasibleReason)}</div></div>
      <div class="flow-actions"><button class="back-button" type="button" data-action="edit-plan">← Adjust budget, household, or days</button></div>` : `
      <div class="plan-layout">
        <section class="panel meal-panel" aria-labelledby="meals-title">
          <div class="panel-heading"><h2 id="meals-title">Meals for the week</h2><span>${state.form.days} ${state.form.days == 1 ? 'day' : 'days'} · ${plan.meals.length} meals</span></div>
          <div class="meal-stack">${chunkMealsByDay(plan.meals).map((dayMeals, dayIndex) => `<div class="day-group"><div class="day-group-heading">Day ${dayIndex + 1}</div>${dayMeals.map(meal => `<article class="day-meal"><div class="day-label">${MEAL_TYPE_LABELS[meal.mealType] || ''}</div><div><h3>${escapeHTML(meal.name)}</h3><p>${escapeHTML(meal.note || '')}.</p><p>${escapeHTML(meal.preparationIdea || '')}</p><details><summary>Ingredients for ${state.form.household} people</summary><ul>${meal.ingredients.map(i => `<li>${escapeHTML(i.name)}: ${i.householdQuantity} ${escapeHTML(i.unit)}</li>`).join('')}</ul></details></div></article>`).join('')}</div>`).join('')}</div>
        </section>
        <section class="panel shopping-panel" aria-labelledby="shopping-title">
          <div class="panel-heading"><h2 id="shopping-title">Shopping list</h2><span>${plan.pricingMode === 'live' ? 'reported prices' : 'sample prices'}</span></div>
          <table class="shopping-table">
            <caption>Whole packages after subtracting entered pantry quantities.</caption>
            <thead><tr><th scope="col">Item</th><th scope="col">Quantity</th><th scope="col">Estimated cost</th></tr></thead>
            <tbody>${plan.shoppingList.map(item => `<tr><td>${escapeHTML(item.name)}${item.pantryMatch ? ' <small>(on hand)</small>' : ''}${item.productName ? `<small> · ${escapeHTML(item.productName)}</small>` : ''}${item.priceUpdatedAt ? `<small> · ${escapeHTML(item.priceUpdatedAt)}</small>` : ''}</td><td>${escapeHTML(item.quantity)}</td><td>${money(item.estimatedCost)}</td></tr>`).join('')}</tbody>
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
       <div class="flow-actions"><button class="back-button" type="button" data-action="edit-plan">← Back to form</button><button class="primary-button" type="button" data-action="groceries">Compare where to shop ${icons.arrow}</button></div>`}
    </main>
  </div>`;
}

function groceriesView() {
  return comparisonView(planData(), header("groceries"));
}

function render() {
  const screen = currentScreen();
  root.innerHTML = screen === 'home' ? homeView() : screen === 'setup' ? setupView() : screen === 'overview' ? overviewView() : groceriesView();
  bindEvents(screen);
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function bindEvents(screen) {
  root.querySelectorAll('[data-action="go-setup"]').forEach(button => button.addEventListener('click', () => navigate('setup')));
  root.querySelectorAll('[data-action="home"]').forEach(button => button.addEventListener('click', () => navigate('home')));
  root.querySelectorAll('[data-action="overview"]').forEach(button => button.addEventListener('click', () => navigate('overview')));
  root.querySelectorAll('[data-action="groceries"]').forEach(button => button.addEventListener('click', () => navigate('groceries')));
  root.querySelectorAll('[data-action="edit-plan"]').forEach(button => button.addEventListener('click', () => navigate('setup')));
  root.querySelectorAll('[data-action="print"]').forEach(button => button.addEventListener('click', () => window.print()));
  root.querySelectorAll('[data-action="download-plan"]').forEach(button => button.addEventListener('click', () => {
    downloadPlanText(buildPlanText(planData(), state.form));
  }));
  root.querySelectorAll('[data-action="copy-plan"]').forEach(button => button.addEventListener('click', () => {
    copyPlanText(buildPlanText(planData(), state.form), button);
  }));
  root.querySelectorAll('[data-action="share-plan"]').forEach(button => button.addEventListener('click', () => {
    navigator.share({
      title: 'Ethical Apple — Grocery Plan',
      text: buildPlanText(planData(), state.form),
    }).catch(() => {});
  }));
  root.querySelectorAll('[data-action="start-over"]').forEach(button => button.addEventListener('click', () => {
    state.form = { ...defaultForm, dietaryPreferences: [...defaultForm.dietaryPreferences] };
    state.storeSort = 'cost';
    cachedPlan = null;
    requestVersion++;
    state.loading = false;
    state.error = '';
    navigate('home');
  }));

  root.querySelectorAll('[data-store-sort]').forEach(button => button.addEventListener('click', () => {
    state.storeSort = button.dataset.storeSort;
    render();
    root.querySelector(`[data-store-sort="${state.storeSort}"]`)?.focus();
  }));

  const setupForm = root.querySelector('#setup-form');
  if (setupForm) {
    setupForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (state.loading) return;
      const data = new FormData(setupForm);
      state.form = {
        budget: Math.max(1, Number(data.get('budget')) || defaultForm.budget),
        household: Math.max(1, Number(data.get('household')) || defaultForm.household),
         days: Math.min(14, Math.max(1, Number(data.get('days')) || defaultForm.days)),
        onHand: String(data.get('onHand') || '').trim(),
        dietaryPreferences: data.getAll('dietaryPreferences').map(String),
        location: String(data.get('location') || '').trim(),
        pricingMode: String(data.get('pricingMode')),
        pantry: Object.fromEntries(GROCERY_ITEMS.map(i => [i.id, Number(data.get(`pantry-${i.id}`) || 0)])),
      };
       state.storeSort = 'cost';
       cachedPlan = null;
      const version = ++requestVersion;
      state.loading = true;
      state.error = '';
      render();
      try {
        const { location, ...payload } = state.form;
        const response = await fetch(`${import.meta.env.BASE_URL}api/plan`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(150000) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to prepare a plan.');
        if (version !== requestVersion) return;
        cachedPlan = result;
        state.loading = false;
        if (currentScreen() === 'setup') navigate('overview');
      } catch (error) {
        if (version !== requestVersion) return;
        state.error = error.name === 'TimeoutError' ? 'Planning timed out. Please try again.' : error.message === 'Failed to fetch' ? 'Cannot reach the planning service. Start the app with npm run dev.' : error.message;
      } finally {
        if (version === requestVersion) { state.loading = false; render(); }
      }
    });
  }

}

window.addEventListener('hashchange', render);
render();
