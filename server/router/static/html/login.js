const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    return res.sendFile(__dirname.replace('/router/static/html', '') + '/public/login/index.html');
});

module.exports = router;