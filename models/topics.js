const db = require("../db/connection");

exports.getTopics = async () => {
  const result = await db.query(`SELECT * FROM topics;`);
  return result.rows;
};
