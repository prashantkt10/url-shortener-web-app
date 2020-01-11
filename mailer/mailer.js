const nodemailer = require('nodemailer'), config = require('config');
var emailAccount = nodemailer.createTransport(config.get('emailPoolConfig'));
module.exports = emailAccount;