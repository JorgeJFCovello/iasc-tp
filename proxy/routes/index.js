const router = require('express').Router();
const { auth, logout } = require('../controllers/user');

router.post('/login', auth);
router.post('/logout', logout);

module.exports = router;
