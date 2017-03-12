/* globals module, require */

'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

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
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            index: true,
            required: true,
            auto: true
        },

        content: String,
        date: {
            type: Date,
            default: Date.now
        },
        author: String,
        authorAvatar: String,

        replies: [{
            content: String,
            date: {
                type: Date,
                default: Date.now
            },
            author: String,
            authorAvatar: String
        }]

    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Article', articleSchema);
module.exports = mongoose.model('Article');