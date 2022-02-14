const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics");
const { getArticles } = require("./controllers/articles");

app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Uh oh! Server Error!" });
});
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
