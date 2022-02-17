const endpoints = require("../endpoints.json");

exports.getEndpoints = () => {
  if (endpoints) {
    const endpointsStr = JSON.stringify(endpoints);
    return Promise.resolve(endpointsStr);
  } else {
    return Promise.reject({ status: 404, msg: "Not found" });
  }
};
