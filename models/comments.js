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
