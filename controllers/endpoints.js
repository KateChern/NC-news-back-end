const { getEndpoints } = require("../models/endpoints");
// const endpoints = require("../endpoints.json");

exports.getEndpointsController = (req, res, next) => {
  getEndpoints()
    .then((response) => {
      const endpoints = JSON.parse(response);
      res.status(200).send({ endpoints });
    })
    .catch((err) => {
      next(err);
    });
};
