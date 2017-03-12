const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = (config) => {
     mongoose.connect(config.connectionString);

    let db = mongoose.connection;

    db.once('open', (err) => {
        if (err) {
            console.log(err);
        }

        console.log('Mongo connected!');
    });

    db.on('error', err => console.log('Database error: ' + err));

    return mongoose;
};