class User {
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.lists = [];
    }

    addList(list) {
        this.lists.push(list);
    }
}

module.exports = User;