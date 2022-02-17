const db = require("../db/connection");

exports.getArticles = async (sort_by = "created_at", order = "desc", topic) => {
  const greenListSortBy = [
    "created_at",
    "title",
    "topic",
    "author",
    "votes",
    "article_id",
  ];
  const greenListOrderBy = ["asc", "desc"];

  if (!greenListSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (!greenListOrderBy.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, COUNT(comments.article_id) AS comments_count FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  `;

  const queryValues = [];
  if (topic) {
    queryStr += `WHERE topic = $1 `;
    queryValues.push(topic);
  }
  queryStr += `GROUP BY articles.article_id
  ORDER BY articles.${sort_by} ${order}`;

  const result = await db.query(queryStr, queryValues);

  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Topic not found" });
  }
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
