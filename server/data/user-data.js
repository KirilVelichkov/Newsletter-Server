/* globals module, require */
'use strict';

module.exports = (models) => {
    const { User } = models;
    const { Article } = models;

    return {
        getAll() {
            return new Promise((resolve, reject) => {
                User.find({}, (err, user) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(user);
                });
            });
        },
        getUserById(userId) {
            return new Promise((resolve, reject) => {
                User.findOne({ _id: userId }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
            });
        },
        getUserByEmail(email) {
            return new Promise((resolve, reject) => {
                User.findOne({ email }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(user);
                });
            });
        },
        getByUsername(username) {
            return new Promise((resolve, reject) => {
                User.findOne({ username: username }, (err, user) => {

                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
            });
        },
        createUser(username, passHash, avatar, email, salt) {
            let user = new User({
                username: username,
                passHash: passHash,
                email: email,
                salt: salt,
                roles: ['regular'],
                avatar: avatar
            });

            return new Promise((resolve, reject) => {
                user.save((err) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
            });
        },
        updateUserPrivateInfo(id, info) {
            return new Promise((resolve, reject) => {
                Promise.all([this.getUserById(id), this.getUserByEmail(info.email)])
                    .then(([userFromId, userFromMail]) => {
                        if (userFromMail) {
                            reject(userFromId);
                        }

                        userFromId.passHash = info.passHash || userFromId.passHash;
                        userFromId.email = info.email || userFromId.email;
                        userFromId.avatar = info.avatar || userFromId.avatar;

                        userFromId.save();
                        resolve(userFromId);
                    });

            });
        }
    };
};