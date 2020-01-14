window.onload = function () {
    const REQUEST_URL = window.location.origin;
    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', async (event) => {
        await sendRequest({}, '/api/logout');
        document.cookie = ''; document.location = window.location.origin + '/login';
    });

    function drawLineChat(chartPayload) {
        google.setOnLoadCallback(() => {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Count');
            data.addColumn('number', 'Links');
            console.log(chartPayload);
            data.addRows(chartPayload);
            var options = { hAxis: { title: 'Time' }, vAxis: { title: 'Links created' } };
            var chart = new google.visualization.LineChart(document.getElementById('line_chart_div'));
            chart.draw(data, options);
        });
    }

    function drawBarChart(chartPayload) {
        if (!chartPayload || !chartPayload.length) return;
        chartPayload.unshift(['A', 'B']);
        google.setOnLoadCallback(() => {
            var data = google.visualization.arrayToDataTable(chartPayload);
            var options = { title: 'Hits per link', chartArea: { width: '50%' }, hAxis: { title: 'Total hits', minValue: 0 }, vAxis: { title: 'Shorted Links' } };
            var chart = new google.visualization.BarChart(document.getElementById('bar_chart_div'));
            chart.draw(data, options);
        });
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

    var start = function () {
        sendRequest({ dataBy: "hour" }, '/api/admin/getlinedata').then((res) => {
            if (res.fail) {
                let data = {}; data.title = 'Server Error!'; data.message = 'Please inform IT team about issue or try again later'; data.info = 'Please try again'; data.icon = 'fa fa-exclamation-triangle'; data.theme = 'awesome error';
                showAlert(data);
            }
            else if (res.fail && res.redirect) { window.location = REQUEST_URL + '/login'; return; }
            else if (res.success && res.data.length) {
                let chartPayload = [];
                res.data.forEach((point) => { chartPayload.push([point.hour, Number(point.link_count) || 0]); });
                google.charts.load('current', { packages: ['corechart', 'line'] });
                google.charts.setOnLoadCallback(drawLineChat(chartPayload));
            }
        }).catch();

        sendRequest({ dataBy: "hour" }, '/api/admin/getbardata').then((res) => {
            if (res.fail) {
                let data = {}; data.title = 'Server Error!'; data.message = 'Please inform IT team about issue or try again later'; data.info = 'Please try again'; data.icon = 'fa fa-exclamation-triangle'; data.theme = 'awesome error';
                showAlert(data);
            }
            else if (res.fail && res.redirect) { window.location = REQUEST_URL + '/login'; return; }
            else if (res.success && res.data.length) {
                console.log('resbar ', res);
                let chartPayload = [];
                res.data.forEach((point) => { chartPayload.push([point.shorturl, Number(point.hits) || 0]); });
                google.charts.load('current', { packages: ['corechart', 'bar'] });
                google.charts.setOnLoadCallback(drawBarChart(chartPayload));
            }
        }).catch();
    }
    start();
}