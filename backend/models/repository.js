class Repository {
  constructor(users){
    this.users = users
  }
  saveUser(user){
    const lastUserID = this.getLastID()
    user.id = lastUserID + 1
    this.users.push(user)
  }
  findByUserAndPass(username, password){
    const user = this.users.find((user) => user.username === username && user.password === password)
    return user
  }
  getLastID(){
    return this.users.length() > 0 ? this.users[this.users.length() - 1].id : 0
  }
  getUsers(){
    return this.users
  }
}

module.exports = Repository