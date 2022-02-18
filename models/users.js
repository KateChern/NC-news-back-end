const db = require("../db/connection");

exports.getUsers = async () => {
  const result = await db.query(`SELECT * FROM users;`);

  return result.rows;
};

exports.getUserByName = async (userName) => {
  const result = await db.query(`SELECT * FROM users WHERE username = $1;`, [
    userName,
  ]);
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "User not found" });
  }
  return result.rows[0];
};
