const express = require('express');
const cookieParser = require('cookie-parser');
const { socketCache } = require('./utils/sockets');
const app = express();
const appWS = express();
const port = 5000;
const portWS = 5001;
const cors = require('cors');
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/api', require('./routes/index'));
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
  console.log('Received a connection');
  connectionData = new Date().getTime().toString();
  socketCache[connectionData] = socket;
});
app.listen(port, () => console.log(`WS listening on port ${port}!`));
http.listen(portWS, () => console.log(`WS listening on port ${portWS}!`));
