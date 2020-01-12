window.onload = function () {
    const REQUEST_URL = window.location.origin;
    const logoutBtn = document.getElementById('logoutBtn');
    const getShortURLBtn = document.getElementById('getShortURLBtn');
    const urlGenerateForm = document.getElementById('urlGenerateForm');
    const shortURLBox = document.getElementById('shortURL');
    const shortedDataMessage = document.getElementById('shortedDataMessage');
    const tbodyLinks = document.getElementById('tbodyLinks');
    const shortedTable = document.getElementById('shortedTable');

    logoutBtn.addEventListener('click', async (event) => {
        await sendRequest({}, '/api/logout');
        document.cookie = ''; document.location = window.location.origin + '/login';
    });
    getShortURLBtn.addEventListener('click', async (event) => {
        event.preventDefault(); changeFormStatus(urlGenerateForm, getShortURLBtn, true);
        const formData = new FormData(urlGenerateForm), reqData = {};
        reqData['longURL'] = formData.get('longURL');
        if (!reqData || !reqData['longURL']) {
            let data = {}; data.title = 'Error!'; data.message = 'Long URL field is mandatory to generate short URL.'; data.info = 'Please try again'; data.icon = 'fa fa-exclamation-triangle'; data.theme = 'awesome error';
            showAlert(data); changeFormStatus(urlGenerateForm, getShortURLBtn, false); return;
        }
        const genURLRes = await sendRequest(reqData, '/api/shorten');
        if (genURLRes.redirect) { window.location = REQUEST_URL + '/login'; return; }
        if (genURLRes.fail && genURLRes.duplicate) {
            let data = {}; data.title = 'Not Permitted!'; data.message = 'This URL has already been occupied by someone.'; data.info = 'Please try with another URL'; data.icon = 'fa fa-exclamation-triangle'; data.theme = 'awesome error';
            showAlert(data); changeFormStatus(urlGenerateForm, getShortURLBtn, false); return;
        }
        if (genURLRes.success) {
            getShortedData(); shortURLBox.value = REQUEST_URL + '/' + genURLRes.data.shortURL; changeFormStatus(urlGenerateForm, getShortURLBtn, false); return;
        }
        changeFormStatus(urlGenerateForm, getShortURLBtn, false); return;
    });

    var changeFormStatus = function (node, btn, disable) {
        for (var i = 0, len = node.elements.length; i < len; ++i) {
            node.elements[i].readOnly = disable ? true : false;
        } btn.disabled = disable ? true : false; btn.className = disable ? 'disabledBtn' : 'button-primary signInBtn'; return;
    }

    var sendRequest = async function (payload, api) {
        try {
            if (!payload || !api) return;
            if (Object.keys(payload).length == 0) payload['dump'] = '1234';
            let response = await fetch(REQUEST_URL + api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload)
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

    var getShortedData = async function () {
        tbodyLinks.innerHTML = '';
        const shortedData = await sendRequest({}, '/api/shorted');
        console.log('shorted ', shortedData);
        if (shortedData.fail) { shortedDataMessage.innerText = 'Failed to load data'; return; }
        if (shortedData.success && shortedData.links.length == 0) { shortedDataMessage.innerText = 'No data found'; return; }
        if (shortedData.success && shortedData.links.length > 0) {
            shortedData.links.forEach((link) => {
                const tr = document.createElement('tr');
                const td1 = document.createElement('td'), td2 = document.createElement('td'), td3 = document.createElement('td'), td4 = document.createElement('td');
                td1.innerText = new Date(link.addeddt).toLocaleDateString(); tr.appendChild(td1);
                td2.innerText = link.longurl; tr.appendChild(td2);
                td3.innerText = REQUEST_URL + "/" + link.shorturl; tr.appendChild(td3);
                td4.innerText = link.hits; tr.appendChild(td4);
                tbodyLinks.appendChild(tr);
            });
            shortedDataMessage.style.display = 'none'; shortedTable.style.display = '';
        }
    }
    getShortedData();
}