'use strict';
const multer = require('multer');
const path = require('path');
const router = require('express').Router();

module.exports = function ({ app, controllers, passport, auth }) {
    const userController = controllers.user;
    let img = '';

    const storageAvatar = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../../public/images/user-аvatar-images/'));
        },
        filename: function (req, file, cb) {
            img = Date.now() + file.originalname;
            cb(null, img);
        }
    });

    const uploadAvatar = multer({
        storage: storageAvatar
    });

    router
        .put('/user/:id', auth.isAuthenticated(), userController.updatePrivateInfo)
        .get('/user/:username/courses', auth.isAuthenticated(), userController.getUserCourses)
        .post('/user/:username/favorites', auth.isAuthenticated(), userController.addFactToFavorites)
        .get('/user/:username/avatar', auth.isAuthenticated(), userController.getAvatar)
        .post('/user/avatar', uploadAvatar.any(), (req, res) => {
            userController.uploadAvatar(req, res, img);
        });

    app.use('/api/users', router);
};