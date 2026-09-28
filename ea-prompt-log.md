# Ethical Apple — Prompt Log

Every prompt Kendra sent while directing this project's build, logged verbatim in order, to show build control (Fluency/Control dimensions of the Week 3 Phase 1 gate). Additional structure/formatting to be added later per Kendra's direction.

---

### 1
2026-09-25, 14:17 CT

> New Week 3 reading and project. This is going to be an all week build and I really want to pull out more creativity: [attached Week 3 Day 1 reading + Selected_folders.txt]

### 2
2026-09-25

> Continue from where you left off.

### 3 — Clarifying question responses
2026-09-25

> Question: For the Phase 1 project's real problem, where do you want to point it? → **Revisit Ethical Apple**
> Question: What form do you want the solution to take? → **I want it to include option 1 and 2 together if i can.**

### 4
2026-09-25, 14:36 CT

> I want you to keep track of every prompt that I send through our conversations in the Next Chapter folder, in a new file called "gate1-week3-full-prompts.md".

### 5
2026-09-25, 14:45 CT

> We are going to change direction for this project: I think food affordability is a better direction for a small project than trying to solve food access broadly. The research backs up the problem: USDA found affordability was the most common barrier to a healthy diet among SNAP participants, reported by 61% of participants surveyed. Feeding America's 2026 research similarly found 68% of surveyed neighbors wanted to eat healthier but couldn't currently afford to.

### 6
2026-09-25, 14:46 CT

> Problem statement: People experiencing food insecurity can find information about food pantries and assistance programs, but determining where they can realistically get affordable food when they need it can still require searching multiple resources, checking hours and eligibility requirements, calling organizations, and traveling without knowing what food will actually be available.
> The problem I want to solve is the gap between knowing that food resources exist and being able to quickly determine which available option can meet a person's immediate food needs, budget, location, and circumstances.

### 7
2026-09-25, 14:47 CT

> User journey: Let's follow one user
> Imagine Maria, who has two children.
> It's Tuesday afternoon. She has $35 available for groceries until Friday. She already has rice, cooking oil, and a few basic seasonings.
> Her question isn't really:
> "Where is the nearest grocery store?"
> It's:
> "What can I buy with $35 that will give my family enough meals until Friday?"
> Her current journey might look something like:
> $35 left → figure out meals → figure out ingredients → estimate prices → decide where to shop → remove things that exceed the budget → make substitutions → shop → hope the total isn't higher than expected.
> There are several pain points hidden in that journey.
> She has to mentally translate money → groceries → meals → number of people → number of days.
> Prices make that difficult. Transportation and store accessibility can complicate it further; USDA specifically identifies distance and transportation as factors affecting which food retailers households can reach and the time and cost required to shop. [Economic Research Service](https://www.ers.usda.gov/data-products/food-access-research-atlas?utm_source=chatgpt.com)
> And budgeting isn't a hypothetical problem. Feeding America's 2025 survey found that 80% of surveyed neighbors had purchased cheaper, less nutritious food because of high prices, while 52% reported running out of food before having money to purchase more at some point during the previous year.

### 8
2026-09-25, 14:48 CT

> updated project problem statement: People shopping on very limited grocery budgets often have difficulty determining how to turn the money they have available into enough food and meals to last until they can shop again.
> Planning requires balancing budget, household size, number of days, existing food at home, dietary needs, nutrition, and grocery prices. This can make an already stressful situation more complicated and can lead to overspending, food waste, or purchasing food that does not stretch far enough.
> The problem I want to explore is how a simple digital tool could help someone turn a limited grocery budget into a practical food and meal plan.

### 9
2026-09-25, 14:50 CT

> Implement the assistant Built into the site's own code

### 10 — Clarifying question responses
2026-09-25

> Question: How should the assistant's meal-planning logic actually be powered? → **Call an LLM API from your backend**
> Question: What's your stack for building the site itself? → **React + Node/Express (like The Dietrich Files)**

### 11
2026-09-25, 14:55 CT

> Yes. That makes the concept more useful, but it also introduces what may be the hardest part of the project: getting reliable, current, store-level grocery prices.
> I'd evolve the core question to:
> How might we help Chicago residents with limited grocery budgets figure out what food they can afford, plan meals that fit their budget, and identify nearby stores where they can purchase the groceries they need at lower prices?
> The ideal user journey could be:
> 1. Tell us your situation.
> "I have $40 for groceries, need to feed two people for five days, and already have rice, eggs, and peanut butter."
> 2. Tell us roughly where you are.
> ZIP code or neighborhood would probably be enough for an MVP.
> 3. Build a plan.
> The tool suggests meals and creates a shopping list designed around ingredients that can be reused.
> 4. Compare nearby shopping options.
> Instead of merely saying "buy chicken," it could show something like:
> Option A — Store 1
> Estimated basket: $37.42
> 1.2 miles away
> Option B — Store 2
> Estimated basket: $34.87
> 2.8 miles away
> Option C — Mix stores
> Estimated basket: $31.65
> Requires visiting two stores
> 5. Let the user decide what matters.
> This is important because cheapest isn't necessarily best. Saving $2.50 may not make sense if someone needs to take two buses to another grocery store.
> So eventually we could let the person choose:
> Lowest total cost / Closest store / One-stop shopping / Best balance of price + distance
> That becomes a genuinely interesting optimization problem rather than just an AI meal planner.
> But I'd split the project into two layers
> The application itself is very achievable. We can build the budgeting logic, meal recommendations, shopping list, location input, store comparison interface, substitutions, and calculations.
> The difficult part is:
> Where do Store A's current prices come from?
> We shouldn't have an AI simply guess that Aldi has eggs for $2.39 and Walmart has them for $2.72. Prices can vary by location and change frequently.
> So before committing to the feature, I'd investigate the Chicago grocery chains we'd potentially support—perhaps Aldi, Jewel-Osco, Walmart, Mariano's, Target, Food 4 Less, etc.—and determine what legitimate pricing data is actually accessible: APIs, online-store data, weekly ads, datasets, or another source.
> Depending on what we find, the MVP could be deliberately small. For example:
> Chicago only → one ZIP code/neighborhood → 2–3 stores → 15–25 common staple foods → price comparison + budget planner.
> That is much more realistic for a project than trying to become a Chicago-wide grocery-price engine immediately.
> And it still lets you demonstrate the bigger vision:
> Today: Compare a small set of staples at participating/sample stores.
> Future: Real-time pricing across Chicago grocery stores.
> I think our next investigation should be the data, before we design more features. We should find out: Can we actually obtain current grocery prices for Chicago-area stores, from where, how frequently, and under what limitations? That answer will determine what's realistic for your project.

### 12
2026-09-28, 11:37 CT

> I would describe the project scope like this:
> Build a front-end prototype in HTML, CSS, and JavaScript that helps Chicago users turn a limited grocery budget into an affordable meal and shopping plan, then compares estimated prices across a small set of nearby grocery stores.
> That scope is believable for one person and still leaves obvious future expansion paths: live APIs, more stores, real location data, user accounts, saved plans, and eventually an AI assistant.
> A good MVP could be only 4 screens/states: landing page → budget form → grocery/meal plan → store comparison. That's enough to feel like a complete product without becoming too large.

### 13 — Clarifying question response
2026-09-28

> Question: How should the meal/grocery plan screen generate its plan from the budget form inputs? → **Rule-based JS logic**

### 14
2026-09-28, 11:42 CT

> Can i build this in HTML, CSS, and JS? My project needs to make sense and be something that I could build on my own as well, and I need to demonstrate control of the build with AI

### 15
2026-09-28, 11:49 CT

> [attached screenshot of an "Ethical Apple" store-comparison mockup showing four priority-option cards: "01 Lowest Grocery Cost", "02 Closest Store", "03 One-Stop Shopping", "04 Balance of Price and Distance"]
> These need to be added as well: Compare where to shop
> Compare supported nearby stores based on estimated grocery cost and distance so you can decide which option works for you.

### 16
2026-09-28, 11:54 CT

> I will create my github repo and add it to the folder, then I will let you know. I want to make an mvp and scope plans toether and I will also need a prompt log kept in the file. Wait and I will direct you to add those in a moment

### 17
2026-09-28, 11:59 CT

> I actually want to add an api.

### 18 — Clarifying question response
2026-09-28

> Question: Which capability do you want an API to power? → **Real location/distance (maps API)**

### 19
2026-09-28, 12:20 CT

> API purpose: provide real-world location data for nearby grocery stores.
> App logic: all affordability and recommendation decisions are handled by my own JavaScript.

### 20
2026-09-28, 12:24 CT

> Yes — I'd go with Mapbox for this build.
> Your reasoning is solid, and the current docs support the important part: Mapbox public tokens are explicitly intended for client-side applications, and Mapbox recommends creating a dedicated public token with only the needed scopes plus URL restrictions. [Mapbox]
> Google does have a client-side geocoder through the Maps JavaScript API, but its Geocoding API requires billing, and Google specifically warns against calling the newer Geocoding REST API directly from client-side JavaScript because of key-abuse risk. [Google for Developers]
> For Ethical Apple, I'd define the architecture this way:
> User enters Chicago ZIP code or neighborhood
>         ↓
> Mapbox geocodes that input
>         ↓
> Mapbox geocodes the addresses of your supported stores
>         ↓
> Your JavaScript receives latitude + longitude
>         ↓
> Your Haversine function calculates straight-line distance
>         ↓
> Your own grocery dataset supplies estimated basket prices
>         ↓
> Your own logic determines:
> • lowest grocery cost
> • closest store
> • one-stop option
> • balance of price + distance
> That separation is excellent for your assignment because you can point to exactly what the API does and exactly what you built.
> I'd also intentionally call the result "approximate distance" or "straight-line distance", not "travel distance." For example:
> 1.4 miles away — approximate straight-line distance
> That prevents the interface from implying that you're calculating driving, walking, or CTA routes when you aren't.
> And your project documentation gets a very clean explanation:
> Why I chose Mapbox: I needed real location data without adding a backend. Mapbox supports restricted public tokens for browser applications. I use the API only to convert locations into coordinates. I wrote the distance calculation and store-comparison logic myself.
> One slight adjustment to what you pasted: I wouldn't describe a public token as completely "safe to expose." It is designed to be present in client-side code, but Mapbox still recommends limiting its scopes and applying URL restrictions to reduce misuse.
> So yes: Mapbox geocoding + your own Haversine calculation is the approach I'd lock in.

### 21
2026-09-28, 12:27 CT

> Here is the repo: https://github.com/kendrahartnett/ethical-apple-grocery-plan.git    it it inside the Next Chapter/projects folder

### 22
2026-09-28, 12:28 CT

> I have a frontend design from loveable that I will add

### 23
2026-09-28, 12:31 CT

> I need you to create a file in the project called: "ea-prompt-log.md" and keep track of all of my project prompts to show my build control. I will have additional structure for that at the end of our build

---

*This file is appended to as the build continues. Kendra will add additional structure to this log later.*
