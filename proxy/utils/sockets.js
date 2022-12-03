const socketCache = {};
const getSocketsWithoutServer = () => {
  return Object.values(socketCache).filter((val) => !!val);
};

const redirectToBackend = (eventName, payload) =>
  getSocketsWithoutServer().forEach((socket) =>
    socket.emit(eventName, payload)
  );
module.exports = { socketCache, getSocketsWithoutServer, redirectToBackend };
