import io from 'socket.io-client';
const socketCache = {};
const initSocket = (url) => {
  socketCache.backendConnection = io.connect(url, {
    withCredentials: true,
  });
};
export { socketCache, initSocket };
