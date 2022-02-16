const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics");
const {
  getArticles,
  getArticleByIdController,
  updateArticleByIdController,
} = require("./controllers/articles");

const {
  getCommentsByArticleIdController,
  addCommentToArticle,
} = require("./controllers/comments");

app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleByIdController);
app.patch("/api/articles/:article_id", updateArticleByIdController);
app.get("/api/articles/:article_id/comments", getCommentsByArticleIdController);
app.post("/api/articles/:article_id/comments", addCommentToArticle);

app.use((err, req, res, next) => {
  if (err.status && err.msg) res.status(err.status).send({ msg: err.msg });
  else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") res.status(400).send({ msg: "Bad request" });
  else next(err);
});
app.use((err, req, res, next) => {
  if (err.code === "23503")
    res.status(400).send({ msg: "invalid username or article" });
  else next(err);
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Uh oh! Server Error!" });
});
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
