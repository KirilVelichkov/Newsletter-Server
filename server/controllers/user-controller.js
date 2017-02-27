'use strict';

module.exports = function ({data, encryption}) {
    return {
        _validateToken(req, res) {
            let token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'You must be loged in order to vote'
                });
            }
            token = token.substring(1, token.length - 1);
            let user = encryption.deciferToken(token);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'You must be loged in order to vote'
                });
            }
        },
        updatePrivateInfo(req, res) {
            if (!req.user) {
                res.status(401).json({
                    succes: false,
                    message: 'Please enter your credentials'
                });
                return;
            }

            let user = req.user;
            let userHash = req.user.passHash;

            let hashedEnteredPassword = user.generatePassHash(req.body.currentPassword);
            if (userHash !== hashedEnteredPassword) {
                res.status(401).json({
                    succes: false,
                    message: 'Please enter valid credentials'
                });
                return;
            }

            let newUserHash = false;

            if (req.body.newPassword) {
                newUserHash = user.generatePassHash(req.body.newPassword);
            }

            let infoToUpdate = {
                email: req.body.email,
                passHash: newUserHash
            };

            data.updateUserPrivateInfo(user._id, infoToUpdate)
                .then(result => {
                    res.status(201).json({
                        succes: true,
                        message: 'Userinfo has been updated successfullyF'
                    });
                })
                .catch(err => {
                    res.status(400).json({
                        succes: false,
                        message: 'User with the same email already exists!'
                    });
                });
        },
        getUserCourses(req, res) {
            let username = req.params.username;

            data.getUserCourses(username)
                .then((result) => {
                    console.log(result);
                    res.status(200).json(result)
                });
        },
        addFactToFavorites(req, res) {
            let username = req.params.username;
            let fact = req.body.fact;

            data.addFactToFavorites(username, fact);

        },
        uploadAvatar(req, res, img) {
            this._validateToken(req, res);

            let username = req.body.username;
            let passwordFromReq = req.body.currentPassword;

            if (!passwordFromReq) {
                res.status(401).json({
                    succes: false,
                    message: 'Password is not valid'
                });
            }

            data.uploadAvatar(username, img, passwordFromReq)
                .then(user => {
                    res.status(200).send(img);
                })
                .catch((err) => {
                    res.status(401).json({
                        succes: false,
                        message: 'Password is not valid'
                    });
                });

        },
        getAvatar(req, res) {
            let username = req.params.username;

            data.getAvatar(username)
                .then(result => res.status(200).json(result));
        }
    };
};