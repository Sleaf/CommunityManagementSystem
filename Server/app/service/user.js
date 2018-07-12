'use strict';
const Service = require('egg').Service;
const bcrypt = require('bcrypt');

class UserService extends Service {
  /*新建账户*/
  async create(username, password) {
    const genHash = await bcrypt.hash(password, 10);
    let result = null;
    try {
      result = await this.app.mysql.insert('User', {username, genHash});
    } catch (e) {
      console.error(e);
      result = {};
    }
    return result.affectedRows === 1;
  }

  /*验证账户*/
  async verify(username, password) {
    let userInfo = null;
    try {
      userInfo = await this.app.mysql.get('User', {username});
    } catch (e) {
      console.error(e);
      userInfo = null;
    }
    return userInfo && await bcrypt.compare(password, userInfo.genHash) ? userInfo : null;
  }
}

module.exports = UserService;
