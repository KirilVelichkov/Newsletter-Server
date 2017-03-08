'use strict';
const jwt = require('jsonwebtoken');

module.exports = function ({ grid, database, data, encryption }) {
    return {
        login(req, res, next) {

            let username = req.body.username;
            let password = req.body.password;

            data.getByUsername(username)
                .then(user => {
                    if (user === null || !user.authenticate(password)) {
                        return res.json({
                            succes: 'false',
                            message: 'wrong username or password'
                        });
                    }

                    let token = jwt.sign(user, 'magicstring', {
                        expiresIn: 7200 // 2 hours in seconds
                    });
                    return res.status(200).json({
                        success: true,
                        message: `User ${user.username} logged in succesfully`,
                        token: 'JWT ' + token,
                        isUserBlocked: user.isBlocked
                    });
                });

        },
        register(req, res) {
            let gfs = grid(database.connection.db, database.mongo);

            if (req.body === null || typeof (req.body) === 'undefined') {
                return res.json({ success: false, message: 'request body is empty' });
            }

            let username = req.body.username;
            let email = req.body.email;
            let password = req.body.password.toString();
            let confirmedPassword = req.body.confirmedPassword.toString();

            if (password.length < 4) {
                return res.json({ success: false, message: 'Password too short' });
            }

            if (password !== confirmedPassword) {
                return res.json({ success: false, message: 'Passwords do not match' });
            }

            let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!pattern.test(email)) {
                return res.json({ success: false, message: 'Email is not valid' });
            }

            const salt = encryption.generateSalt();
            const passHash = encryption.generateHashedPassword(salt, password);
            let file = req.file;

            gfs.writeFile({}, file.buffer, (_, foundFile) => {
                let avatar = foundFile._id;

                Promise.all([data.getByUsername(username), data.getUserByEmail(email)])
                    .then(([existringUser, existingEmail]) => {

                        if (existringUser) {
                            return res.json({
                                success: false,
                                message: 'Username already exist!'
                            });
                        } else if (existingEmail) {
                            return res.json({
                                success: false,
                                message: 'Email already exist!'
                            });
                        }

                        data.createUser(username, passHash, avatar, email, salt)
                            .then(() => {
                                return res.status(201).json({
                                    success: true,
                                    message: `User ${username} created succesfully`
                                });
                            });
                    });
            });
        },
        logout(req, res) {
            req.logout();

            return res.status(202).json({
                succes: true,
                message: `User ${req.body.username} is logged out succesfully`
            });
        },
        getUserRoles(req, res) {
            return res.status(200).json(req.user.roles);
        },
        getLoggedUser(req, res) {

            if (!req.user) {
                return res.status(200).json({
                    success: false,
                    message: 'Please provide token'
                });
            }

            let user = {
                username: req.user.username,
                avatar: req.user.avatar,
                _id: req.user._id,
                roles: req.user.roles,
                isBlocked: req.user.isBlocked
            };

            return res.status(200).json(user);
        }
    };
};