const { saveUser, findUserByHash } = require('../database/user');
const List = require('../models/list');
const User = require('../models/user');
const { client: db } = require('../utils/database');
const socketCache = require('../utils/sockets');
const { getStringHash } = require('../utils/string');
const getUserLists = async (userhash) => {
  const user = JSON.parse((await db.get(userhash)) || '{}');
  const lists = JSON.parse((await db.get('lists')) || '[]');
  return lists.filter((list) => user.lists?.includes(list.id));
};

const saveLists = async (lists) => {
  await db.set('lists', JSON.stringify(lists));
};
const saveList = async (userhash, list) => {
  const user = JSON.parse(await db.get(userhash));
  if (!user) {
    console.log('user not found', userhash);
    return;
  }
  let allLists = JSON.parse(await db.get('lists')) || [];
  const index = allLists.findIndex((l) => l.id === list.id);
  if (index === -1) {
    allLists = [...allLists, list];
    user.lists.push(list.id);
  } else {
    allLists[index] = list;
  }
  await saveLists(allLists);
  await db.set(list.id, JSON.stringify(list));
  await saveUser(user);
  return { user, lists: allLists };
};
const findListById = async (userhash, listId) => {
  const user = JSON.parse(await db.get(userhash));
  if (!user) return null;
  return List.fromObject(
    JSON.parse(await db.get('lists')).find(
      (list) => user.lists.includes(list.id) && list.id === listId
    )
  );
};

const shareList = async (payload) => {
  try {
    const { auth } = payload.cookies;
    const { listId } = payload.params;
    const { name } = payload.body;
    const user = JSON.parse(await db.get('users')).find(
      (user) => user.username === name
    );
    const list = await findListById(auth, listId);
    if (user && !user.lists.includes(listId) && list) {
      user.lists = [...user.lists, list.id];
      await saveUser(user);
      await resendLists();
    }
  } catch (err) {
    console.error(err.message);
  }
};
const refreshList = (list) =>
  socketCache.proxySocket.emit(`get-lists-${list.id}`, list);
const resendLists = async () => {
  const lists = JSON.parse(await db.get('lists'));
  JSON.parse(await db.get('users')).forEach((user) => {
    const userLists = lists.filter((list) => user.lists.includes(list.id));
    resendListsForUser(user.username, userLists);
  });
};
const resendListsForUser = (username, lists) => {
  socketCache.proxySocket.emit(`get-lists-${username}`, lists);
};

const create = async (payload) => {
  try {
    const { name, id } = payload.body;
    const { auth } = payload.cookies;
    const list = new List(name);
    list.id = id;
    const { user, lists } = await saveList(auth, list);
    resendListsForUser(user.username, lists);
  } catch (err) {
    console.error(err);
  }
};
const update = async (payload) => {
  try {
    const {
      params: { listId, taskName },
      body: { name, order },
      cookies: { auth },
    } = payload;
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
    console.error(err.message);
  }
};
const get = async (payload) => {
  try {
    const {
      query: { limit, offset },
      cookies: { auth },
    } = payload;
    const lists = await getUserLists(auth);
    const list2show = lists.slice(offset, limit);
    const user = await findUserByHash(auth);
    resendListsForUser(user.username, list2show);
  } catch (err) {
    console.error(err.message);
  }
};
const getSpecific = async (payload) => {
  try {
    const {
      params: { listId },
      cookies: { auth },
    } = payload;
    const list = await findListById(auth, listId);
    refreshList(list);
  } catch (err) {
    console.error(err.message);
  }
};
const generateTask = async (payload) => {
  try {
    const { listId } = payload.params;
    const { name } = payload.body;
    const { auth } = payload.cookies;
    console.log('payload', payload);
    const list = await findListById(auth, listId);
    console.log('list', list);
    if (list) {
      list.items = [
        ...list.items,
        { name, done: false, index: list.items.length + 1 },
      ];
      console.log('items', list.items);
      await saveList(auth, list);
      await resendLists();
      refreshList(list);
    }
  } catch (err) {
    console.error(err.message);
  }
};
const markTask = async (payload) => {
  try {
    const { listId, taskName } = payload.params;
    const { auth } = payload.cookies;
    const list = await findListById(auth, listId);
    const item = list.items.find((item) => item.name === taskName);
    item.done = !item.done;
    await saveList(auth, list);
    refreshList(list);
  } catch (err) {
    console.error(err.message);
  }
};
const deleteTask = async (payload) => {
  try {
    const { listId, taskName } = payload.params;
    const { auth } = payload.cookies;
    const list = await findListById(auth, listId);
    list.remove(taskName);
    refreshList(list);
    resendLists();
    saveList(auth, list);
  } catch (err) {
    console.error(err.message);
  }
};
const deleteList = async (payload) => {
  try {
    const { listId } = payload.params;
    const { auth } = payload.cookies;
    const lists = await getUserLists(auth);
    const list = await findListById(auth, listId);
    lists.splice(lists.indexOf(list), 1);
    await saveLists(lists);
    await resendLists();
  } catch (err) {
    console.error(err.message);
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
