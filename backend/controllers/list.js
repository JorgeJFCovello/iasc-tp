const List = require('../models/list');
const User = require('../models/user');

const lists = []
const users = []
const saveList = (list) => lists.push(list);
const findListByName = (listName) => {
    return lists.find(list => list.name === listName);
}
const findUserByName = (name) => {
    return users.find(user => user.name === name);
}

const shareList = (req, resp) => {
    try {
        const { name, listName } = req.body;
        const user = findUserByName(name);
        const list = findListByName(listName)
        user.addList(list);
        resp.status(200).json(list)
    } catch (err) {
        resp.status(500).json({ message: err.message })
    }
}
const create = (req, resp) => {
    try {
        const { name } = req.body;
        const list = new List(name);
        saveList(list);
        resp.status(200).json(list)
    } catch (err) {
        resp.status(500).json({ message: err.message })
    }
}
const update = (req, resp) => {
    try {
        const { listName, taskName } = req.params;
        const { name, order } = req.body;
        const list = findListByName(listName);
        const item = list.items.find(item => item.name === taskName);
        if (name) {
            item.name = name;
        }
        if (order) {
            list.insertInIndex(item.name, order - 1);
        }
        resp.status(200).json(list)
    } catch (err) {
        resp.status(500).json({ message: err.message })
    }
}
const get = (req, resp) => {
    try {
        const { limit, offset } = req.query;
        const list2show = lists.slice(offset, limit);
        resp.status(200).json(list2show)
    } catch (err) {
        resp.status(500).json({ message: err.message })
    }
}
const getSpecific = (req, resp) => {
    try {
        const { listName } = req.params;
        const list = findListByName(listName);
        resp.status(200).json(list)
    } catch (err) {
        resp.status(500).json({ message: err.message })
    }
}
const generateTask = (req, resp) => {
    try {
        const { listName } = req.params;
        const { name } = req.body
        const list = findListByName(listName);
        list.add({ name, done: false, index: list.items.length + 1 });
        resp.status(200).json(list)
    } catch (err) {
        resp.status(500).json({ message: err.message })
    }
}
const markTask = (req, resp) => {
    try {
        const { listName, taskName } = req.params;
        const list = findListByName(listName);
        const item = list.items.find(item => item.name === taskName);
        item.done = !item.done
        resp.status(200).json(item)
    } catch (err) {
        resp.status(500).json({ message: err.message })
    }
}
const deleteTask = (req, resp) => {
    try {
        const { listName, taskName } = req.params;
        const list = findListByName(listName);
        list.remove(taskName);
        resp.status(200).json(list)
    } catch (err) {
        resp.status(500).json({ message: err.message })
    }
}

module.exports = { create, update, get, getSpecific, generateTask, markTask, deleteTask }