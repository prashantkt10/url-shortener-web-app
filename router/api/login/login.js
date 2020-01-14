const express = require('express'), { check, validationResult } = require('express-validator'), bcrypt = require('bcrypt');
const pool = require('../../../database/index'), jwt = require('jsonwebtoken'), config = require('config');
const router = express.Router();

router.post('/', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(406).json({ errors: errors.array(), success: 0, fail: 1, system: 0 });
        var { email, password } = req.body;
        var dbRes = await pool.query(`SELECT * FROM users WHERE email='${email}'`);
        if (dbRes.rows.length == 0) return res.status(400).json({ success: 0, fail: 1, system: 0 });
        if (dbRes.rows && dbRes.rows[0] && dbRes.rows[0]['password']) {
            var payload = {};
            const isMatch = await bcrypt.compare(password, dbRes.rows[0]['password']);
            if (isMatch) {
                payload = { 'user': { id: dbRes.rows[0]['user_id'], role: dbRes.rows[0]['role'] } };
                const jwToken = jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '1h' });
                res.cookie('auth-token', jwToken, { httpOnly: true, sameSite: 'Strict' });
                return res.json({ success: 1, fail: 0, system: 0 });
            } else return res.status(400).json({ success: 0, fail: 1, system: 0 });
        } else return res.status(500).json({ success: 0, fail: 1, system: 0 });
    } catch (err) { console.log('err ', err); return res.status(500).json({ success: 0, fail: 1, system: 1 }); }
});
module.exports = router;