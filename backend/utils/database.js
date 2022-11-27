require('dotenv').config();
const User = require('../models/user');
const data = {};
const initDatabase = () =>
  (data.users = JSON.stringify([
    // id, name, email, password, username)
    new User(null, 'pepe', 'pepe@gmail.com', 'pepe', 'pepe'),
    new User(null, 'pepa', 'pepa@gmail.com', 'pepa', 'pepa'),
    new User(null, 'pepo', 'pepo@gmail.com', 'pepo', 'pepo'),
    new User(null, 'pepepito', 'pepepito@gmail.com', 'pepepito', 'pepepito'),
  ]));
//use async/await to replicate redis behaviour
const get = async (key) => data[key] || null;
const set = async (key, value) => (data[key] = value);
module.exports = { initDatabase, client: { get, set } };
