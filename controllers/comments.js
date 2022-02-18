const {
  getCommentsByArticleId,
  addComment,
  deleteComment,
  updateCommentById,
} = require("../models/comments");
const {
  checkArticleExists,
  checkCommentExists,
} = require("../models/articles");

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

exports.addCommentToArticle = (req, res, next) => {
  const { article_id: articleId } = req.params;
  checkArticleExists(articleId)
    .then((article) => {
      if (article) {
        addComment(req.body, articleId)
          .then((comment) => {
            res.status(201).send({ comment });
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

exports.deleteCommentController = (req, res, next) => {
  const { comment_id: commentId } = req.params;

  deleteComment(commentId)
    .then((comments) => {
      res.status(204).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateCommentByIdController = (req, res, next) => {
  const { comment_id: commentId } = req.params;
  const { inc_votes: incVotes } = req.body;

  updateCommentById(commentId, incVotes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
