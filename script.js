/* =========================================================
   SpendWise — JavaScript Foundation
   Variables, user input, calculations, and reusable functions
   for processing budget and expense data. No DOM manipulation
   yet — all results are logged to the console.
   ========================================================= */

console.log("SpendWise script loaded successfully.");


/* ---------------------------------------------------------
   1. STORE APPLICATION DATA
   Budget-related and expense-related variables, matching the
   category cards already shown on the dashboard.
   --------------------------------------------------------- */

// Budget-related data
const defaultMonthlyBudget = 2320.00;
let monthlyBudget = defaultMonthlyBudget;

// Expense-related data — one object per category card
const expenseCategories = [
  { name: "Food",          spent: 420.00, budget: 500.00 },
  { name: "Transport",     spent: 180.00, budget: 150.00 },
  { name: "Rent",          spent: 950.00, budget: 950.00 },
  { name: "Entertainment", spent: 95.00,  budget: 120.00 },
  { name: "Savings",       spent: 300.00, budget: 400.00 },
  { name: "Utilities",     spent: 210.00, budget: 200.00 }
];


/* ---------------------------------------------------------
   2. COLLECT USER INPUT
   Ask the user for their monthly budget and a new expense to
   log, then store the results in the variables above.
   --------------------------------------------------------- */

function collectBudgetInput() {
  const budgetInput = prompt(
    "Enter your monthly budget (numbers only):",
    defaultMonthlyBudget
  );

  const parsedBudget = parseFloat(budgetInput);

  // Fall back to the default if the user cancels or enters
  // something that isn't a valid number.
  if (!isNaN(parsedBudget) && parsedBudget > 0) {
    monthlyBudget = parsedBudget;
  } else {
    monthlyBudget = defaultMonthlyBudget;
    console.log("No valid budget entered — using the default budget.");
  }
}

function collectNewExpenseInput() {
  const expenseName = prompt("New expense — name:", "Coffee");
  const expenseAmountInput = prompt("New expense — amount:", "4.50");
  const expenseCategoryLabel = prompt("New expense — category:", "Food");

  const expenseAmount = parseFloat(expenseAmountInput);

  // Only add the expense if the person actually entered a name
  // and a valid, positive amount.
  if (expenseName && !isNaN(expenseAmount) && expenseAmount > 0) {
    expenseCategories.push({
      name: expenseCategoryLabel || "Other",
      spent: expenseAmount,
      budget: expenseAmount, // no existing budget line for a new category
      isNewEntry: true,
      label: expenseName
    });
    console.log(`Added new expense: ${expenseName} ($${expenseAmount.toFixed(2)})`);
  } else {
    console.log("No new expense added — input was cancelled or invalid.");
  }
}


/* ---------------------------------------------------------
   3 & 4. REUSABLE FUNCTIONS + BUDGET CALCULATIONS
   --------------------------------------------------------- */

// Adds up the "spent" amount across every category/expense.
function calculateTotalSpent(expenses) {
  let total = 0;
  for (let i = 0; i < expenses.length; i++) {
    total += expenses[i].spent;
  }
  return total;
}

// Budget minus total spent — can be negative if overspent.
function calculateRemainingBalance(budget, totalSpent) {
  return budget - totalSpent;
}

// Returns a simple status label for a single category.
function getBudgetStatus(spent, budget) {
  if (spent > budget) {
    return "Over budget";
  } else if (spent === budget) {
    return "At limit";
  } else {
    return "On track";
  }
}

// Small helper to keep console output formatted consistently.
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}


/* ---------------------------------------------------------
   5. DISPLAY RESULTS IN THE CONSOLE
   --------------------------------------------------------- */

function logCategorySummary(expenses) {
  console.log("----- Spending by Category -----");
  expenses.forEach((category) => {
    const status = getBudgetStatus(category.spent, category.budget);
    const label = category.label
      ? `${category.name} (${category.label})`
      : category.name;
    console.log(
      `${label}: ${formatCurrency(category.spent)} of ${formatCurrency(category.budget)} — ${status}`
    );
  });
}

function logOverallSummary(budget, totalSpent, remaining) {
  console.log("----- Monthly Summary -----");
  console.log(`Monthly Budget: ${formatCurrency(budget)}`);
  console.log(`Total Spent:    ${formatCurrency(totalSpent)}`);
  console.log(
    remaining >= 0
      ? `Remaining Balance: ${formatCurrency(remaining)}`
      : `Remaining Balance: -${formatCurrency(Math.abs(remaining))} (over budget)`
  );
}


/* ---------------------------------------------------------
   RUN THE APP
   --------------------------------------------------------- */

function initSpendWise() {
  collectBudgetInput();
  collectNewExpenseInput();

  const totalSpent = calculateTotalSpent(expenseCategories);
  const remainingBalance = calculateRemainingBalance(monthlyBudget, totalSpent);

  logCategorySummary(expenseCategories);
  logOverallSummary(monthlyBudget, totalSpent, remainingBalance);
}

initSpendWise();