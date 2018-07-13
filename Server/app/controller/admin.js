'use strict';
const Controller = require('egg').Controller;

class AdminController extends Controller {

  /*获取所有社团信息*/
  async getAllCommunity(ctx) {
    const result = await ctx.service.community.getAllCommunity();
    ctx.body = {
      code: 200,
      data: result
    };
  }

  /*通过社团创建申请*/
  async passCommunityApplication(ctx) {
    const payload = ctx.request.body;
    const result = await ctx.service.community.passCommunityApplication(payload.community_id);
    ctx.body = {
      code: result ? 200 : 400,
      msg : result ? undefined : '通过失败'
    };
  }

  /*拒绝社团创建申请*/
  async rejectCommunityApplication(ctx) {
    const payload = ctx.request.body;
    const result = await ctx.service.community.rejectCommunityApplication(payload.community_id);
    ctx.body = {
      code: result ? 200 : 400,
      msg : result ? undefined : '拒绝失败'
    };
  }

  /*查看所有社团信息修改申请*/
  async getAllCommunityModifyInfoApplication(ctx) {
    const result = await ctx.service.communityModifyInfoApplication.getAllCommunityModifyInfoApplication();
    ctx.body = {
      code: 200,
      data: result
    };
  }

  /*通过社团信息修改申请*/
  async passCommunityModifyInfoApplication(ctx) {
    const payload = ctx.request.body;
    const result = await ctx.service.communityModifyInfoApplication.passCommunityModifyInfoApplication(payload.community_id);
    ctx.body = {
      code: result ? 200 : 400,
      msg : result ? undefined : '通过失败'
    };
  }

  /*拒绝社团信息修改申请*/
  async rejectCommunityModifyInfoApplication(ctx) {
    const payload = ctx.request.body;
    const result = await ctx.service.communityModifyInfoApplication.rejectCommunityModifyInfoApplication(payload.community_id);
    ctx.body = {
      code: result ? 200 : 400,
      msg : result ? undefined : '拒绝失败'
    };
  }

  /*冻结社团*/
  async freezeCommunity(ctx) {
    const payload = ctx.request.body;
    const result = await ctx.service.community.freezeCommunity(payload.community_id);
    ctx.body = {
      code: result ? 200 : 400,
      msg : result ? undefined : '冻结失败'
    };
  }

  /*解冻社团*/
  async thawCommunity(ctx) {
    const payload = ctx.request.body;
    const result = await ctx.service.community.thawCommunity(payload.community_id);
    ctx.body = {
      code: result ? 200 : 400,
      msg : result ? undefined : '解冻失败'
    };
  }

  /*修改社团评级*/
  async rankCommunity(ctx) {
    const payload = ctx.request.body;
    const result = await ctx.service.community.rankCommunity(payload.community_id, payload.rank);
    ctx.body = {
      code: result ? 200 : 400,
      msg : result ? undefined : '评级失败'
    };
  }

  /*创建活动场地*/
  async createActivityField(ctx){
    const payload = ctx.request.body;
    const result = await ctx.service.activityField.createActivityField(payload.name, payload.date);
    ctx.body = {
      code: result ? 200 : 400,
      msg : result ? undefined : '评级失败'
    };
  }

  /*查看所有社团信息修改申请*/
  async getAllActivityField(ctx) {
    const result = await ctx.service.activityField.getAllActivityField();
    ctx.body = {
      code: 200,
      data: result
    };
  }

  /*通过活动场地申请*/
  async passActivityFieldApplication(ctx) {
    const payload = ctx.request.body;
    const result = await ctx.service.activityField.passActivityFieldApplication(payload.activity_id);
    ctx.body = {
      code: result ? 200 : 400,
      msg : result ? undefined : '通过失败'
    };
  }

  /*拒绝活动场地申请*/
  async rejectActivityFieldApplication(ctx) {
    const payload = ctx.request.body;
    const result = await ctx.service.activityField.rejectActivityFieldApplication(payload.activity_id);
    ctx.body = {
      code: result ? 200 : 400,
      msg : result ? undefined : '拒绝失败'
    };
  }
}

module.exports = AdminController;
