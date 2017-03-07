/*globals */
'use strict';

const router = require('express').Router();

module.exports = function ({ upload, app, controllers, auth }) {
    const articleController = controllers.article;

    router
        .get('/article/:id', articleController.getArticleById)
        .get('/image/:id', articleController.getImage)
        .get('/all', articleController.getAllArticles)
        .post('/create', upload.single('image'), auth.isAuthenticated(), auth.isInRole('admin'), articleController.createArticle);

    app.use('/api/article', router);
};