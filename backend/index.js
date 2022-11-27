const express = require('express');
const routes = require('./routes');
const { initDatabase } = require('./utils/database');
const cookieParser = require('cookie-parser');
const socketCache = require('./utils/sockets');
const app = express();
const appWS = express();
const port = 8080;
const portWS = 8081;
const cors = require('cors');
app.use(cors());
app.use(cookieParser());
initDatabase();
app.use(express.json());
app.use('/api', routes);
const http = require('http').Server(appWS);
const io = require('socket.io')(http, {
  path: '/',
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
io.on('connection', (socket) => {
  connectionData = new Date().getTime().toString();
  socketCache[connectionData] = socket;
});
http.listen(portWS, () => console.log(`WS listening on port ${portWS}!`));
app.listen(port, () => console.log(`App listening on port ${port}!`));
