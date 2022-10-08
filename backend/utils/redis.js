const { createClient } = require('redis');
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
module.exports = { initRedis, client };
