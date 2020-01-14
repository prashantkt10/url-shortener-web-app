const express = require('express'), config = require('config'), jwt = require('jsonwebtoken'), router = express.Router();
module.exports = function (req, res, next) {
    if (!req || !req.cookies || !req.cookies['auth-token']) { req.user = null; next(); return; }
    const token = req.cookies['auth-token']; if (!token) { req.user = null; next(); return; }
    try { const decoded = jwt.verify(token, config.get('jwtSecret')); req.user = decoded; next(); return; }
    catch (e) { req.user = null; next(); return; }
}