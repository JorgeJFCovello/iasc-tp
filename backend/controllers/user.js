//set users in redis

const User = require('../models/user');

const users = [new User(1, 'pepe', 'pepe', 'pepe', 'pepe')];

const findByUserAndPass = (username, password) => {
  return users.find(
    (user) => user.username === username && user.password === password
  );
};

const auth = (req, resp) => {
  const { username, password } = req.body;
  console.log(username, password);
  const user = findByUserAndPass(username, password);
  if (user) {
    resp.status(200).json({ message: 'Auth', status: 'ok' });
  } else {
    resp.status(401).json({ message: 'Invalid Credentials' });
  }
};

module.exports = { auth };
