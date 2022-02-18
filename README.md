# Northcoders-news Back-End

This is a RESTful API for Northcoders News database. The database is `PSQL`, interacted with via `node-postgres`. It contains data on users, articles, topics and comments, which are accessible via the endpoints provided and appropriate GET, POST, PATCH and DELETE methods. A complete list of endpoints and methods is accessible in the `endpoints.json` file.

Testing was carried out using Jest and Supertest.

API has been hosted with Heroku [here](https://northcoders-news-b-end.herokuapp.com/api).

### Prerequisites

Please ensure the following are installed:

Node: v16.13.2
Postgres: ^8.7.3
npm: v8.1.2
dotenv: ^16.0.0,
express: ^4.17.2

## Getting Started

To run this project you will need to do the following:

1. Clone this repository onto your local machine.

```
git clone https://github.com/KateChern/Northcoders-news-b-end.git

```

2. Navigate inside the folder

```
cd northcoders-news-b-end

```

3. Open the directory in your code editor.

```
code . (for VScode)
```

4. Install all dependencies

```
npm install
```

5. Create two .env files in order to successfully connect to the two databases locally: **.env.test** and **.env.development**. Inside each, add `PGDATABASE=nc_news_test`, and `PGDATABASE=nc_news` respectively.

6. Create the databases by running the following command in your terminal:

```
npm run setup-dbs
```

7. Run the following command to seed the development database:

```
 npm run seed
```

8. Finally to run the server locally enter the following command in your terminal:

```
npm start
```

This will run the server on port 9090. All endpoints can be found locally on http://localhost:9090/api.

## Testing

To test the API navigate to the project directory and enter the following command:

```
npm test
```

## API Routes

```
GET /api/topics
```

returns a list of all topics

```
GET /api/users
```

returns a list of all users

```
GET /api/articles
```

returns a list of all articles

```
GET /api/articles/:article_id
```

returns an article corresponding to the article_id passed in

```
PATCH /api/articles/:article_id
```

modifies the votes on the requested article

```
GET /api/articles/:article_id/comments
```

returns a list of all comments corresponding to the article_id

```
POST /api/articles/:article_id/comments
```

adds a new comment to the requested article

```
DELETE /api/comments/:comment_id
```

deletes the selected comment from the list of all comments

```
GET /api
```

returns a json object of the path above, with example responses
