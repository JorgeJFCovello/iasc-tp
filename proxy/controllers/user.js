const { getStringHash } = require('../utils/string');
const socketCache = require('../utils/sockets');
const logout = async (req, resp) => {
  Object.values(socketCache).forEach((socket) =>
    socket.emit('logout', req.cookies)
  );
  resp.status(200).clearCookie('auth').json({ status: 'ok' });
};

const auth = async (req, resp) => {
  const { username, password } = req.body;
  const logHash = `${username}_${getStringHash()}`;
  Object.values(socketCache).forEach((socket) =>
    socket.emit('update-user-auth', { username, password, id: logHash })
  );
  resp.status(200).cookie('auth', logHash).json({ status: 'ok' });
};
module.exports = { auth, logout };
