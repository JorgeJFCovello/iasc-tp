const { createClient } = require('redis');
require('dotenv').config();
const client = createClient({ url: process.env.REDIS_URL });
const User = require('../models/user');
client.on('error', (err) => console.log('Redis Client Error', err));
const initRedis = () =>
  client
    .connect()
    .then(() => {
      client.set(
        'users',
        JSON.stringify([
          // id, name, email, password, username)
          new User(null, 'pepe', 'pepe@gmail.com', 'pepe', 'pepe'),
          new User(null, 'pepa', 'pepa@gmail.com', 'pepa', 'pepa'),
          new User(null, 'pepo', 'pepo@gmail.com', 'pepo', 'pepo'),
          new User(
            null,
            'pepepito',
            'pepepito@gmail.com',
            'pepepito',
            'pepepito'
          ),
        ])
      );
    })
    .then(() => {
      console.log('Connected to redis');
    })
    .catch((err) => {
      console.log('Error conecting redis', err);
      setTimeout(initRedis, 60000);
    });
module.exports = { initRedis, client };
