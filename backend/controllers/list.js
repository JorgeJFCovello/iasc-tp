const { saveUser } = require('../database/user');
const List = require('../models/list');
const User = require('../models/user');
const { client: redis } = require('../utils/redis');
const socketCache = require('../utils/sockets');
const { getStringHash } = require('../utils/string');
//TODO fix list in redis
//TODO fix refresh list and users on redis

const saveList = async (userhash, list) => {
  const user = JSON.parse(await redis.get(userhash));
  list.id = getStringHash();
  user.lists.push(list.id);
  await redis.set(list.id, list);
  await saveUser(user);
};
const findListByName = async (userhash, listName) => {
  const user = JSON.parse(await redis.get(userhash));
  return user.lists.find((list) => list.name === listName);
};

const shareList = async (req, resp) => {
  try {
    const { auth } = req.cookies;
    const { name, listName } = req.body;
    const user = await redis
      .get('users')
      .find((user) => user.username === name);
    const list = await findListByName(auth, listName);
    user.addList(list.id);
    await saveUser(user);
    resp.status(200).json(list);
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
const refreshList = (list) =>
  Object.values(socketCache).forEach((socket) => {
    socket.emit(`get-lists-${list.name}`, list);
  });
const resendLists = async () => {
  const lists = JSON.parse(await redis.get('lists'))(await redis.get('users'))
    .filter((user) => user.lists.includes(list.id))
    .forEach((user) => {
      Object.values(socketCache).forEach((socket) => {
        const userLists = lists.filter((list) => user.lists.includes(list.id));
        socket.emit(`get-lists-${user.username}`, userLists);
      });
    });
};
const create = async (req, resp) => {
  try {
    const { name } = req.body;
    const list = new List(name);
    await saveList(list);
    resendLists();
    resp.status(200).json(list);
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
const update = (req, resp) => {
  try {
    const { listName, taskName } = req.params;
    const { name, order } = req.body;
    const list = findListByName(listName);
    const item = list.items.find((item) => item.name === taskName);
    if (name) {
      item.name = name;
    }
    if (order) {
      list.insertInIndex(item.name, order - 1);
    }
    resendLists();
    refreshList(list);
    resp.status(200).json(list);
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
const get = (req, resp) => {
  try {
    const { limit, offset } = req.query;
    const list2show = lists.slice(offset, limit);
    resp.status(200).json(list2show);
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
const getSpecific = (req, resp) => {
  try {
    const { listName } = req.params;
    const list = findListByName(listName);
    resp.status(200).json(list);
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
const generateTask = (req, resp) => {
  try {
    const { listName } = req.params;
    const { name } = req.body;
    const list = findListByName(listName);
    list.add({ name, done: false, index: list.items.length + 1 });
    resendLists();
    refreshList(list);
    resp.status(200).json(list);
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
const markTask = (req, resp) => {
  try {
    const { listName, taskName } = req.params;
    const list = findListByName(listName);
    const item = list.items.find((item) => item.name === taskName);
    item.done = !item.done;
    refreshList(list);
    resp.status(200).json(item);
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
const deleteTask = (req, resp) => {
  try {
    const { listName, taskName } = req.params;
    const list = findListByName(listName);
    list.remove(taskName);
    refreshList(list);
    resendLists();
    resp.status(200).json(list);
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
const deleteList = (req, resp) => {
  try {
    const { listName } = req.params;
    const list = findListByName(listName);
    lists.splice(lists.indexOf(list), 1);
    resendLists();
    resp.status(200).json(list);
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
module.exports = {
  create,
  update,
  get,
  getSpecific,
  generateTask,
  markTask,
  deleteTask,
  deleteList,
};
