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

const saveLists = async (lists) => {
  await redis.set('lists', JSON.stringify(lists));
};
const saveList = async (userhash, list) => {
  const user = JSON.parse(await redis.get(userhash));
  let allLists = JSON.parse(await redis.get('lists'));
  if (!list.id) {
    allLists = [...allLists, list];
    list.id = getStringHash();
    user.lists.push(list.id);
  } else {
    const index = allLists.findIndex((l) => l.id === list.id);
    allLists[index] = list;
  }
  await saveLists(allLists);
  await redis.set(list.id, JSON.stringify(list));
  await saveUser(user);
  return { user, lists: allLists };
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
    const { listId } = req.params;
    const { name } = req.body;
    const user = JSON.parse(await redis.get('users')).find(
      (user) => user.username === name
    );
    const list = await findListById(auth, listId);
    user.lists = [...user.lists, list.id];
    await saveUser(user);
    resendLists();
    resp.status(200).json(list);
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
const refreshList = (list) =>
  Object.values(socketCache).forEach((socket) => {
    socket.emit(`get-lists-${list.id}`, list);
  });
const resendLists = async () => {
  const lists = JSON.parse(await redis.get('lists'));
  JSON.parse(await redis.get('users')).forEach((user) => {
    const userLists = lists.filter((list) => user.lists.includes(list.id));
    resendListsForUser(user.username, userLists);
  });
};
const resendListsForUser = (username, lists) => {
  Object.values(socketCache).forEach((socket) =>
    socket.emit(`get-lists-${username}`, lists)
  );
};
const create = async (req, resp) => {
  try {
    const { name } = req.body;
    const { auth } = req.cookies;
    const list = new List(name);
    const { user, lists } = await saveList(auth, list);
    resendListsForUser(user.username, lists);
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
    const list = await findListById(auth, listId);
    console.log('list', list);
    if (list) {
      list.items = [
        ...list.items,
        { name, done: false, index: list.items.length + 1 },
      ];
      await saveList(auth, list);
      await resendLists();
      refreshList(list);
      console.log('guarde todo');
      resp.status(200).json(list);
    } else {
      resp.status(404).json({ msg: 'List not found' });
    }
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
};
const markTask = async (req, resp) => {
  try {
    const { listId, taskName } = req.params;
    const { auth } = req.cookies;
    const list = await findListById(auth, listId);
    const item = list.items.find((item) => item.name === taskName);
    item.done = !item.done;
    await saveList(auth, list);
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
    const list = await findListById(auth, listId);
    lists.splice(lists.indexOf(list), 1);
    await saveLists(lists);
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
  shareList,
};
