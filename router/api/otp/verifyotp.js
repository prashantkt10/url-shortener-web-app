const express = require('express'), { check, validationResult } = require('express-validator'), config = require('config'), rateLimit = require('express-rate-limit');
const redisClient = require('../../../redis/redis');
const router = express.Router();
const rateLimiter = rateLimit({ windowMs: 1000, max: 1 });

router.use(rateLimiter);
router.post('/', [
    check('email', 'Email is required').isEmail(),
    check('otp', 'OTP is required').isNumeric()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(406).json({ errors: errors.array() });
        const { email, otp } = req.body;
        redisClient.get(email, function (e, r) {
            if (e || !r) return res.status(500).json({ 'message': 'System error' });
            if (r == otp) return res.json({ 'message': 'OTP matched' });
            return res.status(400).json({ 'message': 'OTP is wrong' });
        });
    }
    catch (e) { return res.status(500).json({ message: 'System error' }); }
});
module.exports = router;