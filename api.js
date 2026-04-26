const BASE_URL = "https://expensetracker-backend-9nq1.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const loadApiBtn = document.getElementById("loadApiBtn");
    const expenseList = document.getElementById("expenseList");
    const statusMessage = document.getElementById("statusMessage");

    loadApiBtn.addEventListener("click", async () => {
        statusMessage.textContent = "Loading expenses from API...";
        expenseList.innerHTML = "";

        try {
            const data = await getExpensesFromAPI();
            statusMessage.textContent = "Expenses loaded successfully.";
            window.currentExpenses = data;
            renderExpenses(data);
        } catch (error) {
            console.error("Error:", error);
            statusMessage.textContent = "Failed to fetch data.";
            expenseList.innerHTML = "<p style='color:red;'>Error loading expenses.</p>";
        }
    });
});

// Add Expense
async function addExpenseToAPI(expenseData) {
    const response = await fetch(
        `${BASE_URL}/expenses?title=${encodeURIComponent(expenseData.title)}&amount=${expenseData.amount}&category=${encodeURIComponent(expenseData.category)}`,
        { method: "POST" }
    );

    if (!response.ok) {
        throw new Error("HTTP error: " + response.status);
    }

    return await response.json();
}

// Get Expenses
async function getExpensesFromAPI() {
    const response = await fetch(`${BASE_URL}/expenses`);

    if (!response.ok) {
        throw new Error("HTTP error: " + response.status);
    }

    return await response.json();
}

// Delete Expense
async function removeExpenseFromAPI(expenseId, expenseTitle) {
    const response = await fetch(
        `${BASE_URL}/expenses/${expenseId}?title=${encodeURIComponent(expenseTitle)}`,
        { method: "DELETE" }
    );

    if (!response.ok) {
        throw new Error("HTTP error: " + response.status);
    }

    return await response.json();
}

// Register User
async function registerUserToAPI(authData) {
    const response = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(authData)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail || result.message || ("HTTP error: " + response.status));
    }

    return result;
}

// Login User
async function loginUserToAPI(authData) {
    const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(authData)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail || result.message || ("HTTP error: " + response.status));
    }

    return result;
}

// Global access
window.addExpenseToAPI = addExpenseToAPI;
window.getExpensesFromAPI = getExpensesFromAPI;
window.removeExpenseFromAPI = removeExpenseFromAPI;
window.registerUserToAPI = registerUserToAPI;
window.loginUserToAPI = loginUserToAPI;