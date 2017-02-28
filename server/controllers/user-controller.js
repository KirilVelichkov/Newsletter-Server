'use strict';

module.exports = function ({grid, database, data, encryption}) {
    return {
        _validateToken(req, res) {
            let token = req.headers.authorization;
            if (!token) {
                return res.json({
                    success: false,
                    message: 'You must be loged in order to vote'
                });
            }
            token = token.substring(1, token.length - 1);
            let user = encryption.deciferToken(token);
            if (!user) {
                return res.json({
                    success: false,
                    message: 'You must be loged in order to vote'
                });
            }
        },
        updatePrivateInfo(req, res) {
            let gfs = grid(database.connection.db, database.mongo);
            console.log(req.file);

            if (!req.user) {
                return res.json({
                    succes: false,
                    message: 'Please enter your credentials'
                });
            }

            let user = req.user;
            let userHash = req.user.passHash;

            // let hashedEnteredPassword = user.generatePassHash(req.body.currentPassword);
            // if (userHash !== hashedEnteredPassword) {
            //     return res.json({
            //         succes: false,
            //         message: 'Please enter valid credentials'
            //     });
            // }

            let newUserHash = false;

            if (req.body.newPassword) {
                newUserHash = user.generatePassHash(req.body.newPassword);
            }
            console.log(req.file);
            console.log(' ');
            console.log(' ');
            console.log(' ');
            console.log(' ');
            console.log(' ');

            let file = req.file.buffer;

            gfs.writeFile({}, file.buffer, (_, foundFile) => {
                let avatar = foundFile._id;

                let infoToUpdate = {
                    email: req.body.email,
                    passHash: newUserHash,
                    avatar: avatar
                };

                data.updateUserPrivateInfo(user._id, infoToUpdate)
                    .then(result => {
                        return res.status(201).json({
                            succes: true,
                            message: 'Userinfo has been updated successfully'
                        });
                    })
                    .catch(() => {
                        return res.json({
                            succes: false,
                            message: 'User with the same email already exists!'
                        });
                    });
            });
        },
        getUserCourses(req, res) {
            let username = req.params.username;

            data.getUserCourses(username)
                .then((result) => {
                    return res.status(200).json(result)
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
                return res.json({
                    succes: false,
                    message: 'Password is not valid'
                });
            }

            data.uploadAvatar(username, img, passwordFromReq)
                .then(user => {
                    return res.status(200).send(img);
                })
                .catch(() => {
                    return res.json({
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