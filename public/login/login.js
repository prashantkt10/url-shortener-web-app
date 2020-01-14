window.onload = function () {
    const forgotPassBtn = document.getElementById('forgotPassBtn');
    const signUpBtn = document.getElementById('signUpBtn');
    const backToLogin = document.getElementsByClassName('backToLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPassForm = document.getElementById('forgotPassForm');
    const loginBtn = document.getElementById('loginBtn');
    const resetPassBtn = document.getElementById('resetPassBtn');
    const signupBtn1 = document.getElementById('signupBtn1');
    const otpBox = document.getElementById('otpBox');
    const otpBoxText = document.getElementById('otpBoxText');
    const forgotPassBox = document.getElementById('forgotPassBox');
    const passwordBoxText = document.getElementById('passwordBoxText');

    const REQUEST_URL = window.location.origin;

    let forgotPassState = 0;
    forgotPassBtn.addEventListener('click', (event) => { event.preventDefault(); showForgotPassForm(); resetForms(); });
    signUpBtn.addEventListener('click', (event) => { event.preventDefault(); showRegisterForm(); resetForms(); });
    this.Array.prototype.forEach.call(backToLogin, function (element) {
        element.addEventListener('click', (event) => {
            resetPassBtn.innerText = 'GET OTP'; forgotPassState = 0; changeFormStatus(forgotPassForm, resetPassBtn, false);
            event.preventDefault(); showLoginForm(); resetForms();
            otpBox.style.display = 'none'; otpBoxText.style.display = 'none';
            passwordBoxText.style.display = 'none'; forgotPassBox.style.display = 'none';
        });
    });
    loginBtn.addEventListener('click', async function (event) {
        event.preventDefault(); changeFormStatus(loginForm, loginBtn, true);
        const loginInfo = {}, formData = new FormData(loginForm);
        loginInfo['email'] = formData.get('signInEmail');
        loginInfo['password'] = formData.get('signInPassword');
        if (!loginInfo['email'] || !loginInfo['password']) {
            let data = {}; data.title = 'Please check!'; data.message = 'All fields are required'; data.info = 'Please retry'; data.icon = 'fa fa-exclamation-triangle'; data.theme = 'awesome error';
            showAlert(data); changeFormStatus(loginForm, loginBtn, false); return;
        }
        let authData = await sendRequest(loginInfo, '/api/login');
        if (authData && authData.success) { window.location = REQUEST_URL + '/home'; return; }
        else {
            let data = {}; data.title = 'Failed!'; data.message = 'Failed to login, please check credentials again'; data.info = 'Please retry'; data.icon = 'fa fa-exclamation-triangle'; data.theme = 'awesome error';
            showAlert(data); changeFormStatus(loginForm, loginBtn, false); return;
        }
    });

    resetPassBtn.addEventListener('click', async function (event) {
        event.preventDefault(); const formData = new FormData(forgotPassForm), newPassInfo = {};
        newPassInfo['email'] = formData.get('forgotEmail'); newPassInfo['otp'] = formData.get('forgotOTP'); newPassInfo['pass'] = formData.get('forgotPass');
        if (forgotPassState) {
            if (!newPassInfo['email'] || !newPassInfo['email'].length || !newPassInfo['otp'] || !newPassInfo['otp'].length || !newPassInfo['pass'] || newPassInfo['pass'].length < 6) {
                console.log('newpassin ', newPassInfo);
                let data = {}; data.title = 'Please check!'; data.message = 'All fields are required'; data.info = 'Please try again'; data.icon = 'fa fa-exclamation-triangle'; data.theme = 'awesome error';
                showAlert(data); return;
            }
            changeFormStatus(forgotPassForm, resetPassBtn, true);
            let newPassResponse = await sendRequest(newPassInfo, '/api/verifyotp'); changeFormStatus(forgotPassForm, resetPassBtn, false);
            if (newPassResponse && newPassResponse.success) {
                forgotPassState = 0; resetForms(); resetPassBtn.innerText = 'GET OTP';
                otpBox.style.display = 'none'; otpBoxText.style.display = 'none';
                passwordBoxText.style.display = 'none'; forgotPassBox.style.display = 'none';
                showLoginForm(); let data = {}; data.title = 'Succes!'; data.message = 'Password has been reset successfully'; data.info = 'Please login'; data.icon = 'fa fa-check-circle'; data.theme = 'awesome ok';
                showAlert(data); return;
            }
            else {
                let data = {}; data.title = 'Failed!'; data.message = 'Password could not be reset, please re-check details'; data.info = 'Please try again'; data.icon = 'fa fa-exclamation-triangle'; data.theme = 'awesome error';
                showAlert(data); return;
            }
        }
        else {
            if (!newPassInfo['email'].length) {
                let data = {}; data.title = 'Please check!'; data.message = 'All fields are required'; data.info = 'Please try again'; data.icon = 'fa fa-exclamation-triangle'; data.theme = 'awesome error';
                showAlert(data); return;
            }
            changeFormStatus(forgotPassForm, resetPassBtn, true);
            let resetResponse = await sendRequest(newPassInfo, '/api/setotp'); changeFormStatus(forgotPassForm, resetPassBtn, false);
            if (resetResponse && resetResponse.success) {
                forgotPassState = 1; document.getElementById('forgotEmail').readOnly = true; otpBox.style.display = ''; otpBoxText.style.display = ''; passwordBoxText.style.display = ''; forgotPassBox.style.display = ''; resetPassBtn.innerText = 'Set New Password'; resetPassBtn.className = 'button-primary signInBtn';
                let data = {}; data.title = 'OTP sent!'; data.message = 'OTP has been sent to given email id'; data.info = 'Check spam box also'; data.icon = 'fa fa-check-circle'; data.theme = 'awesome ok';
                showAlert(data); return;
            } else {
                let data = {}; data.title = 'Failed!'; data.message = 'OTP could not be sent'; data.info = 'Please try again'; data.icon = 'fa fa-exclamation-triangle'; data.theme = 'awesome error';
                showAlert(data); return;
            }
        }
    });
    signupBtn1.addEventListener('click', async function (event) {
        event.preventDefault(); const formData = new FormData(registerForm), signUpData = {}; changeFormStatus(registerForm, signupBtn1, true);
        signUpData['email'] = formData.get('signupEmail'), signUpData['password'] = formData.get('signUpPassword'), signUpData['confirmPassword'] = formData.get('signUpConfirmPassword');
        console.log('signUpData ', signUpData);
        if (!signUpData['email'] || !signUpData['password'] || !signUpData['confirmPassword']) {
            let data = {}; data.title = 'Please check!'; data.message = 'All fields are required.'; data.info = 'Please try again'; data.icon = 'fa fa-exclamation-triangle'; data.theme = 'awesome error';
            showAlert(data); changeFormStatus(registerForm, signupBtn1, false); return;
        }
        if (signUpData['password'] !== signUpData['confirmPassword']) {
            let data = {}; data.title = 'Please check!'; data.message = 'Password & confirm password fields should be same.'; data.info = 'Please try again'; data.icon = 'fa fa-exclamation-triangle'; data.theme = 'awesome error';
            showAlert(data); return;
        }
        if (signUpData['password'].length < 6 || signUpData['confirmPassword'].length < 6) {
            let data = {}; data.title = 'Please check!'; data.message = 'Password & confirm password fields should have minimum 6 characters/ numbers or mix of both'; data.info = 'Please try again'; data.icon = 'fa fa-exclamation-triangle'; data.theme = 'awesome error';
            showAlert(data); changeFormStatus(registerForm, signupBtn1, false); return;
        }
        delete signUpData['confirmPassword'];
        let signUpResponse = await sendRequest(signUpData, '/api/register');
        if (signUpResponse && signUpResponse.success) { window.location = REQUEST_URL + '/home'; return; }
        let data = {}; data.title = 'Failed!'; data.message = 'Failed to register.'; data.info = 'Please try again'; data.icon = 'fa fa-exclamation-triangle'; data.theme = 'awesome error';
        showAlert(data); changeFormStatus(registerForm, signupBtn1, false); return;
    });


    var showLoginForm = function () { forgotPassForm.style.display = 'none'; registerForm.style.display = 'none'; loginForm.style.display = ''; }
    var showForgotPassForm = function () { loginForm.style.display = 'none'; registerForm.style.display = 'none'; forgotPassForm.style.display = ''; }
    var showRegisterForm = function () { loginForm.style.display = 'none'; forgotPassForm.style.display = 'none'; registerForm.style.display = ''; }
    var changeFormStatus = function (node, btn, disable) {
        for (var i = 0, len = node.elements.length; i < len; ++i) {
            node.elements[i].readOnly = disable ? true : false;
        } btn.disabled = disable ? true : false; btn.className = disable ? 'disabledBtn' : 'button-primary signInBtn'; return;
    }
    var resetForms = function () { document.getElementById('forgotPassForm').reset(); document.getElementById('loginForm').reset(); document.getElementById('registerForm').reset(); }
    var sendRequest = async function (loginInfo, api) {
        try {
            if (!loginInfo || !api) return;
            let response = await fetch(REQUEST_URL + api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(loginInfo)
            }); return await response.json();
        } catch (err) {
            let data = {}; data.title = 'Server Error!'; data.message = 'Please inform IT team about issue or try again later'; data.info = 'Please try again'; data.icon = 'fa fa-exclamation-triangle'; data.theme = 'awesome error';
            showAlert(data);
        }
    }


    var showAlert = function (data) {
        if (!data || !data.title || !data.message || !data.info || !data.icon || !data.theme) return;
        $.amaran({ content: { title: data.title, message: data.message, info: data.info, icon: data.icon }, theme: data.theme }); return;
    }
}