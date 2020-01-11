const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    if (!req.user) {
        res.clearCookie('auth-token');
        return res.sendFile(__dirname.replace('/router/static/html', '') + '/public/login/index.html');
    } else return res.redirect('/home');
});

module.exports = router;