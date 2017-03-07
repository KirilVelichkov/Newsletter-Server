/* globals module, require */
'use strict';

module.exports = (models) => {
    const { User } = models;
    const { Article } = models;

    return {
        getArticleById(id) {
            return new Promise((resolve, reject) => {
                let result = Article.find({ _id: id });

                resolve(result);
            });
        },
        getAllArticles() {
            return new Promise((resolve, reject) => {
                let result = Article.find({});

                resolve(result);
            });
        },
        createArticle(title, content, image, author, category) {
            let article = new Article({
                title,
                content,
                image,
                author,
                category
            });

            return new Promise((resolve, reject) => {
                article.save((err) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(article);
                });
            });
        }
    };
};