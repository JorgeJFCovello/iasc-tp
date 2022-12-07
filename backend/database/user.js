const { client: db } = require('../utils/database');
const saveUser = async (user) => {
  const users = JSON.parse(await db.get('users'));
  const userIndex = users.findIndex((u) => u.username === user.username);
  users[userIndex] = user;
  await db.set('users', JSON.stringify(users));
  if (user.id) {
    await db.set(user.id, user.username);
  }
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
  const username = await db.get(userhash);
  return await findByUsername(username);
};

module.exports = {
  saveUser,
  findByUserAndPass,
  findByUsername,
  findUserByHash,
};
