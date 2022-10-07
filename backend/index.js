const express = require('express');
const routes = require('./routes');
const app = express();
const port = 8080;
const http = require('http').Server(app);
app.use(express.json());
app.use('/api', routes);
http.listen(port, () => console.log(`App listening on port ${port}!`));
