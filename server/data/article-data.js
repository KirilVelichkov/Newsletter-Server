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
                    ]
                }

                let result = Article.find(search);

                resolve(result);
            });
        },
        getArticlesByCategory(category) {
            return new Promise((resolve, reject) => {

                let result = Article.find({category});

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
        }
    };
};