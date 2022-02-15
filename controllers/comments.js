const { getCommentsByArticleId } = require("../models/comments");
const { checkArticleExists } = require("../models/articles");

exports.getCommentsByArticleIdController = (req, res, next) => {
  const { article_id: articleId } = req.params;

  Promise.all([
    getCommentsByArticleId(articleId),
    checkArticleExists(articleId),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
