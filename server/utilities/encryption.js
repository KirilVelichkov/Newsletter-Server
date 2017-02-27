const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = {
    generateSalt: () =>
        crypto.randomBytes(128).toString('base64'),
    generateHashedPassword: (salt, pwd) =>
        crypto.createHmac('sha256', salt).update(pwd).digest('hex'),
    deciferToken: (token) => {

        // need to remove 'JWT ' in order to decode it ... (i know it sucks!)
        let decoded = jwt.decode(token.split(' ')[1], 'magicstring');      

        let user = null;

        if (decoded === null) {
            // invalid Token
            return user;
        }

        const userInfo = decoded._doc;


        user = {
            username: userInfo.username
        };
        // add more info if you need it

        return user;
    }
};