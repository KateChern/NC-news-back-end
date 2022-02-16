const db = require("../db/connection");

exports.getCommentsByArticleId = async (articleId) => {
  const result = await db.query(
    `SELECT * FROM comments WHERE article_id = $1;`,
    [articleId]
  );

  return result.rows;
};

exports.addComment = async (newComment, articleId) => {
  const { username, body } = newComment;

  const result = await db.query(
    `INSERT INTO comments (body, author, article_id) VALUES ($2, $1, $3) RETURNING *;`,
    [username, body, articleId]
  );
  return result.rows[0];
};

exports.checkCommentExists = async (commentId) => {
  const result = await db.query(
    `SELECT * FROM comments WHERE comment_id = $1;`,
    [commentId]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Comment not found" });
  }
  return result.rows;
};

exports.deleteComment = async (commentId) => {
  const result = await db.query(`DELETE FROM comments WHERE comment_id = $1;`, [
    commentId,
  ]);

  return result.rows;
};
