'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  /*登录*/
  async login(ctx) {
    const payload = ctx.request.body;
    const result = await ctx.service.user.verify(payload.username, payload.password);
    if (result) {
      // 修改 Session 的值
      ctx.session = {
        username: payload.username,
        role    : result.role
      };
      ctx.body = {
        code: 200,
        data: {
          role: result.role
        }
      };
    } else {
      ctx.body = {
        code: 400,
        msg : '用户名不存在或密码错误'
      };
    }
  }

  /*登出*/
  async logout(ctx) {
    ctx.session = null;
    ctx.body = {
      code: 200,
      msg : '登出成功'
    };
  }

  /*注册*/
  async register(ctx) {
    const payload = ctx.request.body;
    const result = await ctx.service.user.create(payload.username, payload.password);
    ctx.body = {
      code: result ? 200 : 400,
      msg : result ? '注册成功' : '注册失败'
    };
  }
}

module.exports = UserController;
