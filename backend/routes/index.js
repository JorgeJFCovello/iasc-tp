const router = require('express').Router();
const {
  create,
  update,
  get,
  getSpecific,
  generateTask,
  markTask,
  deleteTask,
  deleteList,
} = require('../controllers/list');
const { auth, logout } = require('../controllers/user');

router.get('/list', get);
router.get('/list/:listId', getSpecific);
router.post('/list', create);
router.post('/list/:listId/task', generateTask);
router.post('/login', auth);
router.post('/logout', logout);
router.post('/list/:listId/task/:taskName', markTask);
router.patch('/list/:listId/task/:taskName', update);
router.delete('/list/:listId/task/:taskName', deleteTask);
router.delete('/list/:listId', deleteList);

module.exports = router;
