const db = require("../db/connection");

exports.getCommentsByArticleId = async (articleId) => {
  const result = await db.query(
    `SELECT * FROM comments WHERE article_id = $1;`,
    [articleId]
  );

  return result.rows;
};
