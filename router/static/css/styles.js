const express = require('express');
const router = express.Router();

router.get('/styles.css', (req, res) => {
    return res.sendFile(__dirname.replace('/router/static/css', '') + '/public/styles/styles.css');
});
router.get('/amaran.min.css', (req, res) => {
    return res.sendFile(__dirname.replace('/router/static/css', '') + '/public/styles/amaran.min.css');
});
router.get('/animate.min.css', (req, res) => {
    return res.sendFile(__dirname.replace('/router/static/css', '') + '/public/styles/animate.min.css');
});

module.exports = router;