/*globals */
'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function ({ app, database, grid, encryption, data, passport }) {

    let controllers = {};
    fs.readdirSync(__dirname)
        .filter(file => file.includes('-controller'))
        .forEach(file => {
            let controllerModule = require(path.join(__dirname, file))({ app, database, grid, encryption, data, passport });

            let moduleName = file.substring(0, file.indexOf('-controller'));
            controllers[moduleName] = controllerModule;
        });

    return controllers;

};