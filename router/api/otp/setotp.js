const express = require('express'), { check, validationResult } = require('express-validator'), config = require('config'), rateLimit = require('express-rate-limit');
const pool = require('../../../database/index'), emailAccount = require('../../../mailer/mailer'), redisClient = require('../../../redis/redis');
const router = express.Router();
const rateLimiter = rateLimit({ windowMs: 30000, max: 1 });

router.use(rateLimiter);
router.post('/', [
    check('email', 'Email is required').isEmail()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(406).json({ errors: errors.array() });
        const { email } = req.body;
        var dbRes = await pool.query(`SELECT * FROM users WHERE email='${email}'`);
        if (dbRes.rows.length) {
            var genOTP = function () { return Math.floor(1000 + Math.random() * 9000); }
            var sendEmail = async function (data) { if (!data) return; return await emailAccount.sendMail(data); }
            const otp = genOTP();
            let emailRes = await sendEmail({ from: 'dwarfme@prashant.live', to: email, subject: "OTP request for DwarfME", html: `<p>Dear User,</p><p>OTP to reset DwarfMe account is: <b>${otp}</b></p><br/><p><b>Best Regards,<br/>DwarfMe.</b><p>` });
            let redisRes = await redisClient.set(dbRes.rows[0]['email'], otp);
            let redisResEx = await redisClient.expire(dbRes.rows[0]['email'], 60);
            Promise.all([emailRes, redisRes, redisResEx]).then((data) => { return res.status(500).json({ message: 'OTP sent' }); }).catch(() => { return res.status(500).json({ message: 'System Error' }); });
        } else return res.status(400).json({ message: 'No email matched' });
    } catch (er) { return res.status(500).json({ message: 'System error' }); }
});
module.exports = router;