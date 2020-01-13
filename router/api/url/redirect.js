const express = require('express'), { check, validationResult } = require('express-validator');
const router = express.Router(), pool = require('../../../database/index'), redisClient = require('../../../redis/redis');

router.get('/', (req, res) => {
    try {
        if (!req.protocol || !req.get('host') || !req.originalUrl) return res.redirect('/login');
        const shorturl = req.originalUrl.replace('/', '');
        var updateHits = function (hits) { pool.query(`UPDATE links SET hits='${Number(hits) + 1}' WHERE shorturl='${shorturl}'`).then(() => { return; }).catch(() => { return; }); }
        var setCache = function (urlCache) { redisClient.set(urlCache['shorturl'], urlCache['longurl']); return; }
        redisClient.get(shorturl, async (err, redisRes) => {
            if (err || !redisRes) {
                const dbRes = await pool.query(`SELECT * FROM links WHERE shorturl='${shorturl}'`);
                console.log('came here4', dbRes.rowCount);
                if (!dbRes.rows.length) return res.redirect('/login');
                else { res.redirect(dbRes.rows[0]['longurl']); setCache(dbRes.rows[0]); updateHits(dbRes.rows[0]['hits']); return; }
            } else { res.redirect(redisRes); pool.query(`SELECT * FROM links WHERE shorturl='${shorturl}'`).then((newRes) => { updateHits(newRes.rows[0]['hits']); return; }); }
        });
    } catch (e) { return res.redirect('/login'); }
});

module.exports = router;