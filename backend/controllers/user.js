//set users in redis

const { findByUserAndPass, saveUser } = require('../database/user');
const { client: redis } = require('../utils/redis');
const { getStringHash } = require('../utils/string');

const logout = async (req, resp) => {
  const id = req.cookies.auth;
  const user = await redis.get(id);
  user.id = null;
  await saveUser(user);
  await redis.del(id);
  resp.status(200).clearCookie('auth').json({ status: 'ok' });
};
const listUsers = async (req, resp) => {
  const users = await redis.get('users');
  resp.status(200).json(users);
};

const auth = async (req, resp) => {
  const { username, password } = req.body;
  const user = await findByUserAndPass(username, password);
  if (user) {
    const logHash = `${user.username}_${getStringHash()}`;
    user.id = logHash;
    await redis.set(logHash, JSON.stringify(user));
    await saveUser(user);
    resp.status(200).cookie('auth', logHash).json({ status: 'ok' });
  } else {
    resp.status(401).json({ message: 'Invalid Credentials' });
  }
};

module.exports = { auth, logout, listUsers };
