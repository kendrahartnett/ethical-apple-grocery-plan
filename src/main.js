import './styles.css';
import './reference.css';
import { generatePlan, computeStoreResults, sortStoreResults, parseOnHand } from './planLogic.js';

const root = document.querySelector('#root');

const defaultForm = {
  budget: 95,
  household: 2,
  days: 5,
  onHand: 'rice, eggs, olive oil',
  diet: 'No restrictions',
  location: '',
};

const state = {
  form: { ...defaultForm },
  storeSort: 'cost',
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
          <div class="strip-aside">No live prices. No distance promises. Just a useful place to start.</div>
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
            <div class="field"><label for="budget">Budget in dollars</label><input id="budget" name="budget" type="number" min="1" step="1" value="${f.budget}" required aria-describedby="budget-help"><small id="budget-help">A weekly grocery target.</small></div>
            <div class="field"><label for="household">Household size</label><input id="household" name="household" type="number" min="1" step="1" value="${f.household}" required></div>
            <div class="field"><label for="days">Days to cover</label><input id="days" name="days" type="number" min="1" max="14" step="1" value="${f.days}" required></div>
          </div>
            <div class="field"><label for="on-hand">What’s already on hand?</label><input id="on-hand" name="onHand" type="text" value="${escapeHTML(f.onHand)}" placeholder="rice, beans, frozen spinach"><small>Separate ingredients with commas. We will try to build around them.</small></div>
          <hr class="form-divider">
          <p class="form-section-label">The way you like to eat</p>
          <div class="field"><label for="diet">Dietary preference</label><select id="diet" name="diet"><option ${f.diet === 'No restrictions' ? 'selected' : ''}>No restrictions</option><option ${f.diet === 'Vegetarian' ? 'selected' : ''}>Vegetarian</option></select></div>
          <div class="field"><label for="location">Chicago ZIP or address <span style="font-weight:400;color:var(--muted)">(optional)</span></label><input id="location" name="location" type="text" value="${escapeHTML(f.location)}" placeholder="60647 or your neighborhood"><small>Reserved for a future real-distance feature. It does not affect this sample plan.</small></div>
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
 * Bridges the Replit-designed form state to Kendra's own generatePlan()
 * logic in planLogic.js, and caches the result for the current form values
 * so overviewView() and groceriesView() don't recompute it independently.
 */
let cachedPlan = null;
let cachedPlanKey = null;

function planData() {
  const key = JSON.stringify(state.form);
  if (cachedPlan && cachedPlanKey === key) return cachedPlan;

  const plan = generatePlan({
    budget: Math.max(1, Number(state.form.budget) || defaultForm.budget),
    householdSize: Math.max(1, Number(state.form.household) || defaultForm.household),
    days: Math.min(14, Math.max(1, Number(state.form.days) || defaultForm.days)),
    onHandIds: parseOnHand(state.form.onHand),
    vegetarianOnly: state.form.diet === 'Vegetarian',
  });

  cachedPlan = plan;
  cachedPlanKey = key;
  return plan;
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
  lines.push(`${form.days} ${form.days == 1 ? 'day' : 'days'} of meals for ${form.household} ${form.household == 1 ? 'person' : 'people'} (${form.diet})`);
  lines.push('');
  lines.push('MEALS');
  chunkMealsByDay(plan.meals).forEach((dayMeals, dayIndex) => {
    lines.push(`Day ${dayIndex + 1}:`);
    dayMeals.forEach(meal => {
      const label = MEAL_TYPE_LABELS[meal.mealType];
      lines.push(`  ${label ? label + ' - ' : ''}${meal.name}`);
    });
  });
  lines.push('');
  lines.push('SHOPPING LIST');
  plan.shoppingList.forEach(item => {
    const suffix = item.pantryMatch ? '' : ` \u2014 ${money(item.estimatedCost)}`;
    lines.push(`${item.name} \u2014 ${item.quantity}${suffix}`);
  });
  lines.push('');
  lines.push(`Estimated total: ${money(plan.totalCost)} (budget: ${money(form.budget)})`);
  if (plan.infeasible) {
    lines.push('');
    lines.push(`Heads up: ${plan.infeasibleReason}`);
  }
  lines.push('');
  lines.push('Prices are illustrative estimates for planning, not live pricing or store quotes.');
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
        <div class="page-heading"><div class="section-kicker">Your grocery and meal plan</div><h1>A week with a little more ease.</h1><p>${state.form.days} ${state.form.days == 1 ? 'day' : 'days'} of meals for ${state.form.household} ${state.form.household == 1 ? 'person' : 'people'}, shaped around your ${escapeHTML(state.form.diet.toLowerCase())} preferences and what is already in the kitchen.</p></div>
        <div class="summary-meta">Estimate ${money(plan.totalCost)} · budget ${money(state.form.budget)}</div>
      </div>
      ${plan.infeasible ? `<div class="budget-warning" role="alert">${icons.info}<div><strong>Heads up:</strong> ${escapeHTML(plan.infeasibleReason)}</div></div>` : ''}
      <div class="plan-layout">
        <section class="panel meal-panel" aria-labelledby="meals-title">
          <div class="panel-heading"><h2 id="meals-title">Meals for the week</h2><span>${state.form.days} ${state.form.days == 1 ? 'day' : 'days'} · ${plan.meals.length} meals</span></div>
          <div class="meal-stack">${chunkMealsByDay(plan.meals).map((dayMeals, dayIndex) => `<div class="day-group"><div class="day-group-heading">Day ${dayIndex + 1}</div>${dayMeals.map(meal => `<article class="day-meal"><div class="day-label">${MEAL_TYPE_LABELS[meal.mealType] || ''}</div><div><h3>${escapeHTML(meal.name)}</h3><p>${escapeHTML(meal.note || '')}.</p></div></article>`).join('')}</div>`).join('')}</div>
        </section>
        <section class="panel shopping-panel" aria-labelledby="shopping-title">
          <div class="panel-heading"><h2 id="shopping-title">Shopping list</h2><span>illustrative estimate</span></div>
          <table class="shopping-table">
            <caption>Ingredients are grouped into a short list; pantry matches are treated as already covered.</caption>
            <thead><tr><th scope="col">Item</th><th scope="col">Quantity</th><th scope="col">Estimated cost</th></tr></thead>
            <tbody>${plan.shoppingList.map(item => `<tr><td>${escapeHTML(item.name)}${item.pantryMatch ? ' <small>(on hand)</small>' : ''}</td><td>${escapeHTML(item.quantity)}</td><td>${money(item.estimatedCost)}</td></tr>`).join('')}</tbody>
            <tfoot><tr><td colspan="2">Estimated shopping total</td><td>${money(plan.totalCost)}</td></tr></tfoot>
          </table>
          <p class="estimate-disclosure">${icons.info}<span>Prices are illustrative estimates for planning, not live pricing or store quotes. Your actual total may differ.</span></p>
          <div class="plan-actions" role="group" aria-label="Save or share this plan">
            <button class="plan-action-button" type="button" data-action="download-plan">${icons.download}<span>Download</span></button>
            <button class="plan-action-button" type="button" data-action="copy-plan">${icons.copy}<span>Copy</span></button>
            ${supportsShare ? `<button class="plan-action-button" type="button" data-action="share-plan">${icons.share}<span>Share</span></button>` : ''}
          </div>
        </section>
      </div>
       <div class="flow-actions"><button class="back-button" type="button" data-action="edit-plan">← Back to form</button><button class="primary-button" type="button" data-action="groceries">Compare where to shop ${icons.arrow}</button></div>
    </main>
  </div>`;
}

function groceriesView() {
  const plan = planData();
  const total = plan.totalCost;
  const sortOptions = [
    { key: 'cost', title: 'Lowest Grocery Cost', detail: 'Put the lowest estimated basket first.' },
    { key: 'distance', title: 'Closest Store', detail: 'Sort by placeholder distance.' },
    { key: 'one-stop', title: 'One-Stop Shopping', detail: 'Favor a broader sample-list fit.' },
    { key: 'balanced', title: 'Balance of Price and Distance', detail: 'Weigh estimated cost and placeholder distance.' },
  ];

  const results = computeStoreResults(plan.shoppingList);
  const sortedResults = sortStoreResults(results, state.storeSort);
  const itemsToBuyCount = plan.shoppingList.filter(item => !item.pantryMatch).length;

  return `<div class="screen-in ea-ref">
    ${header('groceries')}
    <main class="app-main">
      <div class="comparison-intro">
        <div class="page-heading"><div class="section-kicker">Your next step</div><h1>Compare where to shop.</h1><p>Choose what matters most and see sample grocery options sorted around your ${money(total)} plan estimate.</p></div>
      </div>
      <section class="sort-options" role="group" aria-label="Sort store results">
        ${sortOptions.map(option => `<button class="sort-option ${state.storeSort === option.key ? 'sort-option--active' : ''}" type="button" data-store-sort="${option.key}" aria-pressed="${state.storeSort === option.key}">
          <span class="sort-option__check" aria-hidden="true">${state.storeSort === option.key ? icons.check : ''}</span>
          <span class="sort-option__copy"><strong>${escapeHTML(option.title)}</strong><small>${escapeHTML(option.detail)}</small></span>
        </button>`).join('')}
      </section>
      <section class="store-results" aria-labelledby="store-results-title">
        <div class="store-results__heading"><div><div class="section-kicker">Sample results</div><h2 id="store-results-title">Your options, sorted</h2></div><span>${sortedResults.length} example store types</span></div>
        <div class="store-results__list" aria-live="polite">
          ${sortedResults.map((store, index) => `<article class="store-result ${index === 0 ? 'store-result--top' : ''}">
            <div class="store-result__identity"><span class="store-result__eyebrow">${index === 0 ? 'Top match for this sort' : 'Illustrative store type'}</span><h3>${escapeHTML(store.name)}</h3><p>${escapeHTML(store.detail)}</p><button class="store-result__list-link" type="button" data-action="overview">${icons.list}<span>My grocery list</span></button></div>
            <div class="store-result__metric"><span>Basket estimate</span><strong>${money(store.estimate)}</strong></div>
            <div class="store-result__metric"><span>Distance</span><strong>${store.distance.toFixed(1)} mi</strong><small>placeholder</small></div>
            <div class="store-result__metric"><span>Sample list fit</span><strong>${store.coveredItems} of ${itemsToBuyCount}</strong><small>placeholder</small></div>
          </article>`).join('')}
        </div>
      </section>
      <div class="comparison-footer">
        <p class="distance-disclosure">${icons.info}<span>Distances are placeholders for now. Starting in Version 2, they will be described as approximate straight-line distance. Store types, list fit, and basket estimates are examples—not live retailer results. Your Chicago ZIP or address is not used here.</span></p>
        <button class="back-button" type="button" data-action="overview">← Back to plan</button>
      </div>
    </main>
  </div>`;
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
    state.form = { ...defaultForm };
    state.storeSort = 'cost';
    cachedPlan = null;
    navigate('home');
  }));

  root.querySelectorAll('[data-store-sort]').forEach(button => button.addEventListener('click', () => {
    state.storeSort = button.dataset.storeSort;
    render();
    root.querySelector(`[data-store-sort="${state.storeSort}"]`)?.focus();
  }));

  const setupForm = root.querySelector('#setup-form');
  if (setupForm) {
    setupForm.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(setupForm);
      state.form = {
        budget: Math.max(1, Number(data.get('budget')) || defaultForm.budget),
        household: Math.max(1, Number(data.get('household')) || defaultForm.household),
         days: Math.min(14, Math.max(1, Number(data.get('days')) || defaultForm.days)),
        onHand: String(data.get('onHand') || '').trim(),
        diet: String(data.get('diet') || defaultForm.diet),
        location: String(data.get('location') || '').trim(),
      };
       state.storeSort = 'cost';
       cachedPlan = null;
      navigate('overview');
    });
  }

}

window.addEventListener('hashchange', render);
render();
