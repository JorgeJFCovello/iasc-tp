class User {
  constructor(id, name, email, password, username) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.email = email;
    this.password = password;
    this.lists = [];
  }

  addList(list) {
    this.lists.push(list);
  }
}

module.exports = User;
