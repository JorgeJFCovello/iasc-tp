const router = require('express').Router();
const { createList } = require('../controllers/list');
const { auth, logout } = require('../controllers/user');
const { redirectToBackend } = require('../utils/sockets');

const redirect = (event, req, res) => {
  try {
    redirectToBackend(event, {
      body: req.body,
      cookies: req.cookies,
      params: req.params,
      query: req.query,
    });
    res.status(200).json({ msg: 'ok' });
  } catch (err) {
    res.status(500).json({ msg: 'internal error' });
  }
};
router.get('/list', (req, res) => redirect('/list', req, res));
router.get('/user', (req, res) => redirect('get-users', req, res));
router.get('/list/:listId', (req, res) =>
  redirect('get-especific-list', req, res)
);
router.post('/login', auth);
router.post('/logout', logout);
router.post('/list', createList);
router.post('/list/:listId/task', (req, res) =>
  redirect('create-task', req, res)
);
router.post('/list/:listId/task/:taskName', (req, res) =>
  redirect('mark-task', req, res)
);
router.post('/list/:listId/share', (req, res) =>
  redirect('share-list', req, res)
);
router.patch('/list/:listId/task/:taskName', (req, res) =>
  redirect('update-task', req, res)
);
router.delete('/list/:listId/task/:taskName', (req, res) =>
  redirect('delete-task', req, res)
);
router.delete('/list/:listId', (req, res) => redirect('delete-list', req, res));

module.exports = router;
