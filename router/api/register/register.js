const express = require('express'), { check, validationResult } = require('express-validator'), bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'), config = require('config'), pool = require('../../../database/index');
const router = express.Router();

router.post('/', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), success: 0, fail: 1, system: 0 });
        var { email, password } = req.body;
        var dbRes = await pool.query(`SELECT * FROM users WHERE email='${email}'`);
        if (dbRes.rows.length > 0) return res.status(400).json({ success: 0, fail: 1, system: 0 });
        const salt = await bcrypt.genSalt(10); password = await bcrypt.hash(password, salt);
        dbRes = await pool.query(`INSERT INTO users(email,password) VALUES('${email}','${password}') RETURNING user_id`);
        if (dbRes.rowCount > 0) {
            const payload = { 'user': { id: dbRes.rows[0]['user_id'] } };
            const jwToken = jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 6000000 });
            res.cookie('auth-token', jwToken, { httpOnly: true, sameSite: 'Strict' });
            return res.json({ success: 1, fail: 0, system: 0 });
        } return res.status(500).json({ success: 0, fail: 1, system: 1 });
    }
    catch (err) { console.log('err ', err); return res.status(500).json({ success: 0, fail: 1, system: 1 }); }
});

module.exports = router;