const pg = require('pg'), config = require('config');
const pool = new pg.Pool(config.get('pgConfig'));
module.exports = pool;