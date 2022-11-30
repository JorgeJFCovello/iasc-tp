const { saveUser } = require('../database/user');
const List = require('../models/list');
const User = require('../models/user');
const { client: db } = require('../utils/database');
const socketCache = require('../utils/sockets');
const { getStringHash } = require('../utils/string');
const socket = socketCache.proxySockect;
const getUserLists = async (userhash) => {
  const user = JSON.parse(await db.get(userhash));
  const lists = JSON.parse(await db.get('lists'));
  return lists.filter((list) => user.lists.includes(list.id));
};

const saveLists = async (lists) => {
  await db.set('lists', JSON.stringify(lists));
};
const saveList = async (userhash, list) => {
  const user = JSON.parse(await db.get(userhash));
  let allLists = JSON.parse(await db.get('lists')) || [];
  if (!list.id) {
    allLists = [...allLists, list];
    list.id = getStringHash();
    user.lists.push(list.id);
  } else {
    const index = allLists.findIndex((l) => l.id === list.id);
    allLists[index] = list;
  }
  await saveLists(allLists);
  await db.set(list.id, JSON.stringify(list));
  await saveUser(user);
  return { user, lists: allLists };
};
const findListById = async (userhash, listId) => {
  const user = JSON.parse(await db.get(userhash));
  return List.fromObject(
    JSON.parse(await db.get('lists')).find(
      (list) => user.lists.includes(list.id) && list.id === listId
    )
  );
};

const shareList = async (payload) => {
  try {
    const { auth } = payload;
    const { listId } = payload;
    const { name } = payload;
    const user = JSON.parse(await db.get('users')).find(
      (user) => user.username === name
    );
    const list = await findListById(auth, listId);
    user.lists = [...user.lists, list.id];
    await saveUser(user);
    resendLists();
    resp.status(200).json(list);
  } catch (err) {
    console.err(err.message);
  }
};
const refreshList = (list) => socket.emit(`get-lists-${list.id}`, list);
const resendLists = async () => {
  const lists = JSON.parse(await db.get('lists'));
  JSON.parse(await db.get('users')).forEach((user) => {
    const userLists = lists.filter((list) => user.lists.includes(list.id));
    resendListsForUser(user.username, userLists);
  });
};
const resendListsForUser = (username, lists) =>
  socket.emit(`get-lists-${username}`, lists);

const create = async (payload) => {
  try {
    const { name } = payload.body;
    const { auth } = payload.cookies;
    const list = new List(name);
    const { user, lists } = await saveList(auth, list);
    resendListsForUser(user.username, lists);
  } catch (err) {
    console.err(err);
  }
};
const update = async (payload) => {
  try {
    const { listId, taskName, name, order, auth } = payload;
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
  } catch (err) {
    console.err(err.message);
  }
};
const get = async (payload) => {
  try {
    const { limit, offset, auth } = payload;
    const lists = await getUserLists(auth);
    const list2show = lists.slice(offset, limit);
    resp.status(200).json(list2show);
  } catch (err) {
    console.err(err.message);
  }
};
const getSpecific = async (payload) => {
  try {
    const { listId, auth } = payload;
    const list = await findListById(auth, listId);
    refreshList(list);
  } catch (err) {
    console.err(err.message);
  }
};
const generateTask = async (payload) => {
  try {
    const { listId } = payload;
    const { name } = payload;
    const { auth } = payload;
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
    console.err(err.message);
  }
};
const markTask = async (payload) => {
  try {
    const { listId, taskName } = payload;
    const { auth } = payload;
    const list = await findListById(auth, listId);
    const item = list.items.find((item) => item.name === taskName);
    item.done = !item.done;
    await saveList(auth, list);
    refreshList(list);
    resp.status(200).json(item);
  } catch (err) {
    console.err(err.message);
  }
};
const deleteTask = async (payload) => {
  try {
    const { listId, taskName } = payload;
    const { auth } = payload;
    const list = await findListById(auth, listId);
    list.remove(taskName);
    refreshList(list);
    resendLists();
    resp.status(200).json(list);
    saveList(auth, list);
  } catch (err) {
    console.err(err.message);
  }
};
const deleteList = async (payload) => {
  try {
    const { listId } = payload;
    const { auth } = payload;
    const lists = await getUserLists(auth);
    const list = await findListById(auth, listId);
    lists.splice(lists.indexOf(list), 1);
    await saveLists(lists);
    await resendLists();
    resp.status(200).json(list);
  } catch (err) {
    console.err(err.message);
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
