/*globals */
'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function ({ upload, app, controllers, passport, auth }) {

    fs.readdirSync(__dirname)
        .filter(x => x.includes('-router'))
        .forEach(file => {
            require(path.join(__dirname, file))({ upload, app, controllers, passport, auth });
        });
};