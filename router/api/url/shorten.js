const express = require('express'), { check, validationResult } = require('express-validator'), crypto = require('crypto');
const pool = require('../../../database/index'), redisClient = require('../../../redis/redis');
const router = express.Router();
// const base62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
// const base62 = require('base-x')(base62Chars);

router.post('/', [
    check('longURL', 'URL is required').isURL()
], async (req, res) => {
    try {
        if (!req.user || !req.user.user || !req.user.user.id) { res.clearCookie('auth-token'); return res.json({ success: 0, fail: 1, system: 0, redirect: 1 }); }
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), success: 0, fail: 1, system: 0, redirect: 0 });
        const { longURL } = req.body;
        const dbRes0 = await pool.query(`SELECT * FROM links WHERE user_id='${req.user.user.id}' AND longurl='${longURL}'`);
        if (dbRes0.rows.length > 0) return res.json({ success: 0, fail: 1, system: 0, redirect: 0, duplicate: 1 });
        const hashShortenURL = function (longURL) { if (!longURL) return; return crypto.createHash('SHA256').update(longURL).digest('hex').substr(0, 8); }
        const shortURL = hashShortenURL(longURL);
        const dbRes = await pool.query(`INSERT INTO links(user_id,longurl,shorturl) VALUES('${req.user.user.id}','${longURL}','${shortURL}')`);
        if (dbRes.rowCount == 0) { return res.json({ success: 0, fail: 1, system: 1, redirect: 0, duplicate: 0 }); }
        redisClient.set(shortURL, longURL, function (err, redRes) {
            if (err || !redRes) { return res.status(500).json({ success: 0, fail: 1, system: 1, redirect: 0, duplicate: 0 }); }
            redisClient.expire(shortURL, 604800, function (err, redRes) {
                if (err || !redRes) {
                    redisClient.del(shortURL); return res.status(500).json({ success: 0, fail: 1, system: 1, redirect: 0, duplicate: 0 });
                } return res.json({ success: 1, fail: 0, system: 0, data: { 'shortURL': shortURL }, duplicate: 0 });
            });
        });
    } catch (err) { console.log('er4', err); return res.status(500).json({ success: 0, fail: 1, system: 1, redirect: 0, duplicate: 0 }); }
});

module.exports = router;