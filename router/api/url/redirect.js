const express = require('express'), { check, validationResult } = require('express-validator');
const router = express.Router(), pool = require('../../../database/index'), redisClient = require('../../../redis/redis');

router.get('/', (req, res) => {
    if (!req.protocol || !req.get('host') || !req.originalUrl) return res.redirect('/login');
    const shorturl = req.originalUrl.replace('/', '');
    redisClient.get(shorturl, async (err, redisRes) => {
        if (err || !redisRes) {
            const dbRes = pool.query(`SELECT * FROM links WHERE shorturl='${shorturl}'`);
            if (!dbRes || !dbRes.rows || !dbRes.rows.length || !dbRes.rows[0] || dbRes.rows[0]['shorturl']) return res.redirect('/login');
            return res.redirect(dbRes.rows[0]['shorturl']);
        }
        res.redirect(redisRes);
    });
});

module.exports = router;