const express = require('express');
const router = express.Router();

router.get('/styles.css', (req, res) => {
    return res.sendFile(__dirname.replace('/router/static/css', '') + '/public/styles/styles.css');
});

module.exports = router;