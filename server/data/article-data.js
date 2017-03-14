/* globals module, require */
'use strict';

module.exports = (models) => {
    const { User } = models;
    const { Article } = models;

    return {
        getArticleById(id) {
            return new Promise((resolve, reject) => {
                let result = Article.findOne({ _id: id });

                resolve(result);
            });
        },
        getAllArticles() {
            return new Promise((resolve, reject) => {
                let result = Article.find({});

                resolve(result);
            });
        },
        getFilteredArticles(filter) {
            return new Promise((resolve, reject) => {

                let search = {
                    '$or':
                    [
                        { title: { $regex: filter, $options: 'i' } },
                        { category: { $regex: filter, $options: 'i' } },
                        { author: { $regex: filter, $options: 'i' } },
                        { content: { $regex: filter, $options: 'i' } },
                        { tags: { $regex: filter, $options: 'i' } }
                    ],
                    '$and': [{ isDeleted: false }]
                }

                let result = Article.find(search);

                resolve(result);
            });
        },
        getArticlesByCategory(category) {
            return new Promise((resolve, reject) => {

                let result = Article.find({ category, isDeleted: false });

                resolve(result);
            });
        },
        createArticle(title, content, image, author, category, tags) {
            let article = new Article({
                title,
                content,
                image,
                author,
                category,
                tags
            });

            return new Promise((resolve, reject) => {
                article.save((err) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(article);
                });
            });
        },
        addComment(articleId, comment) {
            return this.getArticleById(articleId)
                .then((foundArticle) => {
                    foundArticle.comments.push(comment);
                    foundArticle.save();
                })
        },
        replyComment(articleId, commentId, comment) {
            return this.getArticleById(articleId)
                .then((foundArticle) => {
                    foundArticle.comments.find(x => x._id == commentId).replies.push(comment);
                    foundArticle.save();
                });
        },
        getArticlesByPageAndSize(pageNumber, pageSize) {
            let skip = (+pageNumber - 1) * +pageSize;
            let limit = +pageSize;

            return new Promise((resolve, reject) => {
                let result = Article.find({ isDeleted: false })
                    .skip(skip)
                    .limit(limit);

                resolve(result);
            });
        },
        getAllArticlesCount() {
            return new Promise((resolve, reject) => {
                let result = Article.count({ isDeleted: false });

                resolve(result);
            });
        },
        updateArticle(articleId, title, content, image, category, isDeleted) {
            return this.getArticleById(articleId)
                .then((foundArticle) => {
                    foundArticle.title = title || foundArticle.title;
                    foundArticle.content = content || foundArticle.contnet;
                    foundArticle.image = image || foundArticle.image;
                    foundArticle.category = category || foundArticle.category;
                    foundArticle.isDeleted = isDeleted;

                    foundArticle.save();
                });
        }
    };
};