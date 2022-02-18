const { getUsers, getUserByName } = require("../models/users");

exports.getUsers = (req, res, next) => {
  getUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByNameController = (req, res, next) => {
  const { username: userName } = req.params;
  getUserByName(userName)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
