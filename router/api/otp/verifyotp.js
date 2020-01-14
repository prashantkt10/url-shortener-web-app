const express = require('express'), { check, validationResult } = require('express-validator'), config = require('config'), rateLimit = require('express-rate-limit'), bcrypt = require('bcrypt');
const redisClient = require('../../../redis/redis'), pool = require('../../../database/index');
const router = express.Router();
const rateLimiter = rateLimit({ windowMs: 1000, max: 1 });

router.use(rateLimiter);
router.post('/', [
    check('email', 'Email is required').isEmail().isLength({ max: 50 }),
    check('otp', 'OTP is required').isNumeric().isLength({ max: 4, min: 4 }),
    check('pass', 'Password is required').isString().isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), success: 0, fail: 1, system: 0 });
        const { email, otp, pass } = req.body;
        redisClient.get(email, async function (e, r) {
            if (e) return res.status(500).json({ success: 0, fail: 1, system: 1 });
            if (r == otp) {
                const salt = await bcrypt.genSalt(10); newPassword = await bcrypt.hash(pass, salt);
                const passUpdateRes = await pool.query(`UPDATE users SET password='${newPassword}' WHERE email='${email}'`);
                if (passUpdateRes.rowCount == 0) return res.status(400).json({ success: 0, fail: 1, system: 0 });
                return res.json({ success: 1, fail: 0, system: 0 });
            }
            else return res.status(400).json({ success: 0, fail: 1, system: 0 });
        });
    }
    catch (e) { return res.status(500).json({ success: 0, fail: 1, system: 1 }); }
});
module.exports = router;