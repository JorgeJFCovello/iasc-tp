const getStringHash = () => {
  const string =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_-.';
  const ts = new Date().getTime();
  let hash = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = (Math.random() * ts) % (string.length - 1);
    hash += string.charAt(randomIndex);
  }
  return hash;
};
module.exports = { getStringHash };
