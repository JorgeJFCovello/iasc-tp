const { initDatabase, setData, getData } = require('./utils/database');
initDatabase();
const io = require('socket.io-client');
const socket = io.connect(process.env.PROXY_URL, {
  withCredentials: true,
});
const {
  create,
  update,
  get,
  getSpecific,
  generateTask,
  markTask,
  deleteTask,
  deleteList,
  shareList,
} = require('./controllers/list');
const { listUsers, updateUser, logout, auth } = require('./controllers/user');
const socketCache = require('./utils/sockets');
socketCache.proxySocket = socket;
let dbNeeded = true;
socket.emit('sync-db-needed');
setTimeout(() => {
  dbNeeded = false;
}, 4000);
socket.on('sync-db-data-requested', (db) => {
  setData(JSON.parse(db));
  dbNeeded = false;
});
socket.on('sync-db', () => {
  if (dbNeeded) return;
  socket.emit('sync-db-data', JSON.stringify(getData()));
});
socket.on('/list', async (payload) => {
  if (!dbNeeded) await get(payload);
});
socket.on('get-especific-list', async (payload) => {
  if (!dbNeeded) await getSpecific(payload);
});
socket.on('create-list', async (payload) => {
  if (!dbNeeded) await create(payload);
});
socket.on('create-task', async (payload) => {
  if (!dbNeeded) await generateTask(payload);
});
socket.on('mark-task', async (payload) => {
  if (!dbNeeded) await markTask(payload);
});
socket.on('update-task', async (payload) => {
  if (!dbNeeded) await update(payload);
});
socket.on('delete-task', async (payload) => {
  if (!dbNeeded) await deleteTask(payload);
});
socket.on('delete-list', async (payload) => {
  if (!dbNeeded) await deleteList(payload);
});
socket.on('get-users', async (payload) => {
  if (!dbNeeded) await listUsers(payload);
});
socket.on('update-users', async (payload) => {
  if (!dbNeeded) await updateUser(payload);
});
socket.on('logout-user', async (payload) => {
  if (!dbNeeded) await logout(payload);
});
socket.on('update-user-auth', async (payload) => {
  if (!dbNeeded) await auth(payload);
});
socket.on('share-list', async (payload) => {
  if (!dbNeeded) await shareList(payload);
});
console.log('backend running');
