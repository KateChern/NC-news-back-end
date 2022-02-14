const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics");

app.use(express.json());
app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Uh oh! Server Error!" });
});
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
