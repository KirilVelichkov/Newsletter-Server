const path = require('path');
const rootPath = path.normalize(path.join(__dirname, '/../../'));
const PORT = process.env.PORT || 1337;

module.exports = {
    development: {
        rootPath: rootPath,
        connectionString: 'mongodb://Admin:admin1234@ds119608.mlab.com:19608/frontendproject', 
        port: PORT,
        secret: 'magicstring'
    },
    production: {
        rootPath: rootPath,
        connectionString: process.env.CONNECTION_STRING,
        port: PORT,
        secret: process.env.JWT_SECRET
    }
};