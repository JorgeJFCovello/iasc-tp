const { getStringHash } = require('../utils/string');
const socketCache = require('../utils/sockets');
const logout = async (req, resp) => {
  Object.values(socketCache).forEach((socket) =>
    socket.emit('logout', req.cookies)
  );
  resp.status(200).clearCookie('auth').json({ status: 'ok' });
};
const activeLists = []
const getSocketsWithoutServer = () => {
  return Object.entries(socketCache).filter(([_, key]) => key !== 'serverSocket').map(([socket, _]) => socket)
}
const redirectEventsToAll = (eventName, additionalStep) => {
  console.log("recibi evento", eventName)
  socketCache.serverSocket.on(eventName, (_, payload = []) => {
      console.log("recibi evento posta posta", eventName)
    getSocketsWithoutServer().forEach((socket) => socket.emit(eventName, payload))
    if (additionalStep) {
      additionalStep(payload)
    }
  })
}
const auth = async (req, resp) => {
  const { username, password } = req.body;
  const logHash = `${username}_${getStringHash()}`;
  redirectEventsToAll(`get-lists-${username}`,(payload) => {
    payload.filter((list) => !activeLists.includes(list.id)).forEach((list) => {
      activeLists.push(list.id)
      redirectEventsToAll(`get-lists-${list.id}`)
    })
  })
  Object.values(socketCache).forEach((socket) =>
    socket.emit('update-user-auth', { username, password, id: logHash })
  );
  resp.status(200).cookie('auth', logHash).json({ status: 'ok' });
};

module.exports = { auth, logout };
