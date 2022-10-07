const auth = (req, resp) => {
  console.log('llegue');
  return resp.status(200).json({ message: 'Auth', status: 'ok' });
};

module.exports = { auth };
