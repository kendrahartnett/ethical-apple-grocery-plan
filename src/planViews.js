export const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
export function comparisonView(plan, header) {
  return `<div class="screen-in ea-ref">${header}<main class="app-main">
    <div class="page-heading"><div class="section-kicker">The same meals, priced by store</div><h1>Compare where to shop.</h1>
    <p>Complete baskets appear first. Each store buys enough whole packages for the same meal plan.</p></div>
    ${plan.infeasible ? `<p role="alert">${escapeHTML(plan.infeasibleReason)}</p>` : `
    <p>${plan.pricingMode === 'live' ? 'Prices reported by Open Price Engine. Branch availability and distance are not verified.' : 'Sample mode uses an illustrative catalog, not actual store prices.'}</p>
    <div class="store-results__list">${(plan.stores || []).map(store => `<article class="store-result">
      <div class="store-result__identity"><span class="store-result__eyebrow">${store.storeId === plan.selectedStoreId ? 'Selected basket' : store.complete ? 'Complete priced basket' : 'Incomplete — not ranked by price'}</span><h3>${escapeHTML(store.name)}</h3>
      ${store.missingItems.length ? `<p>Missing prices: ${escapeHTML(store.missingItems.join(', '))}</p>` : ''}
      <details><summary>View this store’s shopping list</summary><ul>${store.shoppingList.filter(i => !i.pantryMatch).map(i => `<li>${escapeHTML(i.name)}: ${escapeHTML(i.quantity)} — ${i.estimatedCost === null ? 'unavailable' : money(i.estimatedCost)}${i.productName ? ` · ${escapeHTML(i.productName)}` : ''}${i.priceUpdatedAt ? ` · ${escapeHTML(i.priceUpdatedAt)}` : ''}</li>`).join('')}</ul></details></div>
      <div class="store-result__metric"><span>Reported basket subtotal</span><strong>${store.complete ? money(store.estimate) : 'Unavailable'}</strong><small>${store.complete ? store.estimate <= plan.budget ? 'Within entered budget' : 'Over entered budget' : 'Missing items are not counted as free'}</small></div>
    </article>`).join('')}</div>`}
    <p class="estimate-disclosure">Totals exclude unverified taxes, fees and checkout changes. No nearby-store or stock guarantee.</p>
    <button class="back-button" type="button" data-action="overview">← Back to plan</button>
    </main></div>`;
}
