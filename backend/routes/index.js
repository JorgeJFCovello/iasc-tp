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
router.get('/list/:listName', getSpecific);
router.post('/list', create);
router.post('/list/:listName/task', generateTask);
router.post('/login', auth);
router.post('/logout', logout);
router.post('/list/:listName/task/:taskName', markTask);
router.patch('/list/:listName/task/:taskName', update);
router.delete('/list/:listName/task/:taskName', deleteTask);
router.delete('/list/:listName', deleteList);

module.exports = router;
