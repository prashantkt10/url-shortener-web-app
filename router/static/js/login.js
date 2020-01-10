const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    return res.sendFile(__dirname.replace('/router/static/js', '') + '/public/login/login.js');
});

module.exports = router;