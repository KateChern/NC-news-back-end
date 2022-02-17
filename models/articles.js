const db = require("../db/connection");

exports.getArticles = async () => {
  const result = await db.query(
    `SELECT articles.* , COUNT(comments.article_id) AS comments_count FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at desc;`
  );
  return result.rows;
};

exports.getArticleById = async (article_id) => {
  const result = await db.query(
    `SELECT * FROM articles WHERE article_id = $1;`,
    [article_id]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  }

  return result.rows[0];
};

exports.updateArticleById = async (articleId, updatedVotes) => {
  const result = await db.query(
    `UPDATE articles SET votes = $2 WHERE article_id = $1 RETURNING *;`,
    [articleId, updatedVotes]
  );
  return result.rows[0];
};

exports.checkArticleExists = async (articleId) => {
  const result = await db.query(
    `SELECT * FROM articles WHERE article_id = $1;`,
    [articleId]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  }
  return result.rows;
};
