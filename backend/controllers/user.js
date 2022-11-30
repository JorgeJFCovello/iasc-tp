//set users in redis

const { findByUserAndPass, saveUser } = require('../database/user');
const { client: db } = require('../utils/database');
const { getStringHash } = require('../utils/string');
const socketCache = require('../utils/sockets');
const socket = socketCache.proxySocket;
const logout = async (payload) => {
  const id = payload.auth;
  const user = await db.get(id);
  user.id = null;
  await saveUser(user);
  await db.del(id);
};
const listUsers = async () => {
  const users = await db.get('users');
  socket.emit('users', users);
};

const auth = async (payload) => {
  const { username, password } = payload;
  const user = await findByUserAndPass(username, password);
  if (user) {
    const logHash = `${user.username}_${getStringHash()}`;
    user.id = logHash;
    await db.set(logHash, JSON.stringify(user));
    await updateUser(user);
  } else {
    console.error('Invalid Credentials', JSON.stringify(payload));
  }
};
const updateUser = async (payload) => {
  const user = await findByUsername(payload.username);
  if (user) {
    saveUser(payload);
  }
  socket.emit('user-updated', user);
};

module.exports = { auth, logout, listUsers, updateUser };
