const USERS_KEY = "millbookUsers";
const SESSION_KEY = "millbookCurrentUser";


const REDIRECT_URL = "../dashboard/dashboard.html";

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");
const submitBtn = form.querySelector(".submit");
const forgotLink = document.getElementById("forgot-password");

const errorEls = {
    email: document.getElementById("emailError"),
    password: document.getElementById("passwordError"),
};



function setError(input, errorEl, text) {
    errorEl.textContent = text;
    input.classList.toggle("invalid", Boolean(text));
    return !text;
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = type ? `${type}-text` : "";
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
    const text = passwordInput.value ? "" : "Enter your password.";
    return setError(passwordInput, errorEls.password, text);
}

emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);

/* ---------- Login ---------- */

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    } catch {
        return [];
    }
}

// DEMO ONLY: checks the users saved in this browser's localStorage.

async function loginUser({ email, password }) {
    const user = getUsers().find((u) => u.email === email.toLowerCase());

    if (!user || user.password !== password) {
        throw new Error("Incorrect email or password.");
    }

    
    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ name: user.name, email: user.email })
    );
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("", "");

    const results = [validateEmail(), validatePassword()];
    if (results.includes(false)) {
        showMessage("Fix the errors above and try again.", "error");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in...";

    try {
        await loginUser({
            email: emailInput.value.trim(),
            password: passwordInput.value,
        });

        showMessage("Login successful. Redirecting...", "success");

        setTimeout(() => {
            window.location.href = REDIRECT_URL;
        }, 1000);
    } catch (err) {
        showMessage(err.message || "Something went wrong. Try again.", "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Sign in";
    }
});

/* ---------- Forgot password ---------- */

forgotLink.addEventListener("click", (event) => {
    event.preventDefault();
    showMessage("Password reset is not available yet.", "info");
});