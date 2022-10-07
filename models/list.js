class List {
    constructor(nameList) {
        this.name = nameList
        this.items = [];
    }
    add(item) {
        this.items.push(item);
    }
    remove(item) {
        this.items.remove(item)
    }
}