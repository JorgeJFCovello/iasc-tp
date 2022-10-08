const express = require('express');
const routes = require('./routes');
const { createClient } = require('redis');
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
  socketCache[connectionData] = socket;
});

const client = createClient({ url: 'redis://default:redispw@localhost:49153' });

client.on('error', (err) => console.log('Redis Client Error', err));
const initRedis = () =>
  client
    .connect()
    .then(() => console.log('Connected to redis'))
    .catch((err) => {
      console.log('Error conecting redis', err);
      setTimeout(initRedis, 60000);
    });
initRedis();
app.use(express.json());
app.use('/api', routes);
http.listen(port, () => console.log(`App listening on port ${port}!`));
