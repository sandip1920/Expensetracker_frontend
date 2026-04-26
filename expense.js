// Store current expenses globally for click handler
window.currentExpenses = [];

document.addEventListener("DOMContentLoaded", () => {
const loadHardcodedBtn = document.getElementById("loadHardcodedBtn");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const removeExpenseBtn = document.getElementById("removeExpenseBtn");
const expenseList = document.getElementById("expenseList");
const statusMessage = document.getElementById("statusMessage");
const addExpenseModal = document.getElementById("addExpenseModal");
const removeExpenseModal = document.getElementById("removeExpenseModal");
const expenseDetailModal = document.getElementById("expenseDetailModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const closeRemoveModalBtn = document.getElementById("closeRemoveModalBtn");
const closeDetailModalBtn = document.getElementById("closeDetailModalBtn");
const closeDetailBtn = document.getElementById("closeDetailBtn");
const cancelBtn = document.getElementById("cancelBtn");
const cancelRemoveBtn = document.getElementById("cancelRemoveBtn");
const addExpenseForm = document.getElementById("addExpenseForm");
const removeExpenseForm = document.getElementById("removeExpenseForm");
const expenses = [
{ id: 1, category: "Food", title: "Zakaria Street", amount: 3000, date: "2026-03-23" },
{ id: 2, category: "Electronics", title: "Phone", amount: 20000, date: "2026-03-23" },
{ id: 3, category: "Entertainment", title: "Movie Tickets", amount: 500, date: "2026-03-23" },
{ id: 4, category: "Transportation", title: "Gas", amount: 1000, date: "2026-03-23" },
{ id: 5, category: "Utilities", title: "Electricity Bill", amount: 1500, date: "2026-03-23" },
{ id: 6, category: "Health", title: "Doctor Visit", amount: 2500, date: "2026-03-23" },
{ id: 7, category: "Education", title: "Books", amount: 1200, date: "2026-03-23" },
{ id: 8, category: "Clothing", title: "New Shirt", amount: 800, date: "2026-03-23" },
{ id: 9, category: "Travel", title: "Weekend Trip", amount: 5000, date: "2026-03-23" },
{ id: 10, category: "Miscellaneous", title: "Gift for Friend", amount: 700, date: "2026-03-23" }
];

loadHardcodedBtn.addEventListener("click", () => {
statusMessage.textContent = "Loaded sample data successfully.";
window.currentExpenses = expenses;
renderExpenses(expenses);
});

// Event delegation for expense card clicks
expenseList.addEventListener("click", (e) => {
const card = e.target.closest(".expense-card");
if (card && window.currentExpenses.length > 0) {
// Find which card was clicked
const cardIndex = Array.from(expenseList.children).indexOf(card);
if (cardIndex >= 0 && cardIndex < window.currentExpenses.length) {
const expense = window.currentExpenses[cardIndex];
// Update modal content
document.getElementById("detailTitle").textContent = expense.title;
document.getElementById("detailCategory").textContent = expense.category;
document.getElementById("detailAmount").textContent = `₹ ${expense.amount}`;
document.getElementById("detailDate").textContent = expense.date;
// Show detail modal
expenseDetailModal.classList.remove("hidden");
}
}
});
// Modal functionality
addExpenseBtn.addEventListener("click", () => {
addExpenseModal.classList.remove("hidden");
});
closeModalBtn.addEventListener("click", () => {
addExpenseModal.classList.add("hidden");
addExpenseForm.reset();
});
cancelBtn.addEventListener("click", () => {
addExpenseModal.classList.add("hidden");
addExpenseForm.reset();
});
// Close modal when clicking outside the form
addExpenseModal.addEventListener("click", (e) => {
if (e.target === addExpenseModal) {
addExpenseModal.classList.add("hidden");
addExpenseForm.reset();
}
});
// Form submission
addExpenseForm.addEventListener("submit", async (e) => {
e.preventDefault();
const formData = new FormData(addExpenseForm);
const newExpense = {
title: formData.get("title"),
amount: parseFloat(formData.get("amount")),
category: formData.get("category"),
date: new Date().toISOString().split('T')[0]
};

try {
await addExpenseToAPI(newExpense);
statusMessage.textContent = "Expense added successfully!";
// Fetch updated list
const data = await getExpensesFromAPI();
window.currentExpenses = data;
renderExpenses(data);
} catch (error) {
statusMessage.textContent = "Failed to add expense.";
console.error(error);
}

addExpenseModal.classList.add("hidden");
addExpenseForm.reset();
});

// Remove expense modal functionality
removeExpenseBtn.addEventListener("click", () => {
removeExpenseModal.classList.remove("hidden");
});

closeRemoveModalBtn.addEventListener("click", () => {
removeExpenseModal.classList.add("hidden");
removeExpenseForm.reset();
});

cancelRemoveBtn.addEventListener("click", () => {
removeExpenseModal.classList.add("hidden");
removeExpenseForm.reset();
});

removeExpenseModal.addEventListener("click", (e) => {
if (e.target === removeExpenseModal) {
removeExpenseModal.classList.add("hidden");
removeExpenseForm.reset();
}
});

// Expense detail modal functionality
closeDetailModalBtn.addEventListener("click", () => {
expenseDetailModal.classList.add("hidden");
});

closeDetailBtn.addEventListener("click", () => {
expenseDetailModal.classList.add("hidden");
});

expenseDetailModal.addEventListener("click", (e) => {
if (e.target === expenseDetailModal) {
expenseDetailModal.classList.add("hidden");
}
});

// Remove expense form submission
removeExpenseForm.addEventListener("submit", async (e) => {
e.preventDefault();
const formData = new FormData(removeExpenseForm);
const expenseId = parseInt(formData.get("id"));
const expenseTitle = formData.get("title").trim();

try {
await removeExpenseFromAPI(expenseId, expenseTitle);
statusMessage.textContent = "Expense removed successfully!";
// Fetch updated list
const data = await getExpensesFromAPI();
window.currentExpenses = data;
renderExpenses(data);
} catch (error) {
statusMessage.textContent = "Failed to remove expense.";
console.error(error);
}

removeExpenseModal.classList.add("hidden");
removeExpenseForm.reset();
});

});

function renderExpenses(data) {
  const expenseList = document.getElementById("expenseList");
  expenseList.innerHTML = "";
  
  if (!data || data.length === 0) {
    expenseList.innerHTML = "<p style='text-align: center; padding: 20px; color: #6b7280; grid-column: 1/-1;'>No expenses found.</p>";
    return;
  }
  
  data.forEach((exp) => {
    const card = document.createElement("div");
    card.className = "expense-card";
    card.style.position = "relative";
    card.innerHTML = `
      <div class="expense-title">${exp.title}</div>
      <div class="expense-category">${exp.category}</div>
      <div class="expense-amount">₹ ${exp.amount}</div>
      <div class="expense-date">${exp.date}</div>
      <div style="position: absolute; bottom: 5px; right: 5px; font-size: 12px; color: #666;">ID: ${exp.id || 'N/A'}</div>
    `;
    expenseList.appendChild(card);
  });
}

window.renderExpenses = renderExpenses;