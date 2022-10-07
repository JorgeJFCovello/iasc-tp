const express = require('express');
const routes = require('./routes');
const app = express();
const port = 8080;
app.use(routes)
app.listen(port, () => console.log(`App listening on port ${port}!`));