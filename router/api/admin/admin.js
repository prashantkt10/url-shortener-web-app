const express = require('express'), { check, validationResult } = require('express-validator');
const router = express.Router(), pool = require('../../../database/index');


router.post('/getlinedata', [
    check('dataBy', 'dataBy is mandatory field').isString()
], (req, res) => {
    try {
        // if (!req.user || !req.user.user || !req.user.user.id || !req.user.user.role) { res.clearCookie('auth-token'); return res.json({ success: 0, fail: 1, system: 0, redirect: 1 }); }
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(406).json({ errors: errors.array(), success: 0, fail: 1, system: 0 });
        const { dataBy } = req.body;
        pool.query(`SELECT hours.hour, links.link_count 
        FROM (SELECT generate_series(date_trunc('${dataBy}', now()) - '1 day'::interval,date_trunc('${dataBy}', now()),'1 hour'::interval) AS hour) AS hours 
        LEFT OUTER JOIN (SELECT date_trunc('${dataBy}',addeddt) date, count(shorturl) AS link_count FROM links group by date) AS links 
        ON hours.hour=links.date ORDER BY hours.hour`)
            .then((dbRes) => {
                if (!dbRes || !dbRes.rows.length) return res.json({ success: 0, fail: 1, system: 0, redirect: 0 });
                return res.json({ success: 1, fail: 0, system: 0, redirect: 0, data: dbRes.rows });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({ success: 0, fail: 1, system: 1, redirect: 0, data: res.rows });
            });
    }
    catch (er) { res.status(500).json({ success: 0, fail: 1, system: 1, redirect: 0, data: res.rows }); }
});

router.post('/getbardata', [
    check('dataBy', 'dataBy is mandatory field').isString()
], (req, res) => {
    try {
        // if (!req.user || !req.user.user || !req.user.user.id || !req.user.user.role) { res.clearCookie('auth-token'); return res.json({ success: 0, fail: 1, system: 0, redirect: 1 }); }
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(406).json({ errors: errors.array(), success: 0, fail: 1, system: 0 });
        const { dataBy } = req.body;
        pool.query(`SELECT shorturl,hits FROM links`)
            .then((dbRes) => {
                if (!dbRes || !dbRes.rows.length) return res.json({ success: 0, fail: 1, system: 0, redirect: 0 });
                return res.json({ success: 1, fail: 0, system: 0, redirect: 0, data: dbRes.rows });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({ success: 0, fail: 1, system: 1, redirect: 0, data: res.rows });
            });
    }
    catch (er) { res.status(500).json({ success: 0, fail: 1, system: 1, redirect: 0, data: res.rows }); }
});

module.exports = router;