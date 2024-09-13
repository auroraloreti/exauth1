const { Strategy, ExtractJwt } = require('passport-jwt');
const pool = require('../db');
require('dotenv').config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET
};

module.exports = (passport) => {
  passport.use(new Strategy(opts, (jwt_payload, done) => {
    pool.query('SELECT * FROM users WHERE id = $1', [jwt_payload.id], (err, results) => {
      if (err) {
        return done(err, false);
      }
      if (results.rows.length > 0) {
        return done(null, results.rows[0]);
      } else {
        return done(null, false);
      }
    });
  }));
};