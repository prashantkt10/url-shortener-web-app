window.onload = function () {
    const forgotPassBtn = document.getElementById('forgotPassBtn');
    const signUpBtn = document.getElementById('signUpBtn');
    const backToLogin = document.getElementsByClassName('backToLogin');

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPassForm = document.getElementById('forgotPassForm');

    forgotPassBtn.addEventListener('click', (event) => { event.preventDefault(); showForgotPassForm(); });
    signUpBtn.addEventListener('click', (event) => { event.preventDefault(); showRegisterForm(); });
    this.Array.prototype.forEach.call(backToLogin, function (element) {
        element.addEventListener('click', (event) => { event.preventDefault(); showLoginForm(); });
    });

    var showLoginForm = function () { forgotPassForm.style.display = 'none'; registerForm.style.display = 'none'; loginForm.style.display = ''; }
    var showForgotPassForm = function () { loginForm.style.display = 'none'; registerForm.style.display = 'none'; forgotPassForm.style.display = ''; }
    var showRegisterForm = function () { loginForm.style.display = 'none'; forgotPassForm.style.display = 'none'; registerForm.style.display = ''; }
}