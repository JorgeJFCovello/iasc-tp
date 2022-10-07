const router = require('express').Router();
const { create, update, get, getSpecific, generateTask, markTask, deleteTask } = require('../controllers/list');

router.get('/list', get)
router.get('/list/:listName', getSpecific)
router.post('/list', create)
router.post('/list/:listName/task', generateTask)
router.post('/list/:listName/task/:taskName', markTask)
router.patch('/list/:listName/task/:taskName', update)
router.delete('/list/:listName/task/:taskName', deleteTask)

module.exports = router;