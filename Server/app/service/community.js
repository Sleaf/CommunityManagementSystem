'use strict';
const Service = require('egg').Service;

class CommunityService extends Service {
  /*创建社团申请*/
  async createCommunity(owner_id, name, description) {
    const result = await this.app.mysql.insert('Community', {owner_id, name, description});
    return result.affectedRows === 1;
  }

  /*通过社团申请*/
  async passCommunityApplication(id) {
    const result = await this.app.mysql.update('Community', {id, status: 'PASSED'});
    return result.affectedRows === 1;
  }

  /*拒绝社团申请*/
  async rejectCommunityApplication(id) {
    const result = await this.app.mysql.update('Community', {id, status: 'REJECTED'});
    return result.affectedRows === 1;
  }

  /*获取所有社团*/
  async getAllCommunity() {
    return await this.app.mysql.select('Community');
  }

  /*获取指定社团信息*/
  async getGivenCommunity(id) {
    return await this.app.mysql.get('Community', {id});
  }

  /*获取指定用户下所有社团信息*/
  async getUserCommunity(id) {
    return await this.app.mysql.select('Community', {
      where: {owner_id: id}
    });
  }

  /*冻结社团*/
  async freezeCommunity(id) {
    const result = await this.app.mysql.update('Community', {id, status: 'DISABLE'});
    return result.affectedRows === 1;
  }

  /*解冻社团*/
  async thawCommunity(id) {
    const result = await this.app.mysql.update('Community', {id, status: 'USABLE'});
    return result.affectedRows === 1;
  }

  /*社团评级*/
  async rankCommunity(id, rank) {
    const result = await this.app.mysql.update('Community', {id, rank});
    return result.affectedRows === 1;
  }
}

module.exports = CommunityService;
