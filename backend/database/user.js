const { client: db } = require('../utils/database');
const saveUser = async (user) => {
  const users = JSON.parse(await db.get('users'));
  const userIndex = users.findIndex((u) => u.username === user.username);
  users[userIndex] = user;
  await db.set('users', JSON.stringify(users));
  await db.set(user.id, JSON.stringify(user));
};
const findByUserAndPass = async (username, password) => {
  const user = await db.get('users');
  return JSON.parse(user).find(
    (user) => user.password === password && user.username === username
  );
};
const findByUsername = async (username) => {
  const user = await db.get('users');
  return JSON.parse(user).find((user) => user.username === username);
};
const findUserByHash = async (userhash) => {
  const user = await db.get(userhash);
  return JSON.parse(user);
};

module.exports = {
  saveUser,
  findByUserAndPass,
  findByUsername,
  findUserByHash,
};
