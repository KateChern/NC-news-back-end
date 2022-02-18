const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");

afterAll(() => db.end());
beforeEach(() => seed(data));

describe("app", () => {
  describe("GET - /api/topics", () => {
    test("status:200, responds with an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
          expect(topics).toBeInstanceOf(Array);
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
    test("status:404, responds with a message 'Path not found' when there is an incorrect pathway", () => {
      return request(app)
        .get("/api/topic")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Path not found");
        });
    });
  });

  describe("GET - /api/articles", () => {
    test("status:200, responds with an array of articles objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(12);
          expect(articles).toBeInstanceOf(Array);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    test("status:200, responds with an array of articles objects with new column 'comments_count'", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(12);
          expect(articles).toBeInstanceOf(Array);
          expect(articles[4].comments_count).toEqual("2");
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                comments_count: expect.any(String),
              })
            );
          });
        });
    });
    test("status:404, responds with a message 'Path not found' when there is an incorrect pathway", () => {
      return request(app)
        .get("/api/article")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Path not found");
        });
    });
    test("status:200, articles are sorted by date, descending order by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("status:200, accepts sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("topic", { descending: true });
        });
    });
    test("status:400, for invalid sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=invalid_text")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("status:200, allow a client to change the sort order with an order query", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { ascending: true });
        });
    });
    test("status:400, for invalid order query", () => {
      return request(app)
        .get("/api/articles?order=falsy")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("status:200, accepts topic query", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(1);
        });
    });
    test("status:404, for invalid topic", () => {
      return request(app)
        .get("/api/articles?topic=some-invalid-topic")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Topic not found");
        });
    });
  });
  describe("GET - /api/articles/:article_id", () => {
    test("status:200, responds with an article object", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            body: "some gifs",
            comment_count: "2",
            author: "icellusedkars",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
          });
        });
    });
    test("status:200, responds with an array of articles objects with new column 'comments_count'", () => {
      return request(app)
        .get("/api/articles/9")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.comment_count).toEqual("2");
          expect(article).toEqual(
            expect.objectContaining({
              comment_count: expect.any(String),
            })
          );
        });
    });
    test("status:404, responds with a message 'Article not found' when id doesn't exist", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article not found");
        });
    });
    test("status:400, responds with a message 'Bad request' for invalid article_id", () => {
      return request(app)
        .get("/api/articles/not-an-id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
  describe("PATCH - /api/articles/:article_id", () => {
    test("status:200, responds with the updated article object", () => {
      const articleUpdates = {
        inc_votes: 10,
      };
      return request(app)
        .patch("/api/articles/3")
        .send(articleUpdates)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            body: "some gifs",
            author: "icellusedkars",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 10,
          });
        });
    });
    test("status:200, responds with the updated article object if the value of updates is empty", () => {
      const articleUpdates = {
        inc_votes: "",
      };
      return request(app)
        .patch("/api/articles/3")
        .send(articleUpdates)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            body: "some gifs",
            author: "icellusedkars",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
          });
        });
    });
    test("status:404, responds with a message 'Article not found' when id doesn't exist", () => {
      const articleUpdates = {
        inc_votes: 10,
      };
      return request(app)
        .patch("/api/articles/999")
        .send(articleUpdates)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article not found");
        });
    });
    test("status:400, responds with a message 'Bad request' for invalid article_id", () => {
      const articleUpdates = {
        inc_votes: 10,
      };
      return request(app)
        .patch("/api/articles/not-an-id")
        .send(articleUpdates)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("status:400, responds with a message 'Bad request' for invalid body", () => {
      const articleUpdates = {
        inc_votes: "hello",
      };
      return request(app)
        .patch("/api/articles/3")
        .send(articleUpdates)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
  describe("GET - /api/articles/:article_id/comments", () => {
    test("status:200, responds with an array of comments objects", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(11);
          expect(comments).toBeInstanceOf(Array);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                body: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
              })
            );
          });
        });
    });
    test("status:200, responds with an empty array when theres are no comments associated with article_id", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(0);
        });
    });
    test("status:400, responds with a message 'Bad request' for invalid article_id", () => {
      return request(app)
        .get("/api/articles/not-an-id/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("status:404, responds with a message 'Article not found' when article_id is valid but doesn't exist", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article not found");
        });
    });
  });
  describe("POST - /api/articles/:article_id/comments", () => {
    test("status:201, responds with the updated article object", () => {
      const testComment = {
        username: "lurker",
        body: "test",
      };

      return request(app)
        .post("/api/articles/4/comments")
        .send(testComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            comment_id: 19,
            body: "test",
            article_id: 4,
            author: "lurker",
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
    test("status:400, responds with a message 'invalid username or article' for invalid username", () => {
      const testComment = {
        username: "newUser",
        body: "test",
      };
      return request(app)
        .post("/api/articles/4/comments")
        .send(testComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid username or article");
        });
    });
    test("status:400, responds with a message 'Bad request' for invalid article_id", () => {
      const testComment = {
        username: "lurker",
        body: "test",
      };
      return request(app)
        .post("/api/articles/not-id/comments")
        .send(testComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("status:400, responds with a message 'Article not found' when article_id is valid but doesn't exist", () => {
      const testComment = {
        username: "lurker",
        body: "test",
      };
      return request(app)
        .post("/api/articles/20/comments")
        .send(testComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article not found");
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    test("status:204, deletes comment", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    test("status:400, responds with a message 'Bad request' for invalid comment_id", () => {
      return request(app)
        .delete("/api/comments/not-id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
  describe("GET - /api/users", () => {
    test("status:200, responds with an array of users objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          expect(users).toBeInstanceOf(Array);
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
              })
            );
          });
        });
    });
    test("status:404, responds with a message 'Path not found' when there is an incorrect pathway", () => {
      return request(app)
        .get("/api/user")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Path not found");
        });
    });
  });
  describe("GET - /api", () => {
    test("status:200, responds with an object", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(endpoints).toBeInstanceOf(Object);
          expect(endpoints).toMatchObject({
            "GET /api": expect.any(Object),
            "GET /api/topics": expect.any(Object),
            "GET /api/articles": expect.any(Object),
            "GET /api/users": expect.any(Object),
            "GET /api/articles/:article_id": expect.any(Object),
            "PATCH /api/articles/:article_id": expect.any(Object),
            "POST /api/articles/:article_id/comments": expect.any(Object),
            "GET /api/articles/:article_id/comments": expect.any(Object),
            "DELETE /api/comments/:comment_id": expect.any(Object),
          });
        });
    });
  });
  describe("PATCH /api/comments/:comment_id", () => {
    test("status:200, returns updated comment and increments votes correctly", () => {
      const testUpdate = { inc_votes: 10 };
      return request(app)
        .patch("/api/comments/1")
        .send(testUpdate)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 26,
            author: "butter_bridge",
            article_id: 9,
            created_at: expect.any(String),
          });
        });
    });
    test("status:200, returns updated comment and decrements votes correctly", () => {
      const testUpdate = { inc_votes: -10 };
      return request(app)
        .patch("/api/comments/1")
        .send(testUpdate)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 6,
            author: "butter_bridge",
            article_id: 9,
            created_at: expect.any(String),
          });
        });
    });
    test("status: 400, responds with a message 'Bad request' for invalid body object", () => {
      const testUpdate = { inc_votes: "not-a-number" };
      return request(app)
        .patch("/api/comments/1")
        .send(testUpdate)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("status:200, returns unchanged comment when missing data on the patch object", () => {
      const testUpdate = { inc_votes: "" };
      return request(app)
        .patch("/api/comments/1")
        .send(testUpdate)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 16,
            author: "butter_bridge",
            article_id: 9,
            created_at: expect.any(String),
          });
        });
    });
    test("status:404, responds with a message 'Comment not found' when id is valid but doesn't exist", () => {
      const testUpdate = { inc_votes: 10 };
      return request(app)
        .patch("/api/comments/10000")
        .send(testUpdate)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Comment not found");
        });
    });
    test("status 200: responds with unchanged comment when passed a misspelt key on patch object", () => {
      const testUpdate = { inc_votessss: "10" };
      return request(app)
        .patch("/api/comments/1")
        .send(testUpdate)
        .expect(200)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toMatchObject({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 16,
            author: "butter_bridge",
            article_id: 9,
            created_at: expect.any(String),
          });
        });
    });
    describe("GET - /api/users/:username", () => {
      test("status:200, responds with a user object", () => {
        return request(app)
          .get("/api/users/rogersop")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).toEqual({
              username: "rogersop",
              name: "paul",
              avatar_url:
                "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
            });
          });
      });
      test("status:404, responds with a message 'User not found' when username doesn't exist", () => {
        return request(app)
          .get("/api/users/not-a-user")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("User not found");
          });
      });
    });
  });
});
