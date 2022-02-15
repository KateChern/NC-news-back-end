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
            author: "icellusedkars",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
          });
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
});
