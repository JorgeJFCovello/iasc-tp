const express = require('express');
const cookieParser = require('cookie-parser');
const socketCache = require('./utils/sockets');
const app = express();
const port = 8080;
const cors = require('cors');
app.use(cors());
app.use(cookieParser());
app.use(express.json());
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/',
  cors: {
    origin: [process.env.FRONTEND_URL, process.env.BACKEND_URL],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
io.on('connection', (socket) => {
  connectionData = new Date().getTime().toString();
  socketCache[connectionData] = socket;
});
http.listen(port, () => console.log(`WS listening on port ${port}!`));
