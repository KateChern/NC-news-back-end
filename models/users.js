const db = require("../db/connection");

exports.getUsers = async () => {
  const result = await db.query(`SELECT * FROM users;`);

  return result.rows;
};
