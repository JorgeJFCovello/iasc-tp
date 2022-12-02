const router = require('express').Router();
const { auth, logout } = require('../controllers/user');
const socketCache = require('../utils/sockets');
const redirectToBackend = (eventName, payload) => Object.values(socketCache)
                          .forEach(socket => socket.emit(eventName, payload.body))
/* router.get('/list', get);
router.get('/user', listUsers);
router.get('/list/:listId', getSpecific); */
router.post('/login', auth);
router.post('/logout', logout);
router.post('/list', (req, res) => {
  try{
  redirectToBackend('create-list' , req)
  res.status(200).json({msg: 'ok'})
} catch {
  res.status(500).json({msg: 'internal error'})
}
});
router.post('/list/:listId/task', (req, res) => { 
redirectToBackend('create-task' , req)

try{
  res.status(200).json({msg: 'ok'})
} catch {
  res.status(500).json({msg: 'internal error'})
}
});
router.post('/list/:listId/task/:taskName', (req, res) => { 
  try{
  redirectToBackend('mark-task' , req)
  res.status(200).json({msg: 'ok'})
} catch {
  res.status(500).json({msg: 'internal error'})
}
});
router.post('/list/:listId/share', (req, res) => { 
  try{
  redirectToBackend('share-list' , req)
  res.status(200).json({msg: 'ok'})
} catch {
  res.status(500).json({msg: 'internal error'})
}
});
router.patch('/list/:listId/task/:taskName', (req, res) => { 
  try{
  redirectToBackend('update-task' , req)
  res.status(200).json({msg: 'ok'})
} catch {
  res.status(500).json({msg: 'internal error'})
}
});
router.delete('/list/:listId/task/:taskName', (req, res) => { 
  try{
  redirectToBackend('delete-task' , req)
  res.status(200).json({msg: 'ok'})
} catch {
  res.status(500).json({msg: 'internal error'})
}
});
router.delete('/list/:listId', (req, res) => { 
  try{
  redirectToBackend('delete-list' , req)
  res.status(200).json({msg: 'ok'})
} catch {
  res.status(500).json({msg: 'internal error'})
}
});

module.exports = router;
