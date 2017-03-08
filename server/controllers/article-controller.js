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
            let category = req.params.category.toUpperCase();

            data.getArticlesByCategory(category)
                .then((result) => {
                    return res.status(200).json(result);
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
        }
    };
};