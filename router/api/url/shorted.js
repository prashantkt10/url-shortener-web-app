const express = require('express'), pool = require('../../../database/index');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        if (!req.user || !req.user.user || !req.user.user.id) { res.clearCookie('auth-token'); return res.json({ success: 0, fail: 1, system: 0, redirect: 1 }); }
        const dbRes = await pool.query(`SELECT addeddt,longurl,shorturl,hits FROM links WHERE user_id='${req.user.user.id}'`);
        if (dbRes && dbRes.rows && dbRes.rows.length == 0) return res.json({ success: 1, fail: 0, system: 0, redirect: 0, links: [] });
        else return res.json({ success: 1, fail: 0, system: 0, redirect: 0, links: dbRes.rows });
    }
    catch (e) { console.log(e); return res.status(500).json({ success: 0, fail: 1, system: 1, redirect: 0 }); }
});

module.exports = router;