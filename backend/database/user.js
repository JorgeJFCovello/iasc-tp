const { client: redis } = require('../utils/redis');
const saveUser = async (user) => {
  const users = JSON.parse(await redis.get('users'));
  const userIndex = users.findIndex((u) => u.username === user.username);
  users[userIndex] = user;
  await redis.set('users', JSON.stringify(users));
  await redis.set(user.id, JSON.stringify(user));
};
const findByUserAndPass = async (username, password) => {
  const user = await redis.get('users');
  return JSON.parse(user).find(
    (user) => user.password === password && user.username === username
  );
};

module.exports = { saveUser, findByUserAndPass };
