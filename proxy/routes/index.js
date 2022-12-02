const router = require('express').Router();
const { auth, logout } = require('../controllers/user');
const socketCache = require('../utils/sockets');
const redirectToBackend = (eventName, payload) => Object.values(socketCache)
                          .forEach(socket => socket.emit(eventName, payload))
/* router.get('/list', get);
router.get('/user', listUsers);
router.get('/list/:listId', getSpecific); */
router.post('/login', auth);
router.post('/logout', logout);
router.post('/list', (req, res) => {
  try{
  redirectToBackend('create-list' , {body: req.body, cookies: req.cookies, params: req.params, query: req.query})
  res.status(200).json({msg: 'ok'})
} catch {
  res.status(500).json({msg: 'internal error'})
}
});
router.post('/list/:listId/task', (req, res) => { 
  try{
  redirectToBackend('create-task' , {body: req.body, cookies: req.cookies, params: req.params, query: req.query})
  res.status(200).json({msg: 'ok'})
} catch {
  res.status(500).json({msg: 'internal error'})
}
});
router.post('/list/:listId/task/:taskName', (req, res) => { 
  try{
  redirectToBackend('mark-task' , {body: req.body, cookies: req.cookies, params: req.params, query: req.query})
  res.status(200).json({msg: 'ok'})
} catch {
  res.status(500).json({msg: 'internal error'})
}
});
router.post('/list/:listId/share', (req, res) => { 
  try{
  redirectToBackend('share-list' , {body: req.body, cookies: req.cookies, params: req.params, query: req.query})
  res.status(200).json({msg: 'ok'})
} catch {
  res.status(500).json({msg: 'internal error'})
}
});
router.patch('/list/:listId/task/:taskName', (req, res) => { 
  try{
  redirectToBackend('update-task' , {body: req.body, cookies: req.cookies, params: req.params, query: req.query})
  res.status(200).json({msg: 'ok'})
} catch {
  res.status(500).json({msg: 'internal error'})
}
});
router.delete('/list/:listId/task/:taskName', (req, res) => { 
  try{
  redirectToBackend('delete-task' , {body: req.body, cookies: req.cookies, params: req.params, query: req.query})
  res.status(200).json({msg: 'ok'})
} catch {
  res.status(500).json({msg: 'internal error'})
}
});
router.delete('/list/:listId', (req, res) => { 
  try{
  redirectToBackend('delete-list' , {body: req.body, cookies: req.cookies, params: req.params, query: req.query})
  res.status(200).json({msg: 'ok'})
} catch {
  res.status(500).json({msg: 'internal error'})
}
});

module.exports = router;
