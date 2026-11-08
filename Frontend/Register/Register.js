// RiceMillLedger registration page logic

const form = document.getElementById("regForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");
const termsInput = document.getElementById("terms");
const message = document.getElementById("message");
const submitBtn = form.querySelector(".submit");

const errorEls = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    password: document.getElementById("passwordError"),
    confirm: document.getElementById("confirmError"),
    terms: document.getElementById("termsError"),
};

/* ---------- Helpers ---------- */

function setError(input, errorEl, text) {
    errorEl.textContent = text;
    input.classList.toggle("invalid", Boolean(text));
    return !text;
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = type ? `${type}-text` : "";
}

/* ---------- Validators ---------- */

function validateName() {
    const value = nameInput.value.trim();
    let text = "";
    if (!value) text = "Enter your name.";
    else if (value.length < 2) text = "Name must be at least 2 characters.";
    return setError(nameInput, errorEls.name, text);
}

function validateEmail() {
    const value = emailInput.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let text = "";
    if (!value) text = "Enter your email.";
    else if (!pattern.test(value)) text = "Enter a valid email, like you@example.com.";
    return setError(emailInput, errorEls.email, text);
}

function validatePassword() {
    const value = passwordInput.value;
    let text = "";
    if (!value) text = "Create a password.";
    else if (value.length < 8) text = "Password must be at least 8 characters.";
    else if (!/[A-Za-z]/.test(value) || !/\d/.test(value))
        text = "Use both letters and numbers.";
    return setError(passwordInput, errorEls.password, text);
}

function validateConfirm() {
    let text = "";
    if (!confirmInput.value) text = "Confirm your password.";
    else if (confirmInput.value !== passwordInput.value)
        text = "Passwords do not match.";
    return setError(confirmInput, errorEls.confirm, text);
}

function validateTerms() {
    const text = termsInput.checked ? "" : "Accept the terms & conditions to continue.";
    errorEls.terms.textContent = text;
    return !text;
}

/* ---------- Live validation ---------- */

nameInput.addEventListener("blur", validateName);
emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);
confirmInput.addEventListener("blur", validateConfirm);

passwordInput.addEventListener("input", () => {
    if (confirmInput.value) validateConfirm();
});
confirmInput.addEventListener("input", validateConfirm);
termsInput.addEventListener("change", validateTerms);

/* ---------- Registration ---------- */

// DEMO ONLY: saves the user in this browser's localStorage.
// Replace this function with a real API / Firebase call for a real app.
// Never store plain passwords in a real project.
async function registerUser({ name, email, password }) {
    const users = JSON.parse(localStorage.getItem("millbookUsers") || "[]");

    if (users.some((u) => u.email === email.toLowerCase())) {
        throw new Error("An account with this email already exists.");
    }

    users.push({ name, email: email.toLowerCase(), password });
    localStorage.setItem("millbookUsers", JSON.stringify(users));
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("", "");

    const results = [
        validateName(),
        validateEmail(),
        validatePassword(),
        validateConfirm(),
        validateTerms(),
    ];

    if (results.includes(false)) {
        showMessage("Fix the errors above and try again.", "error");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Registering...";

    try {
        await registerUser({
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value,
        });

        showMessage("Account created. Taking you to login...", "success");
        form.reset();
        document.querySelectorAll("input").forEach((i) => i.classList.remove("invalid"));

        setTimeout(() => {
            window.location.href = "../login/login.html";
        }, 1500);
    } catch (err) {
        showMessage(err.message || "Something went wrong. Try again.", "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Register Now";
    }
});