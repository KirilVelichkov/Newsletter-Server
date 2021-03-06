'use strict';

module.exports = function ({ grid, database, data, encryption }) {
    return {
        getArticleById(req, res) {
            let id = req.params.id;

            data.getArticleById(id)
                .then((result) => {
                    return res.status(200).json(result);
                });
        },
        getAllArticles(req, res) {
            data.getAllArticles()
                .then((result) => {
                    return res.status(200).json(result);
                });
        },
        getFilteredArticles(req, res) {
            let filter = req.params.filter;

            data.getFilteredArticles(filter)
                .then((result) => {
                    return res.status(200).json(result);
                });
        },
        getArticlesByCategory(req, res) {
            let category = req.query.category.toUpperCase();
            let pageNumber = req.query.pageNumber;
            let pageSize = req.query.pageSize;
            
            data.getArticlesByCategory(category, pageNumber, pageSize)
                .then((result) => {
                    return res.status(200).json(result);
                });
        },
        getImage(req, res) {
            let gfs = grid(database.connection.db, database.mongo);

            let options = {
                _id: req.params.id
            };

            gfs.exist(options, (_, exists) => {
                if (!exists) {
                    res.status(404);
                    res.end();
                } else {
                    var readstream = gfs.createReadStream(options);

                    res.set('Content-Type', 'image/jpeg');

                    readstream.pipe(res);
                }
            });
        },
        createArticle(req, res, next) {

            let gfs = grid(database.connection.db, database.mongo);

            let title = req.body.title;
            let content = req.body.content;
            let author = req.user.username;
            let file = req.file;
            let tags = req.body.tags.split(',');

            let category = req.body.category;

            gfs.writeFile({}, file.buffer, (_, foundFile) => {
                let image = foundFile._id;

                data.createArticle(title, content, image, author, category, tags)
                    .then((c) => {
                        return res.status(201).json({
                            success: true,
                            message: 'Article created!'
                        });
                    });
            });
        },
        addComment(req, res, next) {
            let articleId = req.params.articleId;

            let comment = {
                content: req.body.content,
                author: req.user.username,
                authorAvatar: req.user.avatar
            }
            console.log(req.url);

            return data.addComment(articleId, comment)
                .then((c) => {
                    return res.status(201).json({
                        success: true,
                        message: 'Comment added!'
                    });
                });
        },
        replyComment(req, res, next) {
            let articleId = req.params.articleId;
            let commentId = req.params.commentId;

            let comment = {
                content: req.body.content,
                author: req.user.username,
                authorAvatar: req.user.avatar
            }

            return data.replyComment(articleId, commentId, comment)
                .then((c) => {
                    return res.status(201).json({
                        success: true,
                        message: 'Comment added!'
                    });
                });
        },
        getAllArticlesCount(req, res) {
            data.getAllArticlesCount()
                .then((result) => {
                    return res.status(200).json(result);
                });
        },
        getArticlesByPageAndSize(req, res) {
            let pageNumber = req.query.pageNumber;
            let pageSize = req.query.pageSize;
            
            data.getArticlesByPageAndSize(pageNumber, pageSize)
                .then((result) => {
                    console.log(result);
                    
                    return res.status(200).json(result);
                });
        },
        getAllArticlesCountByCategory(req, res) {
            let category = req.params.category;
            
            data.getAllArticlesCountByCategory(category)
                .then((result) => {
                    return res.status(200).json(result);
                });
        },
        updateArticle(req, res) {
            let gfs = grid(database.connection.db, database.mongo);

            let articleId = req.params.id;

            let title = req.body.title;
            let content = req.body.content;
            let file = req.file;
            let category = req.body.category;
            let isDeleted = req.body.isDeleted;
            console.log(isDeleted);
            
            if (isDeleted) {
                isDeleted = true;
            } else {
                isDeleted = false;
            }
            console.log(isDeleted);
            if (file) {
                console.log('image');
                
                gfs.writeFile({}, file.buffer, (_, foundFile) => {
                    let image = foundFile._id;

                    data.updateArticle(articleId, title, content, image, category, isDeleted)
                        .then(() => {
                            return res.status(201).json({
                                success: true,
                                message: 'Article updated!'
                            });
                        });
                });
            } else {
                data.updateArticle(articleId, title, content, false, category, isDeleted)
                    .then(() => {
                        return res.status(201).json({
                            success: true,
                            message: 'Article updated!'
                        });
                    });
            }

        }

    };
};