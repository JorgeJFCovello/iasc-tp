const { initDatabase } = require('./utils/database');
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
socketCache.proxySockect = socket;
socket.on('/list', async (payload) => await get(payload));
socket.on('get-especific-list', async (payload) => await getSpecific(payload));
socket.on('create-list', async (payload) => await create(payload));
socket.on('create-task', async (payload) => await generateTask(payload));
socket.on('mark-task', async (payload) => await markTask(payload));
socket.on('update-task', async (payload) => await update(payload));
socket.on('delete-task', async (payload) => await deleteTask(payload));
socket.on('delete-list', async (payload) => await deleteList(payload));
socket.on('get-users', async (payload) => await listUsers(payload));
socket.on('update-users', async (payload) => await updateUser(payload));
socket.on('logout-user', async (payload) => await logout(payload));
socket.on('update-user-auth', async (payload) => await auth(payload));
socket.on('share-list', async (payload) => await shareList(payload));
console.log('running backend');
