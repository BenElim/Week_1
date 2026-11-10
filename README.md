# SpendWise — Dashboard Shell + JavaScript Foundation

The SpendWise capstone project: a static, responsive dashboard shell built with modern CSS (Grid + Flexbox), now with a JavaScript foundation layered on top that processes budget and expense data.

This is a separate project from the earlier weekly "Budget Tracker" exercise — it's a new dashboard interface (sidebar + header + card grid) rather than a continuation of that single-page form/table layout.

## Files

- `index.html` — page markup
- `style.css` — all styling
- `script.js` — application logic (variables, input, calculations, functions)
- `README.md` — this file

## Structure

- **Sidebar** (`.sidebar`) — brand mark, primary nav (Dashboard/Expenses/Reports/Budgets/Settings), and a user snippet pinned to the bottom
- **Header** (`.dashboard-header`) — page title + subtitle on the left, a date range pill and user avatar on the right
- **Main** (`.dashboard-main`) — a live summary bar (total spent / budget / remaining), a status banner, a "Monthly Budget" form, an "Add Expense" form, an over-budget alerts list, and a grid of category cards — all rendered and kept in sync by `script.js`, starting from 6 seeded categories: Food, Transport, Rent, Entertainment, Savings, Utilities

## Layout technique

- **CSS Grid** drives the overall page: `.dashboard-shell` uses `grid-template-areas` to place the sidebar (spanning both rows), header, and main content. No absolute positioning is used anywhere in the layout.
- **Flexbox** handles everything inside those regions: the header's title-vs-actions split, the sidebar's vertical stack of nav items, the summary bar's row of stats, and each card's internal stack (category name + status, amount, budget line, progress bar).

## Theme (CSS custom properties)

Defined once on `:root` and used throughout:
- `--color-brand` / `--color-brand-dark` — deep pine green (sidebar, brand mark, avatars)
- `--color-accent` — warm amber (progress highlights, focus rings)
- `--color-surface` — warm off-white (cards, header background)
- `--color-bg` — page background
- `--color-text-primary` / `--color-text-secondary` — ink / muted text
- Plus two semantic status colors (`--color-status-under`, `--color-status-over`) used for the on-track/over-budget indicators, progress bars, and card accent borders

### Dark theme (stretch goal)
`@media (prefers-color-scheme: dark)` overrides only the `:root` variables — no other rules — so the whole page re-themes automatically based on the system setting.

## Responsive behavior

A single media query at `max-width: 768px`:
- Collapses the grid to one column, stacking header → sidebar → main
- Turns the sidebar into a horizontal flex row (nav items wrap instead of stacking vertically)
- Drops the card grid to a single column

Verify it in DevTools: open the Device Toolbar (Cmd/Ctrl+Shift+M), pick a width under 768px (e.g. an iPhone preset), and confirm the sidebar goes horizontal and the cards stack.

## Micro-interactions

Each card is a real `<button type="button">` (so it's natively keyboard-focusable — no functionality is wired up yet, matching the "structure only" scope of this week). On both `:hover` and `:focus-visible` it lifts slightly (`transform: translateY(-3px)`) and gains a soft shadow, transitioning over 180ms — under the 250ms ceiling.

## JavaScript — making it interactive

`script.js` is linked with `<script src="script.js" defer></script>`. The dashboard now runs entirely on data + DOM updates, no hardcoded numbers in the HTML.

**Data (arrays, not separate variables)** — `monthlyBudget` plus `expenseCategories`, an array of `{ name, spent, budget }` records, seeded with the 6 original categories. Every add/update operates on this array.

**Decision making** — `getBudgetStatus()` labels a category On track / At limit / Over budget; `renderStatusBanner()` picks a message and color (good/warning/over) based on the remaining balance and how much of the budget is used; the category-picker form conditionally reveals "new category" fields only when "Other" is selected.

**Loops over records** — `calculateTotalSpent()`, `findOverBudgetCategories()`, `renderCards()`, and `renderAlerts()` all loop over `expenseCategories` to total spending, flag overages, and build one card/alert per record.

**DOM manipulation** — `renderSummary()`, `renderStatusBanner()`, `renderAlerts()`, and `renderCards()` write the live numbers into the page (`textContent`, `classList`, and cards built with `createElement`/template strings). Nothing is left in console-only output anymore.

**Event listeners** —
- Submitting the **Monthly Budget** form updates `monthlyBudget` and re-renders everything.
- Submitting the **Add Expense** form adds to an existing category's `spent`, or creates a brand-new category if none matches, then re-renders.
- Changing the category `<select>` shows/hides the "new category" fields.
- Clicking a card (event delegation on `#cards-grid`, since cards are rebuilt on every render) toggles a highlighted/selected state.

**The full loop**: user submits a form → an event listener validates the input and updates the `expenseCategories` array or `monthlyBudget` → `updateDashboard()` recalculates totals with loops and conditionals → the summary, banner, alerts, and cards are all re-rendered on the page.

## What's not built yet
- No persistence — the array resets to its seeded data on refresh
- No real navigation — sidebar links don't go anywhere
- No editing or deleting individual expenses yet, only adding

These come later as the capstone's functional layer is developed further.

## Live site

- **Live URL:** https://spendwise-trc.netlify.app
- **Repository:** https://github.com/BenElim/Week_1

## Deployment

SpendWise is a static site (no build step), hosted on Netlify and connected to this GitHub repository. Every push to `main` triggers an automatic redeploy.

- Build command: *(none)*
- Publish directory: `/` (repository root)

## Technologies Used

- **HTML5**: semantic page structure (`aside`, `header`, `main`, `section`, `form`) and accessible labels
- **CSS Grid**: the overall dashboard layout (sidebar, header, main content) and the responsive category card grid
- **CSS Flexbox**: layout inside the header, sidebar, summary bar, forms and each card
- **CSS custom properties**: a themed color palette on `:root`, with a dark theme via `prefers-color-scheme`
- **JavaScript (vanilla)**: arrays, loops, conditionals, DOM manipulation and event listeners
- **Git & GitHub**: version control and source hosting
- **Netlify**: static hosting with continuous deployment from GitHub

## Challenges Encountered

- **Keeping data and page in sync:** the cards were originally hardcoded HTML, so I moved them into an array and rendered them from it with a single `updateDashboard()` function.
- **Event listeners on re-rendered cards:** cards are rebuilt on every update, so listeners attached to them would be lost. I used event delegation on the card grid instead.
- **Responsive layout:** collapsing the Grid layout to one column below 768px, and turning the sidebar into a horizontal row, took several adjustments.
- **Deployment setup:** connecting GitHub to Netlify and making sure `index.html`, `style.css` and `script.js` sat at the repository root with correct relative paths.

## Lessons Learned

- Storing data in an array and generating the interface from it is much easier to maintain than editing HTML by hand.
- CSS variables make theming simple, including a dark mode that only overrides `:root`.
- Grid suits page-level layout while Flexbox suits content inside components, and they work well together.
- Validating user input before changing data prevents broken totals and empty cards.
- Pushing to GitHub triggers an automatic Netlify deploy, so small changes can go live in under a minute.
