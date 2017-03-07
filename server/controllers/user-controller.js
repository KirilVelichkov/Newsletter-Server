'use strict';

module.exports = function ({ grid, database, data, encryption }) {
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

            let newUserHash = false;

            if (req.body.newPassword) {
                newUserHash = user.generatePassHash(req.body.newPassword);
            }

            let file = req.file;

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
        getAvatar(req, res) {
            let gfs = grid(database.connection.db, database.mongo);

            let options = {
                _id: req.params.id
            };

            gfs.exist(options, (_, exists) => {
                if (!exists) {
                    res.status(404);
                    res.end();
                } else {
                    var readstream = gfs.createReadStream(options);

                    res.set('Content-Type', 'image/jpeg');

                    readstream.pipe(res);
                }
            });
        }
    };
};