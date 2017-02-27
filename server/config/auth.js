const passport = require('passport');

module.exports = {
    isAuthenticated: (req, res, next) => {
        return passport.authenticate('jwt', { session: false });
    },
    isBlocked: () =>
        (req, res, next) => {
            if (req.user && !req.user.isBlocked) {
                next();
            } else {
                res.status(401).json({
                    succes: false,
                    message: 'Your account has been blocked!'
                });
            }
        },
    isInRole: (role) =>
        (req, res, next) => {
            if (req.user && req.user.roles.indexOf(role) > -1) {
                next();
            } else {
                res.status(401).json({
                    succes: false,
                    message: 'You do not have admin rights!'
                });
            }
        }
};