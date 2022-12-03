const socketCache = {};
const getSocketsWithoutServer = () => {
  return Object.values(socketCache);
};
module.exports = { socketCache, getSocketsWithoutServer };
