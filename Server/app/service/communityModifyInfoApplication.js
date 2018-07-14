'use strict';
const Service = require('egg').Service;

class CommunityModifyInfoApplicationService extends Service {
  /*提交社团信息修改申请*/
  async createCommunityModifyInfoApplication(user_id, community_id, new_name, new_description) {
    const repResult = await this.app.mysql.get('CommunityModifyInfoApplication', {user_id, status: 'PADDING'});
    //fixme 检查是不是社长
    if (repResult != null) {
      const communityInfo = await this.app.mysql.get('Community', {owner_id: user_id});
      const result = await this.app.mysql.insert('CommunityModifyInfoApplication', {
        user_id,
        community_id,
        name       : communityInfo.name,
        description: communityInfo.description,
        new_name,
        new_description
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
    const application = await this.app.mysql.get('CommunityModifyInfoApplication', {community_id: id});
    await this.app.mysql.update('Community', {id, name: application.name, description: application.description});
    const result = await this.app.mysql.update('CommunityModifyInfoApplication', {status: 'PASSED'}, {
      where: {
        community_id: id
      }
    });
    return result.affectedRows === 1;
  }

  /*拒绝社团信息修改申请*/
  async rejectCommunityModifyInfoApplication(id) {
    const result = await this.app.mysql.update('CommunityModifyInfoApplication', {status: 'REJECTED'}, {
      where: {
        community_id: id
      }
    });
    return result.affectedRows === 1;
  }
}

module.exports = CommunityModifyInfoApplicationService;
