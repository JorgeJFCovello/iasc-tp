//set users in redis

const {
  findByUserAndPass,
  saveUser,
  findByUsername,
} = require('../database/user');
const { client: db } = require('../utils/database');
const { getStringHash } = require('../utils/string');
const socketCache = require('../utils/sockets');
const logout = async (payload) => {
  const id = payload.auth;
  const user = await db.get(id);
  user.id = null;
  await saveUser(user);
  await db.del(id);
};
const listUsers = async () => {
  const users = await db.get('users');
  socketCache.proxySocket.emit('users', users);
};

const auth = async (payload) => {
  const { username, password, id } = payload;
  const user = await findByUserAndPass(username, password);
  if (user) {
    user.id = id;
    await db.set(id, JSON.stringify(user));
    await updateUser(user);
  } else {
    console.error('Invalid Credentials', JSON.stringify(payload));
  }
};
const updateUser = async (payload) => {
  const user = await findByUsername(payload.username);
  if (user) {
    await saveUser(payload);
  }
  socketCache.proxySocket.emit('user-updated', user);
};

module.exports = { auth, logout, listUsers, updateUser };
