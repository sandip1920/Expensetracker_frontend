document.addEventListener("DOMContentLoaded", () => {
const openLoginModalBtn = document.getElementById("openLoginModalBtn");
const openRegisterModalBtn = document.getElementById("openRegisterModalBtn");
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");
const closeLoginModalBtn = document.getElementById("closeLoginModalBtn");
const closeRegisterModalBtn = document.getElementById("closeRegisterModalBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const authStatusMessage = document.getElementById("authStatusMessage");
const authNextAction = document.getElementById("authNextAction");
const continueToDashboardBtn = document.getElementById("continueToDashboardBtn");

function setStatus(message, isError) {
authStatusMessage.textContent = message;
authStatusMessage.classList.toggle("error", Boolean(isError));
}

function showContinueAction(show) {
authNextAction.classList.toggle("hidden", !show);
}

function closeModal(modal, form) {
modal.classList.add("hidden");
form.reset();
}

function isAuthSuccess(responseData) {
if (!responseData) {
return false;
}

const message = (responseData.message || "").toLowerCase();

return Boolean(
responseData.success === true ||
responseData.authenticated === true ||
responseData.status === "success" ||
responseData.token ||
responseData.access_token ||
responseData.user ||
message.includes("success")
);
}

openLoginModalBtn.addEventListener("click", () => {
setStatus("", false);
showContinueAction(false);
loginModal.classList.remove("hidden");
});

openRegisterModalBtn.addEventListener("click", () => {
setStatus("", false);
showContinueAction(false);
registerModal.classList.remove("hidden");
});

continueToDashboardBtn.addEventListener("click", () => {
window.location.href = "Expense.html";
});

closeLoginModalBtn.addEventListener("click", () => {
closeModal(loginModal, loginForm);
});

closeRegisterModalBtn.addEventListener("click", () => {
closeModal(registerModal, registerForm);
});

loginModal.addEventListener("click", (e) => {
if (e.target === loginModal) {
closeModal(loginModal, loginForm);
}
});

registerModal.addEventListener("click", (e) => {
if (e.target === registerModal) {
closeModal(registerModal, registerForm);
}
});

document.addEventListener("keydown", (e) => {
if (e.key === "Escape") {
if (!loginModal.classList.contains("hidden")) {
closeModal(loginModal, loginForm);
}
if (!registerModal.classList.contains("hidden")) {
closeModal(registerModal, registerForm);
}
}
});

loginForm.addEventListener("submit", async (e) => {
e.preventDefault();
setStatus("Logging in...", false);

const formData = new FormData(loginForm);
const payload = {
username: formData.get("user_name").trim(),
password: formData.get("password")
};

try {
const responseData = await loginUserToAPI(payload);

if (isAuthSuccess(responseData)) {
sessionStorage.setItem("auth_user", payload.username);
if (responseData.token) {
sessionStorage.setItem("auth_token", responseData.token);
}
closeModal(loginModal, loginForm);
setStatus("Login successful. Click 'Continue to Dashboard' when ready.", false);
showContinueAction(true);
return;
}

showContinueAction(false);
setStatus(responseData.message || "Login failed. Please check your credentials.", true);
} catch (error) {
showContinueAction(false);
setStatus(error.message || "Login request failed.", true);
}
});

registerForm.addEventListener("submit", async (e) => {
e.preventDefault();
setStatus("Registering user...", false);

const formData = new FormData(registerForm);
const payload = {
username: formData.get("user_name").trim(),
password: formData.get("password")
};

try {
const responseData = await registerUserToAPI(payload);

if (isAuthSuccess(responseData)) {
showContinueAction(false);
setStatus("User successfully registered", false);
closeModal(registerModal, registerForm);
return;
}

showContinueAction(false);
setStatus(responseData.message || "Registration failed. Please try again.", true);
} catch (error) {
showContinueAction(false);
setStatus(error.message || "Registration request failed.", true);
}
});
});
