const {
  getArticles,
  getArticleById,
  updateArticleById,
} = require("../models/articles");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;

  getArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleByIdController = (req, res, next) => {
  const { article_id } = req.params;

  getArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticleByIdController = (req, res, next) => {
  const { article_id: articleId } = req.params;

  getArticleById(articleId)
    .then((article) => {
      if (article) {
        const updatedVotes = (article["votes"] += req.body.inc_votes);

        updateArticleById(articleId, updatedVotes)
          .then((article) => {
            res.status(200).send({ article });
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};
