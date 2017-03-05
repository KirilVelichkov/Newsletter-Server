'use strict';
const router = require('express').Router();

module.exports = function ({ upload, app, controllers, passport, auth }) {
    const userController = controllers.user;
 
    router
        .put('/updateSettings', upload.single('avatar'), auth.isAuthenticated(), userController.updatePrivateInfo)
        .get('/user/avatar/:id', userController.getAvatar);


    app.use('/api/users', router);
};