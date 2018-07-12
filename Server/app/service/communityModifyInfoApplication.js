'use strict';
const Service = require('egg').Service;

class CommunityModifyInfoApplicationService extends Service {
  /*提交社团信息修改申请*/
  async createCommunityModifyInfoApplication(user_id, community_id, name, description) {
    const repResult = await this.app.mysql.get('CommunityModifyInfoApplication', {user_id, status: 'PADDING'});
    if (repResult != null) {
      const result = await this.app.mysql.insert('CommunityModifyInfoApplication', {
        user_id,
        community_id,
        name,
        description
      });
      return result.affectedRows === 1;
    } else return false;
  }

  /*获取所有信息修改申请列表*/
  async getAllCommunityModifyInfoApplication() {
    return await this.app.mysql.select('CommunityModifyInfoApplication');
  }

  /*获取指定用户下所有信息修改申请列表*/
  async getUserCommunityModifyInfoApplication(id) {
    return await this.app.mysql.select('CommunityModifyInfoApplication', {
      where: {user_id: id}
    });
  }

  /*通过社团信息修改申请*/
  async passCommunityModifyInfoApplication(id) {
    const result = await this.app.mysql.update('CommunityModifyInfoApplication', {id, status: 'PASSED'});
    return result.affectedRows === 1;
  }

  /*拒绝社团信息修改申请*/
  async rejectCommunityModifyInfoApplication(id) {
    const result = await this.app.mysql.update('CommunityModifyInfoApplication', {id, status: 'REJECTED'});
    return result.affectedRows === 1;
  }
}

module.exports = CommunityModifyInfoApplicationService;
