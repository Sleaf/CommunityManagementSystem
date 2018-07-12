'use strict';
const Service = require('egg').Service;

class ActivityFieldService extends Service {
   /*开放活动场地*/
  async createActivityField(name, date) {
    const result = await this.app.mysql.insert('ActivityField', {name, date});
    return result.affectedRows === 1;
  }

  /*获取所有活动场地*/
  async getAllActivityField() {
    return await this.app.mysql.select('ActivityField');
  }

  /*活动场地申请*/
  async applyActivityField(field_id, community_id) {
    const result = await this.app.mysql.insert('ActivityFieldApplication', {field_id, community_id});
    return result.affectedRows === 1;
  }

  /*通过活动场地申请*/
  async passActivityFieldApplication(id) {
    const result = await this.app.mysql.update('ActivityFieldApplication', {id, status: 'PASSED'});
    return result.affectedRows === 1;
  }

  /*拒绝活动场地申请*/
  async rejectActivityFieldApplication(id) {
    const result = await this.app.mysql.update('ActivityFieldApplication', {id, status: 'REJECTED'});
    return result.affectedRows === 1;
  }

  /*获取特定社团的所有场地申请*/
  async getCommunityActivityField(id) {
    const sqlStr = `
      SELECT  AF.id,  AF.name,  AF.date,  AFA.status
      FROM ActivityFieldApplication AS AFA, ActivityField AS AF
      WHERE AFA.community_id = ? AND AFA.field_id = AF.id`;
    const sqlParams = [id];
    return await this.app.mysql.query(sqlStr, sqlParams);
  }
}

module.exports = ActivityFieldService;