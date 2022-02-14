const db = require("../db/connection");

exports.getArticles = async () => {
  const result = await db.query(
    `SELECT * FROM articles ORDER BY created_at desc;`
  );
  return result.rows;
};
