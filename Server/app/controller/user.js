'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  /*获取当前用户下所有社团信息*/
  async getMyCommunity(ctx) {
    const result = await ctx.service.community.getUserCommunity(ctx.session.user_id);
    ctx.body = {
      code: result ? 200 : 400,
      data: result,
      msg : result ? undefined : '获取失败'
    };
  }

  /*提交社团创建申请*/
  async createCommunity(ctx) {
    const payload = ctx.request.body;
    const result = await ctx.service.community.createCommunity(ctx.session.user_id, payload.name, payload.description);
    ctx.body = {
      code: result ? 200 : 400,
      msg : result ? undefined : '申请失败'
    };
  }

  /*提交社团信息修改申请*/
  async modifyCommunityInfo(ctx) {
    const payload = ctx.request.body;
    const result = await ctx.service.communityModifyInfoApplication.createCommunityModifyInfoApplication(ctx.session.user_id, payload.community_id, payload.name, payload.description);
    ctx.body = {
      code: result ? 200 : 400,
      msg : result ? undefined : '申请失败'
    };
  }

  /*获取我的所有信息修改申请*/
  async getMyModifyCommunityInfoApplication(ctx) {
    const result = await ctx.service.communityModifyInfoApplication.getUserCommunityModifyInfoApplication(ctx.session.user_id);
    ctx.body = {
      code: 200,
      data: result,
    };
  }

  /*获取我的场地申请*/
  async getMyCommunityActivityField(ctx) {
    const result = await ctx.service.communityModifyInfoApplication.getCommunityActivityField(ctx.session.community_id);
    ctx.body = {
      code: 200,
      data: result,
    };
  }

  /*场地申请*/
  async applyActivityField(ctx) {
    const payload = ctx.request.body;
    const result = await ctx.service.activityField.applyActivityField(payload.field_id, payload.community_id);
    ctx.body = {
      code: result ? 200 : 400,
      msg : result ? undefined : '申请失败'
    };
  }
}

module.exports = UserController;
