const { getStringHash } = require('../utils/string');
const { socketCache, getSocketsWithoutServer } = require('../utils/sockets');
const logout = async (req, resp) => {
  Object.values(socketCache).forEach((socket) =>
    socket.emit('logout', req.cookies)
  );
  resp.status(200).clearCookie('auth').json({ status: 'ok' });
};
const activeLists = [];
const redirectEventsToAll = (eventName, additionalStep) => {
  const sockets = getSocketsWithoutServer();
  sockets.forEach((socket) =>
    socket.on(eventName, (payload) => {
      console.log('recibi evento posta posta', eventName);
      getSocketsWithoutServer().forEach((socket) =>
        socket.emit(eventName, payload)
      );
      if (additionalStep) {
        additionalStep(payload);
      }
    })
  );
};
const auth = async (req, resp) => {
  const { username, password } = req.body;
  const logHash = `${username}_${getStringHash()}`;
  const eventName = `get-lists-${username}`;
  getSocketsWithoutServer().forEach((socket) => {
    socket.on(eventName, (payload) => {
      socket.broadcast.emit(eventName, payload);
      const lists2Add = payload.filter(
        (list) => !activeLists.includes(list.id)
      );
      activeLists.push(...lists2Add.map((list) => list.id));
      activeLists.forEach((listId) =>
        socket.on(`get-lists-${listId}`, (payloadSingleList) => {
          socket.broadcast.emit(`get-lists-${listId}`, payloadSingleList);
        })
      );
    });
  });
  Object.values(socketCache).forEach((socket) =>
    socket.emit('update-user-auth', { username, password, id: logHash })
  );
  resp.status(200).cookie('auth', logHash).json({ status: 'ok' });
};

module.exports = { auth, logout };
