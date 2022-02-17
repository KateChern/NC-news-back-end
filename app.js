const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics");
const { getUsers } = require("./controllers/users");
const {
  getArticles,
  getArticleByIdController,
  updateArticleByIdController,
} = require("./controllers/articles");

const {
  getCommentsByArticleIdController,
  addCommentToArticle,
  deleteCommentController,
} = require("./controllers/comments");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleInvalidRequest,
  handleServerErrors,
} = require("./errors-controllers");

app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", getArticleByIdController);
app.patch("/api/articles/:article_id", updateArticleByIdController);
app.get("/api/articles/:article_id/comments", getCommentsByArticleIdController);
app.post("/api/articles/:article_id/comments", addCommentToArticle);
app.delete("/api/comments/:comment_id", deleteCommentController);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleInvalidRequest);
app.use(handleServerErrors);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
