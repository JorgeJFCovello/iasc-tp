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
let leader = true;
const markMyselfAsLeader = () => (leader = true);
const markMyselfAsFollower = () => (leader = false);
const initLeaderElection = (socket) => {
  if (!leader) {
    const isLeader = socketCache['leader'] === socket;
    if (!isLeader) return;
    markMyselfAsLeader();
    //a los sockets que no estan desconectados les envio que voy a ser lider
    Object.values(socketCache)
      .filter((ws) => ws !== socket)
      .forEach((ws) => {
        ws.emit('leader');
      });
  }
};
const pingOtherFollowers = () => {
  while (leader) {
    setTimeout(() => {
      //esto no tiene que ser asi adentro del while, tenemos que conectarnos a todos antes y despues hacemos el emit por cada uno
      const followerSocket = socketClient.connect(process.env.BACKEND_URL);
      socketCache['followers'] = [...socketCache.followers, followerSocket];
      followerSocket.emit('leader');
    }, 3000);
  }
};
io.on('disconnection', (socket) => {
  console.log('disconnected');
  initLeaderElection(socket);
});
io.on('leader', (socket) => {
  markMyselfAsFollower();
  socketCache['leader'] = socket;
});
//socket client
const socketClient = require('socket.io-client');
http.listen(portWS, () => console.log(`WS listening on port ${portWS}!`));
app.listen(port, () => console.log(`App listening on port ${port}!`));
pingOtherFollowers();
