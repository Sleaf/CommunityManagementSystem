'use strict';
const Controller = require('egg').Controller;

class AdminController extends Controller {
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
}

module.exports = AdminController;
