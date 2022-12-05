const { redirectToBackend } = require('../utils/sockets');
const { getStringHash } = require('../utils/string');

const createList = (req, res) => {
  try {
    redirectToBackend('create-list', {
      body: { id: getStringHash(), ...req.body },
      cookies: req.cookies,
      params: req.params,
      query: req.query,
    });
    res.status(200).json({ msg: 'ok' });
  } catch (err) {
    res.status(500).json({ msg: 'internal error' });
  }
};

module.exports = { createList };
