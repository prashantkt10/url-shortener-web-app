const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    if (!req.user) { res.clearCookie('auth-token'); return res.redirect('/login'); }
    else if (req.user.user.role == 1) { return res.redirect('/admin'); }
    else return res.sendFile(__dirname.replace('/router/static/html', '') + '/public/home/index.html');
});

module.exports = router;