class Repository {
  constructor(){
    this.users = []
  }
  saveUser(user){
    const lastUserID = this.getLastID()
    user.id = lastUserID + 1
    this.users.push(user)
  }
  findByUserAndPass(username, password){
    const user = this.users.find((usrname, pass) => usrname === username && pass === password);
    return user
  }
  getLastID(){
    if (this.users.length() > 0) {
      const lastUser = this.users.pop()
      return lastUser.id
    }
    return 0
  }
}

module.exports = Repository