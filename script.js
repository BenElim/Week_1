/* =========================================================
   SpendWise — Interactive Dashboard
   Decision-making, arrays + loops, DOM updates, and event
   listeners all wired together: user actions (forms, clicks)
   update the data, and the data updates the page.
   ========================================================= */

console.log("SpendWise script loaded successfully.");


/* ---------------------------------------------------------
   APPLICATION DATA
   monthlyBudget: budget-related data.
   expenseCategories: an ARRAY of expense records (not separate
   variables) so we can loop over it as records get added.
   --------------------------------------------------------- */

let monthlyBudget = 2320.00;

const expenseCategories = [
  { name: "Food",          spent: 420.00, budget: 500.00 },
  { name: "Transport",     spent: 180.00, budget: 150.00 },
  { name: "Rent",          spent: 950.00, budget: 950.00 },
  { name: "Entertainment", spent: 95.00,  budget: 120.00 },
  { name: "Savings",       spent: 300.00, budget: 400.00 },
  { name: "Utilities",     spent: 210.00, budget: 200.00 }
];

// Which category card is currently selected/highlighted.
let selectedCategoryName = null;


/* ---------------------------------------------------------
   CALCULATIONS (loops + reusable functions)
   --------------------------------------------------------- */

function calculateTotalSpent(expenses) {
  let total = 0;
  for (let i = 0; i < expenses.length; i++) {
    total += expenses[i].spent;
  }
  return total;
}

function calculateRemainingBalance(budget, totalSpent) {
  return budget - totalSpent;
}

// DECISION MAKING: label a single category based on how its
// spending compares to its budget.
function getBudgetStatus(spent, budget) {
  if (spent > budget) {
    return "over";
  } else if (spent === budget) {
    return "limit";
  } else {
    return "under";
  }
}

function getStatusLabel(status) {
  if (status === "over") {
    return "Over budget";
  } else if (status === "limit") {
    return "At limit";
  } else {
    return "On track";
  }
}

// Loop through every category and collect the ones that are
// over budget — used for both the alert list and the banner.
function findOverBudgetCategories(expenses) {
  const overBudget = [];
  for (let i = 0; i < expenses.length; i++) {
    if (expenses[i].spent > expenses[i].budget) {
      overBudget.push(expenses[i]);
    }
  }
  return overBudget;
}

function formatCurrency(amount) {
  const sign = amount < 0 ? "-" : "";
  return `${sign}$${Math.abs(amount).toFixed(2)}`;
}


/* ---------------------------------------------------------
   DOM MANIPULATION — render data onto the page
   --------------------------------------------------------- */

function renderSummary(budget, totalSpent, remaining) {
  document.getElementById("total-spent-value").textContent = formatCurrency(totalSpent);
  document.getElementById("monthly-budget-value").textContent = formatCurrency(budget);

  const remainingEl = document.getElementById("remaining-value");
  remainingEl.textContent = formatCurrency(remaining);

  // DECISION MAKING: color the remaining balance based on sign.
  remainingEl.classList.remove("summary-value--positive", "summary-value--negative");
  remainingEl.classList.add(remaining >= 0 ? "summary-value--positive" : "summary-value--negative");
}

function renderStatusBanner(budget, totalSpent, remaining) {
  const banner = document.getElementById("status-banner");
  const overBudgetCount = findOverBudgetCategories(expenseCategories).length;

  banner.classList.remove("status-banner--good", "status-banner--warning", "status-banner--over");
  banner.classList.add("status-banner--visible");

  // DECISION MAKING: pick the right message + style for the
  // current numbers.
  if (remaining < 0) {
    banner.textContent = `You're ${formatCurrency(Math.abs(remaining))} over your monthly budget. ${overBudgetCount} ${overBudgetCount === 1 ? "category is" : "categories are"} driving it.`;
    banner.classList.add("status-banner--over");
  } else if (totalSpent >= budget * 0.9) {
    banner.textContent = `Heads up — you've used ${Math.round((totalSpent / budget) * 100)}% of your monthly budget.`;
    banner.classList.add("status-banner--warning");
  } else {
    banner.textContent = `You're on track this month, with ${formatCurrency(remaining)} left to spend.`;
    banner.classList.add("status-banner--good");
  }
}

function renderAlerts(expenses) {
  const panel = document.getElementById("alerts-panel");
  const list = document.getElementById("alerts-list");

  const overBudget = findOverBudgetCategories(expenses);

  // Clear old alerts before rebuilding the list.
  list.innerHTML = "";

  if (overBudget.length === 0) {
    panel.hidden = true;
    return;
  }

  panel.hidden = false;

  // Loop through the over-budget categories and build one <li>
  // per record.
  for (let i = 0; i < overBudget.length; i++) {
    const category = overBudget[i];
    const overage = category.spent - category.budget;

    const item = document.createElement("li");
    item.textContent = `${category.name} is ${formatCurrency(overage)} over its ${formatCurrency(category.budget)} budget.`;
    list.appendChild(item);
  }
}

function createCardElement(category) {
  const status = getBudgetStatus(category.spent, category.budget);
  const percent = Math.min((category.spent / category.budget) * 100, 100);

  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  card.dataset.status = status === "over" ? "over" : "under";
  card.dataset.categoryName = category.name;

  if (category.name === selectedCategoryName) {
    card.classList.add("is-selected");
  }

  card.innerHTML = `
    <div class="card-top">
      <span class="card-category">${category.name}</span>
      <span class="card-status">${getStatusLabel(status)}</span>
    </div>
    <span class="card-amount">${formatCurrency(category.spent)}</span>
    <span class="card-budget">of ${formatCurrency(category.budget)} budget</span>
    <div class="card-progress">
      <div class="card-progress-fill" style="width: ${percent}%;"></div>
    </div>
  `;

  return card;
}

function renderCards(expenses) {
  const grid = document.getElementById("cards-grid");

  // Clear the grid, then loop through the array and append one
  // card per record — the page always reflects what's in the array.
  grid.innerHTML = "";
  for (let i = 0; i < expenses.length; i++) {
    grid.appendChild(createCardElement(expenses[i]));
  }
}

// The single function that keeps data and page in sync. Call
// this any time expenseCategories or monthlyBudget changes.
function updateDashboard() {
  const totalSpent = calculateTotalSpent(expenseCategories);
  const remaining = calculateRemainingBalance(monthlyBudget, totalSpent);

  renderSummary(monthlyBudget, totalSpent, remaining);
  renderStatusBanner(monthlyBudget, totalSpent, remaining);
  renderAlerts(expenseCategories);
  renderCards(expenseCategories);
}


/* ---------------------------------------------------------
   DATA-MODIFYING ACTIONS
   --------------------------------------------------------- */

function addExpense(name, amount, categoryName, newCategoryBudget) {
  // Look for an existing category with this name (case-insensitive).
  let existingCategory = null;
  for (let i = 0; i < expenseCategories.length; i++) {
    if (expenseCategories[i].name.toLowerCase() === categoryName.toLowerCase()) {
      existingCategory = expenseCategories[i];
      break;
    }
  }

  if (existingCategory) {
    existingCategory.spent += amount;
  } else {
    // Brand new category — use the budget the user entered, or
    // fall back to the expense amount itself.
    expenseCategories.push({
      name: categoryName,
      spent: amount,
      budget: newCategoryBudget > 0 ? newCategoryBudget : amount
    });
  }

  console.log(`Added expense "${name}": ${formatCurrency(amount)} to ${categoryName}.`);
  updateDashboard();
}

function updateMonthlyBudget(newBudget) {
  monthlyBudget = newBudget;
  console.log(`Monthly budget updated to ${formatCurrency(newBudget)}.`);
  updateDashboard();
}


/* ---------------------------------------------------------
   EVENT LISTENERS — respond to user interactions
   --------------------------------------------------------- */

// Add Expense form
const expenseForm = document.getElementById("expense-form");
const categorySelect = document.getElementById("expense-category-select");
const newCategoryField = document.getElementById("new-category-field");
const newCategoryBudgetField = document.getElementById("new-category-budget-field");

// DECISION MAKING: only show the "new category" fields when the
// user picks "Other" from the dropdown.
categorySelect.addEventListener("change", function () {
  const isNewCategory = categorySelect.value === "__new__";
  newCategoryField.hidden = !isNewCategory;
  newCategoryBudgetField.hidden = !isNewCategory;
});

expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const nameInput = document.getElementById("expense-name-input");
  const amountInput = document.getElementById("expense-amount-input");
  const newCategoryNameInput = document.getElementById("new-category-name-input");
  const newCategoryBudgetInput = document.getElementById("new-category-budget-input");

  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);

  const isNewCategory = categorySelect.value === "__new__";
  const categoryName = isNewCategory
    ? newCategoryNameInput.value.trim()
    : categorySelect.value;
  const newCategoryBudget = parseFloat(newCategoryBudgetInput.value);

  // Basic validation — bail out without touching the data if
  // anything required is missing or invalid.
  if (!name || isNaN(amount) || amount <= 0 || !categoryName) {
    alert("Please enter a valid expense name, amount, and category.");
    return;
  }

  addExpense(name, amount, categoryName, newCategoryBudget);

  // Reset the form back to a clean state.
  expenseForm.reset();
  newCategoryField.hidden = true;
  newCategoryBudgetField.hidden = true;
});

// Update Budget form
const budgetForm = document.getElementById("budget-form");

budgetForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const budgetInput = document.getElementById("budget-input");
  const newBudget = parseFloat(budgetInput.value);

  if (isNaN(newBudget) || newBudget <= 0) {
    alert("Please enter a valid budget amount.");
    return;
  }

  updateMonthlyBudget(newBudget);
});

// Card selection — event delegation, since cards are re-created
// every time the dashboard re-renders.
const cardsGrid = document.getElementById("cards-grid");

cardsGrid.addEventListener("click", function (event) {
  const clickedCard = event.target.closest(".card");
  if (!clickedCard) {
    return;
  }

  const categoryName = clickedCard.dataset.categoryName;

  // Toggle: clicking the already-selected card deselects it.
  selectedCategoryName = selectedCategoryName === categoryName ? null : categoryName;

  renderCards(expenseCategories);
});


/* ---------------------------------------------------------
   INITIAL RENDER
   --------------------------------------------------------- */

updateDashboard();