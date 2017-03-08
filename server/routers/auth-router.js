/*globals */
'use strict';

const router = require('express').Router();

module.exports = function ({ upload, app, controllers, auth }) {
    const authController = controllers.auth;

    router
        .post('/login', authController.login)
        .post('/register', upload.single('avatar'), authController.register)
        .post('/logout', authController.logout)
        .get('/getUserRoles', auth.isAuthenticated(), authController.getUserRoles)
        .get('/getLoggedUser', auth.isAuthenticated(), authController.getLoggedUser);

    app.use('/api/auth', router);
};