/*globals */
'use strict';

const router = require('express').Router();

module.exports = function ({ upload, app, controllers, auth }) {
    const articleController = controllers.article;

    router
        .get('/article/:id', articleController.getArticleById)
        .get('/image/:id', articleController.getImage)
        .get('/category/:category&:pageNumber&:pageSize', articleController.getArticlesByCategory)
        .get('/all', articleController.getAllArticles)
        .get('/all/count', articleController.getAllArticlesCount)
        .get('/all/count/:category', articleController.getAllArticlesCountByCategory)
        .get('/all/:pageNumber&:pageSize', articleController.getArticlesByPageAndSize)
        .get('/search/:filter', articleController.getFilteredArticles)
        .post('/create', upload.single('image'), auth.isAuthenticated(), auth.isInRole('admin'), articleController.createArticle)
        .post('/replyComment/:articleId/:commentId', auth.isAuthenticated(), articleController.replyComment)
        .post('/addComment/:articleId', auth.isAuthenticated(), articleController.addComment)
        .put('/update/:id', upload.single('image'), auth.isAuthenticated(), auth.isInRole('admin'), articleController.updateArticle);
    
    app.use('/api/article', router);
};