const express = require('express'), { check, validationResult } = require('express-validator'), crypto = require('crypto');
const pool = require('../../../database/index'), redisClient = require('../../../redis/redis');
const router = express.Router();
// const base62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
// const base62 = require('base-x')(base62Chars);

router.post('/', [
    check('longURL', 'URL is required').isURL(),
    check('shortURL', 'URL is required').optional()
], async (req, res) => {
    try {
        if (!req.user || !req.user.user || !req.user.user.id) { res.clearCookie('auth-token'); return res.json({ success: 0, fail: 1, system: 0, redirect: 1 }); }
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), success: 0, fail: 1, system: 0, redirect: 0 });
        const { longURL } = req.body; let shortURL = null; if (req.body.shortURL) shortURL = req.body.shortURL;
        const hashShortenURL = function (longURL) { if (!longURL) return; return crypto.createHash('SHA256').update(longURL).digest('hex').substr(0, 8); }
        let shorturl = null;
        if (shortURL) shorturl = shortURL;
        else shorturl = hashShortenURL(longURL);
        const dbRes0 = await pool.query(`SELECT * FROM links WHERE longurl='${longURL}' OR shorturl='${shortURL}'`);
        if (dbRes0.rows.length > 0) return res.json({ success: 0, fail: 1, system: 0, redirect: 0, duplicate: 1 });
        const dbRes = await pool.query(`INSERT INTO links(user_id,longurl,shorturl) VALUES('${req.user.user.id}','${longURL}','${shorturl}')`);
        if (dbRes.rowCount == 0) { return res.json({ success: 0, fail: 1, system: 1, redirect: 0, duplicate: 0 }); }
        redisClient.set(shorturl, longURL, function (err, redRes) {
            if (err || !redRes) { return res.status(500).json({ success: 0, fail: 1, system: 1, redirect: 0, duplicate: 0 }); }
            redisClient.expire(shorturl, 604800, function (err, redRes) {
                if (err || !redRes) {
                    redisClient.del(shorturl); return res.status(500).json({ success: 0, fail: 1, system: 1, redirect: 0, duplicate: 0 });
                } return res.json({ success: 1, fail: 0, system: 0, data: { 'shortURL': shorturl }, duplicate: 0 });
            });
        });
    } catch (err) { console.log('er4', err); return res.status(500).json({ success: 0, fail: 1, system: 1, redirect: 0, duplicate: 0 }); }
});

module.exports = router;