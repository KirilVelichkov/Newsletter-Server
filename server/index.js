'use strict';

const express = require('express');

const app = express();
const stage = 'development'; //process.env.NODE_ENV ||
const config = require('./config/config')[stage];
const passport = require('passport');
const grid = require('gridfs');
let multer = require('multer');
let storage = multer.memoryStorage();
const data = require('./data')();
const cors = require('cors');
const auth = require('./config/auth');
const database = require('./config/database')(config);
let upload = multer({ storage: storage });
app.use(cors());

const encryption = require('./utilities/encryption');

require('./config/express')(config, app);
const controllers = require('./controllers')({ app, database, grid, encryption, data, passport });
require('./routers')({ upload, app, controllers, passport, auth });


app.listen(config.port, () => console.log('Server running at port : ' + config.port));