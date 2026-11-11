// Elements

const intro = document.getElementById("intro");

const passwordScreen = document.getElementById("passwordScreen");

const passwordForm = document.getElementById("passwordForm");

const passwordInput = document.getElementById("password");

const error = document.getElementById("error");

const togglePassword = document.getElementById("togglePassword");


// Intro Timer

setTimeout(() => {

    intro.classList.add("hide");

    passwordScreen.classList.add("show");

}, 4000);


// Password

const correctPassword = "123456";


// Show / Hide Password

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

    } else {

        passwordInput.type = "password";

    }

});


// Login

passwordForm.addEventListener("submit", (e) => {

    e.preventDefault();

});