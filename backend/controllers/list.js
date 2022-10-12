const { saveUser } = require('../database/user');
const List = require('../models/list');
const User = require('../models/user');
const { client: redis } = require('../utils/redis');
const socketCache = require('../utils/sockets');
const { getStringHash } = require('../utils/string');

const getUserLists = async (userhash) => {
  const user = JSON.parse(await redis.get(userhash));
  const lists = JSON.parse(await redis.get('lists'));
  return lists.filter((list) => user.lists.includes(list.id));
};
const saveList = async (userhash, list) => {
  const user = JSON.parse(await redis.get(userhash));
  const allLists = JSON.parse(await redis.get('lists'));
  if (!list.id) {
    list.id = getStringHash();
    await redis.set('lists', JSON.stringify([...allLists, list]));
    user.lists.push(list.id);
  } else {
    const index = allLists.findIndex((l) => l.id === list.id);
    allLists[index] = list;
    await redis.set('lists', JSON.stringify(allLists));
  }
  await redis.set(list.id, JSON.stringify(list));
  await saveUser(user);
};
const findListById = async (userhash, listId) => {
  const user = JSON.parse(await redis.get(userhash));
  return JSON.parse(await redis.get('lists')).find(
    (list) => user.lists.includes(list.id) && list.id === listId
  );
};

const shareList = async (req, resp) => {
  try {
    const { auth } = req.cookies;
    const { name, listId } = req.body;
    const user = await redis
      .get('users')
      .find((user) => user.username === name);
    const list = await findListById(auth, listId);
    user.lists = [...user.lists, list.id];
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
  const lists = JSON.parse(await redis.get('lists'));
  JSON.parse(await redis.get('users')).forEach((user) => {
    Object.values(socketCache).forEach((socket) => {
      const userLists = lists.filter((list) => user.lists.includes(list.id));
      socket.emit(`get-lists-${user.username}`, userLists);
    });
  });
};
const create = async (req, resp) => {
  try {
    const { name } = req.body;
    const { auth } = req.cookies;
    const list = new List(name);
    await saveList(auth, list);
    await resendLists();
    resp.status(200).json(list);
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
const update = async (req, resp) => {
  try {
    const { listId, taskName } = req.params;
    const { name, order } = req.body;
    const { auth } = req.cookies;
    const list = await findListById(auth, listId);
    const item = list.items.find((item) => item.name === taskName);
    if (name) {
      item.name = name;
    }
    if (order) {
      list.insertInIndex(item.name, order - 1);
    }
    await resendLists();
    refreshList(list);
    resp.status(200).json(list);
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
const get = async (req, resp) => {
  try {
    const { limit, offset } = req.query;
    const { auth } = req.cookies;
    const lists = await getUserLists(auth);
    const list2show = lists.slice(offset, limit);
    resp.status(200).json(list2show);
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
const getSpecific = async (req, resp) => {
  try {
    const { listId } = req.params;
    const { auth } = req.cookies;
    const list = await findListById(auth, listId);
    resp.status(200).json(list);
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
const generateTask = async (req, resp) => {
  try {
    const { listId } = req.params;
    const { name } = req.body;
    const { auth } = req.cookies;
    console.log(listId, name, auth);
    const list = await findListById(auth, listId);
    list.items = [
      ...list.items,
      { name, done: false, index: list.items.length + 1 },
    ];
    saveList(auth, list);
    resendLists();
    refreshList(list);
    resp.status(200).json(list);
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
const markTask = async (req, resp) => {
  try {
    const { listName, taskName } = req.params;
    const { auth } = req.cookies;
    const list = await findListById(auth, listName);
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
    const { listId, taskName } = req.params;
    const { auth } = req.cookies;
    const list = findListById(auth, listId);
    list.remove(taskName);
    refreshList(list);
    resendLists();
    resp.status(200).json(list);
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
const deleteList = async (req, resp) => {
  try {
    const { listId } = req.params;
    const { auth } = req.cookies;
    const lists = await getUserLists(auth);
    const list = findListById(auth, listId);
    lists.splice(lists.indexOf(list), 1);
    await resendLists();
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
