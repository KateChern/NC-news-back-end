const app = require("./app");
const { PORT = 24098 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
