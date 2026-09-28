(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function s(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(a){if(a.ep)return;a.ep=!0;const o=s(a);fetch(a.href,o)}})();const S=[{id:"rice",name:"Rice",unit:"lb",price:.89,tags:["vegetarian","pantry"]},{id:"beans",name:"Canned Beans",unit:"can",price:.99,tags:["vegetarian","pantry"]},{id:"pasta",name:"Pasta",unit:"box",price:1.29,tags:["vegetarian","pantry"]},{id:"tomato_sauce",name:"Tomato Sauce",unit:"jar",price:1.49,tags:["vegetarian","pantry"]},{id:"eggs",name:"Eggs (dozen)",unit:"dozen",price:2.79,tags:["vegetarian"]},{id:"peanut_butter",name:"Peanut Butter",unit:"jar",price:3.29,tags:["vegetarian","pantry"]},{id:"bread",name:"Bread",unit:"loaf",price:2.29,tags:["vegetarian"]},{id:"oats",name:"Oats",unit:"bag",price:2.49,tags:["vegetarian","pantry"]},{id:"bananas",name:"Bananas",unit:"lb",price:.59,tags:["vegetarian"]},{id:"frozen_veg",name:"Frozen Mixed Vegetables",unit:"bag",price:1.99,tags:["vegetarian"]},{id:"chicken",name:"Chicken Thighs",unit:"lb",price:2.49,tags:[]},{id:"ground_beef",name:"Ground Beef",unit:"lb",price:4.49,tags:[]},{id:"tortillas",name:"Tortillas",unit:"pack",price:2.49,tags:["vegetarian"]},{id:"cheese",name:"Shredded Cheese",unit:"bag",price:3.49,tags:["vegetarian"]},{id:"onion",name:"Onion",unit:"each",price:.49,tags:["vegetarian","pantry"]},{id:"garlic",name:"Garlic",unit:"head",price:.59,tags:["vegetarian","pantry"]},{id:"cooking_oil",name:"Cooking Oil",unit:"bottle",price:3.99,tags:["vegetarian","pantry"]},{id:"salt",name:"Salt",unit:"container",price:.99,tags:["vegetarian","pantry"]},{id:"potatoes",name:"Potatoes",unit:"lb",price:.69,tags:["vegetarian"]},{id:"carrots",name:"Carrots",unit:"lb",price:.79,tags:["vegetarian"]}],T=[{id:"rice_and_beans",name:"Rice and Beans",note:"a simple, filling pantry staple that stretches a long way",vegetarian:!0,pantryFriendly:!0,ingredients:[{itemId:"rice",qtyPerPerson:.35},{itemId:"beans",qtyPerPerson:1},{itemId:"onion",qtyPerPerson:.25},{itemId:"cooking_oil",qtyPerPerson:.05}]},{id:"pasta_with_sauce",name:"Pasta with Tomato Sauce",note:"a quick, budget-friendly dinner with just a few ingredients",vegetarian:!0,pantryFriendly:!0,ingredients:[{itemId:"pasta",qtyPerPerson:.4},{itemId:"tomato_sauce",qtyPerPerson:.4},{itemId:"garlic",qtyPerPerson:.2}]},{id:"egg_and_toast",name:"Eggs and Toast",note:"an easy, protein-forward meal any time of day",vegetarian:!0,pantryFriendly:!0,ingredients:[{itemId:"eggs",qtyPerPerson:.2},{itemId:"bread",qtyPerPerson:.25},{itemId:"cooking_oil",qtyPerPerson:.03}]},{id:"peanut_butter_sandwich",name:"Peanut Butter Sandwich",note:"no cooking required and keeps well for a packed lunch",vegetarian:!0,pantryFriendly:!0,ingredients:[{itemId:"bread",qtyPerPerson:.25},{itemId:"peanut_butter",qtyPerPerson:.15}]},{id:"oatmeal_and_banana",name:"Oatmeal with Banana",note:"a warm, inexpensive way to start the day",vegetarian:!0,pantryFriendly:!0,ingredients:[{itemId:"oats",qtyPerPerson:.15},{itemId:"bananas",qtyPerPerson:1}]},{id:"chicken_rice_bowl",name:"Chicken and Rice Bowl",note:"a heartier dinner built around rice you likely already have",vegetarian:!1,pantryFriendly:!1,ingredients:[{itemId:"chicken",qtyPerPerson:.4},{itemId:"rice",qtyPerPerson:.35},{itemId:"frozen_veg",qtyPerPerson:.3}]},{id:"beef_taco",name:"Ground Beef Tacos",note:"a family favorite that's easy to portion for any group size",vegetarian:!1,pantryFriendly:!1,ingredients:[{itemId:"ground_beef",qtyPerPerson:.35},{itemId:"tortillas",qtyPerPerson:3},{itemId:"cheese",qtyPerPerson:.15},{itemId:"onion",qtyPerPerson:.15}]},{id:"veggie_taco",name:"Bean and Cheese Tacos",note:"the same easy taco format, built around pantry beans instead of meat",vegetarian:!0,pantryFriendly:!0,ingredients:[{itemId:"beans",qtyPerPerson:.6},{itemId:"tortillas",qtyPerPerson:3},{itemId:"cheese",qtyPerPerson:.15}]},{id:"potato_hash",name:"Potato and Veggie Hash",note:"a filling skillet meal that uses a few humble vegetables well",vegetarian:!0,pantryFriendly:!1,ingredients:[{itemId:"potatoes",qtyPerPerson:.5},{itemId:"carrots",qtyPerPerson:.25},{itemId:"onion",qtyPerPerson:.2},{itemId:"cooking_oil",qtyPerPerson:.05}]}],B=[{id:"aldi_logan_square",name:"Aldi (Logan Square)",address:"2515 N Milwaukee Ave, Chicago, IL",detail:"A sample discount grocer with more store-brand substitutions.",priceMultiplier:.85,coverage:.8,sampleDistanceMiles:1},{id:"jewel_osco_lincoln_park",name:"Jewel-Osco (Lincoln Park)",address:"1341 W Fullerton Ave, Chicago, IL",detail:"A full-service sample grocer with the broadest list coverage.",priceMultiplier:1.05,coverage:1,sampleDistanceMiles:2.4},{id:"food4less_pilsen",name:"Food 4 Less (Pilsen)",address:"3220 W 26th St, Chicago, IL",detail:"A balanced sample option for everyday pantry and fresh items.",priceMultiplier:.92,coverage:.9,sampleDistanceMiles:3.6},{id:"walmart_north_ave",name:"Walmart Supercenter (North Ave)",address:"4626 W North Ave, Chicago, IL 60639",detail:"A sample big-box store with the lowest prices and full coverage.",priceMultiplier:.8,coverage:1,sampleDistanceMiles:1.8},{id:"target_logan_square",name:"Target (Logan Square/Milwaukee Ave)",address:"2434 N. Sacramento Ave, Chicago, IL 60647",detail:"A sample big-box grocery aisle with broad selection.",priceMultiplier:.95,coverage:.9,sampleDistanceMiles:1.1},{id:"rico_fresh_market",name:"Rico Fresh Market",address:"3552 W. Armitage Ave, Chicago, IL 60647",detail:"A sample local grocer with strong fresh produce and meat, less packaged-goods variety.",priceMultiplier:.88,coverage:.7,sampleDistanceMiles:.5}],D=1.25;function N(e){const t=new Set;if(!e)return t;const s=e.split(",").map(r=>r.trim().toLowerCase()).filter(Boolean);return S.forEach(r=>{const a=r.name.toLowerCase();s.some(o=>a.includes(o)||o.includes(r.id.replace(/_/g," ")))&&t.add(r.id)}),t}function O(e,t,s){return e.ingredients.reduce((r,a)=>{if(s.has(a.itemId))return r;const o=S.find(i=>i.id===a.itemId);return o?r+o.price*a.qtyPerPerson*t:r},0)}function A(e,t,s){const r={};e.forEach(i=>{i.ingredients.forEach(l=>{const h=l.qtyPerPerson*t;r[l.itemId]=(r[l.itemId]||0)+h})});const a=[];let o=0;return Object.entries(r).forEach(([i,l])=>{const h=S.find(y=>y.id===i);if(!h)return;const d=s.has(i),c=Math.max(1,Math.ceil(l)),p=d?0:c*h.price;d||(o+=p),a.push({itemId:i,name:h.name,unit:h.unit,qty:c,pantryMatch:d,quantity:d?"on hand":`${c} ${h.unit}${c===1?"":"s"}`,estimatedCost:p})}),{shoppingList:a,totalCost:o}}function R({budget:e,householdSize:t,days:s,onHandIds:r,vegetarianOnly:a}){const i=e/s/t;if(i<D)return{meals:[],shoppingList:[],totalCost:0,infeasible:!0,infeasibleReason:`$${e.toFixed(2)} for ${t} ${t===1?"person":"people"} over ${s} day${s===1?"":"s"} works out to about $${i.toFixed(2)} per person per day, which isn't realistically enough even for the cheapest staples. Try a larger budget, fewer days, or a smaller household size.`};let l=T.filter(u=>!a||u.vegetarian);const h=u=>u.ingredients.filter(b=>r.has(b.itemId)).length;if(l=l.slice().sort((u,b)=>{const _=h(b)-h(u);return _!==0?_:(b.pantryFriendly?1:0)-(u.pantryFriendly?1:0)}),l.length===0)return{meals:[],shoppingList:[],totalCost:0,infeasible:!0,infeasibleReason:"No meals in the current dataset fit the dietary preference selected. Try a different dietary option."};let d=[];for(let u=0;u<s;u++)d.push(l[u%l.length]);let{shoppingList:c,totalCost:p}=A(d,t,r),y=0;const P=l.filter(u=>u.pantryFriendly);for(;p>e&&y<d.length&&P.length>0;){let u=-1,b=-1;if(d.forEach((C,F)=>{if(C.pantryFriendly)return;const E=O(C,t,r);E>b&&(b=E,u=F)}),u===-1)break;const _=P[y%P.length];d[u]=_;const M=A(d,t,r);c=M.shoppingList,p=M.totalCost,y++}return p>e?{meals:d,shoppingList:c,totalCost:p,infeasible:!0,infeasibleReason:`Even after substituting cheaper meals, the estimated total ($${p.toFixed(2)}) is above your $${e.toFixed(2)} budget. Consider a larger budget or fewer days.`}:{meals:d,shoppingList:c,totalCost:p,infeasible:!1,infeasibleReason:null}}function j(e){return B.map(t=>{const s=e.reduce((a,o)=>{if(o.pantryMatch)return a;const i=S.find(l=>l.id===o.itemId);return i?a+i.price*t.priceMultiplier*o.qty:a},0),r=e.filter(a=>!a.pantryMatch).length;return{storeId:t.id,name:t.name,address:t.address,detail:t.detail,estimate:s,distance:t.sampleDistanceMiles,coveredItems:Math.round(r*t.coverage)}})}function H(e,t){const s=e.slice();switch(t){case"distance":return s.sort((r,a)=>r.distance-a.distance||r.estimate-a.estimate);case"one-stop":return s.sort((r,a)=>a.coveredItems-r.coveredItems||r.estimate-a.estimate);case"balanced":{const r=s.map(c=>c.estimate),a=s.map(c=>c.distance),o=Math.min(...r),i=Math.max(...r),l=Math.min(...a),h=Math.max(...a),d=(c,p,y)=>y===p?0:(c-p)/(y-p);return s.sort((c,p)=>{const y=d(c.estimate,o,i)*.55+d(c.distance,l,h)*.45,P=d(p.estimate,o,i)*.55+d(p.distance,l,h)*.45;return y-P})}default:return s.sort((r,a)=>r.estimate-a.estimate)}}const f=document.querySelector("#root"),v={budget:95,household:2,days:5,onHand:"rice, eggs, olive oil",diet:"No restrictions",location:""},n={form:{...v},storeSort:"cost"},m={arrow:'<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',check:'<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="m4 10 4 4 8-9" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',apple:'<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M10 6.9c-.9-.8-1.7-1.1-2.7-1.1-1.6 0-2.9 1.3-2.9 3.3 0 3.3 2 6.3 4.1 6.3.6 0 1-.3 1.5-.3s.9.3 1.5.3c2.1 0 4.1-3 4.1-6.3 0-2-1.3-3.3-2.9-3.3-1 0-1.8.3-2.7 1.1Z" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><path d="M10 6.5V5.8m.2 0c.2-1.5 1.3-2.5 3-2.5-.3 1.4-1.3 2.4-3 2.5Z" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>',info:'<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 9v4M10 6.6v.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'};function k(e){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2}).format(e)}function g(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function W(){const e=window.location.hash.replace("#/","").replace("#","");return["setup","overview","groceries"].includes(e)?e:"home"}function w(e){window.location.hash=e==="home"?"":`/${e}`}function V(){return`<a class="brand" href="#" aria-label="Ethical Apple home">
    <span class="brand-mark">${m.apple}</span><span>Ethical Apple</span>
  </a>`}function I(e){return`<header class="site-header ${e==="home"?"site-header--home":"site-header--app"}">
    ${V()}
    ${e!=="home"?'<button class="start-over" type="button" data-action="start-over">Start Over</button>':""}
  </header>`}function G(){return`<div class="screen-in ea-ref">
    ${I("home")}
    <main>
      <section class="home-hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <div class="eyebrow">Good food, fewer guesses</div>
          <h1 class="hero-title" id="hero-title">A grocery plan with a little more <em>care.</em></h1>
          <p class="hero-lede">Ethical Apple helps Chicago households make the most of what is already in the kitchen, then fills in the gaps with a calm, affordable plan.</p>
          <div class="hero-actions">
            <button class="primary-button" type="button" data-action="go-setup">Build my grocery plan ${m.arrow}</button>
            <a class="secondary-button" href="#how-it-works">See how it works ${m.arrow}</a>
          </div>
          <p class="hero-note">${m.check} A sample plan in about two minutes</p>
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
  </div>`}function Y(){const e=n.form;return`<div class="screen-in ea-ref">
    ${I("setup")}
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
            <div class="field"><label for="budget">Budget in dollars</label><input id="budget" name="budget" type="number" min="1" step="1" value="${e.budget}" required aria-describedby="budget-help"><small id="budget-help">A weekly grocery target.</small></div>
            <div class="field"><label for="household">Household size</label><input id="household" name="household" type="number" min="1" step="1" value="${e.household}" required></div>
            <div class="field"><label for="days">Days to cover</label><input id="days" name="days" type="number" min="1" max="14" step="1" value="${e.days}" required></div>
          </div>
            <div class="field"><label for="on-hand">What’s already on hand?</label><input id="on-hand" name="onHand" type="text" value="${g(e.onHand)}" placeholder="rice, beans, frozen spinach"><small>Separate ingredients with commas. We will try to build around them.</small></div>
          <hr class="form-divider">
          <p class="form-section-label">The way you like to eat</p>
          <div class="field"><label for="diet">Dietary preference</label><select id="diet" name="diet"><option ${e.diet==="No restrictions"?"selected":""}>No restrictions</option><option ${e.diet==="Vegetarian"?"selected":""}>Vegetarian</option></select></div>
          <div class="field"><label for="location">Chicago ZIP or address <span style="font-weight:400;color:var(--muted)">(optional)</span></label><input id="location" name="location" type="text" value="${g(e.location)}" placeholder="60647 or your neighborhood"><small>Reserved for a future real-distance feature. It does not affect this sample plan.</small></div>
          <div class="form-bottom"><button class="back-button" type="button" data-action="home">← Back to home</button><button class="primary-button" type="submit">Build My Plan ${m.arrow}</button></div>
        </form>
        <aside class="panel setup-aside">
          <div class="aside-kicker">A gentle nudge</div>
          <h2>Good planning starts with what is already there.</h2>
          <p>We keep the list focused, so your budget has room for the things that make a meal yours.</p>
          <ul class="aside-list"><li>${m.check}<span>Overlapping ingredients, fewer one-off buys</span></li><li>${m.check}<span>Simple meals you can remix through the week</span></li><li>${m.check}<span>A list that is clear at the store</span></li></ul>
        </aside>
      </div>
    </main>
  </div>`}let $=null,L=null;function x(){const e=JSON.stringify(n.form);if($&&L===e)return $;const t=R({budget:Math.max(1,Number(n.form.budget)||v.budget),householdSize:Math.max(1,Number(n.form.household)||v.household),days:Math.min(14,Math.max(1,Number(n.form.days)||v.days)),onHandIds:N(n.form.onHand),vegetarianOnly:n.form.diet==="Vegetarian"});return $=t,L=e,t}function z(){const e=x();return`<div class="screen-in ea-ref">
    ${I("overview")}
    <main class="app-main">
      <div class="plan-summary">
        <div class="page-heading"><div class="section-kicker">Your grocery and meal plan</div><h1>A week with a little more ease.</h1><p>${n.form.days} ${n.form.days==1?"day":"days"} of meals for ${n.form.household} ${n.form.household==1?"person":"people"}, shaped around your ${g(n.form.diet.toLowerCase())} preferences and what is already in the kitchen.</p></div>
        <div class="summary-meta">Estimate ${k(e.totalCost)} · budget ${k(n.form.budget)}</div>
      </div>
      ${e.infeasible?`<div class="budget-warning" role="alert">${m.info}<div><strong>Heads up:</strong> ${g(e.infeasibleReason)}</div></div>`:""}
      <div class="plan-layout">
        <section class="panel meal-panel" aria-labelledby="meals-title">
          <div class="panel-heading"><h2 id="meals-title">Meals for the week</h2><span>${e.meals.length} selected</span></div>
          <div class="meal-stack">${e.meals.map((t,s)=>`<article class="day-meal"><div class="day-label">Day ${s+1}</div><div><h3>${g(t.name)}</h3><p>${g(t.note||"")}.</p></div></article>`).join("")}</div>
        </section>
        <section class="panel shopping-panel" aria-labelledby="shopping-title">
          <div class="panel-heading"><h2 id="shopping-title">Shopping list</h2><span>illustrative estimate</span></div>
          <table class="shopping-table">
            <caption>Ingredients are grouped into a short list; pantry matches are treated as already covered.</caption>
            <thead><tr><th scope="col">Item</th><th scope="col">Quantity</th><th scope="col">Estimated cost</th></tr></thead>
            <tbody>${e.shoppingList.map(t=>`<tr><td>${g(t.name)}${t.pantryMatch?" <small>(on hand)</small>":""}</td><td>${g(t.quantity)}</td><td>${k(t.estimatedCost)}</td></tr>`).join("")}</tbody>
            <tfoot><tr><td colspan="2">Estimated shopping total</td><td>${k(e.totalCost)}</td></tr></tfoot>
          </table>
          <p class="estimate-disclosure">${m.info}<span>Prices are illustrative estimates for planning, not live pricing or store quotes. Your actual total may differ.</span></p>
        </section>
      </div>
       <div class="flow-actions"><button class="back-button" type="button" data-action="edit-plan">← Back to form</button><button class="primary-button" type="button" data-action="groceries">Compare where to shop ${m.arrow}</button></div>
    </main>
  </div>`}function K(){const e=x(),t=e.totalCost,s=[{key:"cost",title:"Lowest Grocery Cost",detail:"Put the lowest estimated basket first."},{key:"distance",title:"Closest Store",detail:"Sort by placeholder distance."},{key:"one-stop",title:"One-Stop Shopping",detail:"Favor a broader sample-list fit."},{key:"balanced",title:"Balance of Price and Distance",detail:"Weigh estimated cost and placeholder distance."}],r=j(e.shoppingList),a=H(r,n.storeSort),o=e.shoppingList.filter(i=>!i.pantryMatch).length;return`<div class="screen-in ea-ref">
    ${I("groceries")}
    <main class="app-main">
      <div class="comparison-intro">
        <div class="page-heading"><div class="section-kicker">Your next step</div><h1>Compare where to shop.</h1><p>Choose what matters most and see sample grocery options sorted around your ${k(t)} plan estimate.</p></div>
      </div>
      <section class="sort-options" role="group" aria-label="Sort store results">
        ${s.map(i=>`<button class="sort-option ${n.storeSort===i.key?"sort-option--active":""}" type="button" data-store-sort="${i.key}" aria-pressed="${n.storeSort===i.key}">
          <span class="sort-option__check" aria-hidden="true">${n.storeSort===i.key?m.check:""}</span>
          <span class="sort-option__copy"><strong>${g(i.title)}</strong><small>${g(i.detail)}</small></span>
        </button>`).join("")}
      </section>
      <section class="store-results" aria-labelledby="store-results-title">
        <div class="store-results__heading"><div><div class="section-kicker">Sample results</div><h2 id="store-results-title">Your options, sorted</h2></div><span>${a.length} example store types</span></div>
        <div class="store-results__list" aria-live="polite">
          ${a.map((i,l)=>`<article class="store-result ${l===0?"store-result--top":""}">
            <div class="store-result__identity"><span class="store-result__eyebrow">${l===0?"Top match for this sort":"Illustrative store type"}</span><h3>${g(i.name)}</h3><p>${g(i.detail)}</p></div>
            <div class="store-result__metric"><span>Basket estimate</span><strong>${k(i.estimate)}</strong></div>
            <div class="store-result__metric"><span>Distance</span><strong>${i.distance.toFixed(1)} mi</strong><small>placeholder</small></div>
            <div class="store-result__metric"><span>Sample list fit</span><strong>${i.coveredItems} of ${o}</strong><small>placeholder</small></div>
          </article>`).join("")}
        </div>
      </section>
      <div class="comparison-footer">
        <p class="distance-disclosure">${m.info}<span>Distances are placeholders for now. Starting in Version 2, they will be described as approximate straight-line distance. Store types, list fit, and basket estimates are examples—not live retailer results. Your Chicago ZIP or address is not used here.</span></p>
        <button class="back-button" type="button" data-action="overview">← Back to plan</button>
      </div>
    </main>
  </div>`}function q(){const e=W();f.innerHTML=e==="home"?G():e==="setup"?Y():e==="overview"?z():K(),Z(),window.scrollTo({top:0,behavior:"instant"})}function Z(e){f.querySelectorAll('[data-action="go-setup"]').forEach(s=>s.addEventListener("click",()=>w("setup"))),f.querySelectorAll('[data-action="home"]').forEach(s=>s.addEventListener("click",()=>w("home"))),f.querySelectorAll('[data-action="overview"]').forEach(s=>s.addEventListener("click",()=>w("overview"))),f.querySelectorAll('[data-action="groceries"]').forEach(s=>s.addEventListener("click",()=>w("groceries"))),f.querySelectorAll('[data-action="edit-plan"]').forEach(s=>s.addEventListener("click",()=>w("setup"))),f.querySelectorAll('[data-action="print"]').forEach(s=>s.addEventListener("click",()=>window.print())),f.querySelectorAll('[data-action="start-over"]').forEach(s=>s.addEventListener("click",()=>{n.form={...v},n.storeSort="cost",$=null,w("home")})),f.querySelectorAll("[data-store-sort]").forEach(s=>s.addEventListener("click",()=>{n.storeSort=s.dataset.storeSort,q(),f.querySelector(`[data-store-sort="${n.storeSort}"]`)?.focus()}));const t=f.querySelector("#setup-form");t&&t.addEventListener("submit",s=>{s.preventDefault();const r=new FormData(t);n.form={budget:Math.max(1,Number(r.get("budget"))||v.budget),household:Math.max(1,Number(r.get("household"))||v.household),days:Math.min(14,Math.max(1,Number(r.get("days"))||v.days)),onHand:String(r.get("onHand")||"").trim(),diet:String(r.get("diet")||v.diet),location:String(r.get("location")||"").trim()},n.storeSort="cost",$=null,w("overview")})}window.addEventListener("hashchange",q);q();
