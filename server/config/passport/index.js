'use strict';

const passport = require('passport');
const data = require('../../data')();
const config = require('../config');
const stage = process.env.NODE_ENV || 'development';

passport.serializeUser((user, done) => {
    if (user) {
        return done(null, user.id);
    }

    return done(null, false);
});

passport.deserializeUser((userId, done) => {
    data
        .getUserById(userId)
        .then(user => done(null, user || false))
        .catch(error => done(error, false));
});

// require('./local-strategy')(passport, data);
require('./jwt-strategy')(passport, data, config[stage]);

module.exports = (app) => {
    app.use(passport.initialize());
    // app.use(passport.session());
};