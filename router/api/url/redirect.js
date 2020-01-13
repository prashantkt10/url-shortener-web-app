const express = require('express'), { check, validationResult } = require('express-validator');
const router = express.Router(), pool = require('../../../database/index'), redisClient = require('../../../redis/redis');

router.get('/', (req, res) => {
    try {
        console.log('req.originalUrl', req.originalUrl);
        if (!req.protocol || !req.get('host') || !req.originalUrl) return res.redirect('/login');
        const shorturl = req.originalUrl.replace('/', '');
        var updateHits = function (hits) { pool.query(`UPDATE links SET hits='${Number(hits) + 1}' WHERE shorturl='${shorturl}'`).then(() => { return; }).catch(() => { return; }); }
        redisClient.get(shorturl, async (err, redisRes) => {
            if (err || !redisRes) {
                const dbRes = await pool.query(`SELECT * FROM links WHERE shorturl='${shorturl}'`);
                if (!dbRes || !dbRes.rows || !dbRes.rows.length || !dbRes.rows[0] || dbRes.rows[0]['shorturl']) return res.redirect('/login');
                else { res.redirect(dbRes.rows[0]['shorturl']); updateHits(dbRes.rows[0]['hits']); }
            } else { console.log('came here'); res.redirect(redisRes); pool.query(`SELECT * FROM links WHERE shorturl='${shorturl}'`).then((newRes) => { updateHits(newRes.rows[0]['hits']); }); }
        });
    } catch (e) { return res.redirect('/login'); }
});

module.exports = router;