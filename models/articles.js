const db = require("../db/connection");

exports.getArticles = async () => {
  const result = await db.query(
    `SELECT * FROM articles ORDER BY created_at desc;`
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
  //   console.log(article, updates);
  //   const updatedVotes = article['votes'] += updates.inc_votes;

  const result = await db.query(
    `UPDATE articles SET votes = $2 WHERE article_id = $1 RETURNING *;`,
    [articleId, updatedVotes]
  );
  return result.rows[0];
};
