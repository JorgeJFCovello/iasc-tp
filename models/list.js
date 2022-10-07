class List {
    constructor(nameList) {
        this.name = nameList
        this.items = [];
    }
    add(item) {
        this.items.push(item);
    }
    remove(taskName) {
        const newList = this.items.filter(item => item.name !== taskName);
        this.items = newList;
    }
    insertInIndex(taskName, index) {
        const newList = this.items.filter(item => item.name !== taskName);
        const item = this.items.find(item => item.name === taskName);
        newList.splice(index, 0, item);
        this.items = newList;
    }
}

module.exports = List;