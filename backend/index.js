const express = require('express');
const routes = require('./routes');
const socketCache = require('./utils/sockets');
const app = express();
const port = 8080;
const cors = require('cors');
app.use(cors());
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
io.on('connection', (socket) => {
  connectionData = new Date().getTime().toString();
  console.log(socket);
  socketCache[connectionData] = socket;
});
app.use(express.json());
app.use('/api', routes);
http.listen(port, () => console.log(`App listening on port ${port}!`));
