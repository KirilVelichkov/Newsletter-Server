/* globals module, require */

'use strict';

const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    author: {
        type: String,
        require: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    tags: {
        type: [String]
    },
    comments: [{
        content: String,
        date: {
            type: Date,
            default: Date.now
        },
        author: String
    }]
});

mongoose.model('Article', articleSchema);
module.exports = mongoose.model('Article');