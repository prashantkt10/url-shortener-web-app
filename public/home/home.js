window.onload = function () {
    const REQUEST_URL = window.location.origin;
    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', async (event) => {
        await sendRequest({}, '/api/logout');
        document.cookie = ''; document.location = window.location.origin + '/login';
    });

    var sendRequest = async function (loginInfo, api) {
        try {
            if (!loginInfo || !api) return;
            if (Object.keys(loginInfo).length == 0) loginInfo['dump'] = '1234';
            let response = await fetch(REQUEST_URL + api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(loginInfo)
            }); return await response.json();
        } catch (err) {
            console.log(err);
            let data = {}; data.title = 'Server Error!'; data.message = 'Please inform IT team about issue or try again later'; data.info = 'Please try again'; data.icon = 'fa fa-exclamation-triangle'; data.theme = 'awesome error';
            showAlert(data);
        }
    }
    var showAlert = function (data) {
        if (!data || !data.title || !data.message || !data.info || !data.icon || !data.theme) return;
        $.amaran({ content: { title: data.title, message: data.message, info: data.info, icon: data.icon }, theme: data.theme }); return;
    }
}