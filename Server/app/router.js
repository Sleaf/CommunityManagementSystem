'use strict';
const path = require('path');
const fs = require('fs');

module.exports = app => {
  const {router, controller} = app;

  /*默认返回前端静态网页*/
  router.get(/^(?!\/api)/, async ctx => {
    const file = path.resolve(ctx.app.config.static.dir, 'index.html');
    ctx.set('Content-Type', 'text/html; charset=utf-8');
    ctx.body = fs.readFileSync(file);
  });

  /*不需要登录验证*/
  router
    .post('/api/register', controller.entrance.register)
    .post('/api/login', controller.entrance.login)
    .post('/api/logout', controller.entrance.logout);

  /*需要登录验证*/
  router
    .all('*', async (ctx, next) => {
      //验证session
      if (ctx.session.username == null) ctx.status = 403;
      else await next();
    })
    .get('/api/community', controller.user.getMyCommunity)
    .post('/api/community', controller.user.createCommunity)
    .get('/api/community/mod', controller.user.getMyModifyCommunityInfoApplication)
    .post('/api/community/mod', controller.user.modifyCommunityInfo)
    .get('/api/activity', controller.user.getMyCommunityActivityField)
    .post('/api/activity', controller.user.applyActivityField)
    .all('*', async (ctx, next) => {
      //验证用户组
      if (ctx.session.role !== 'ADMIN') ctx.status = 403;
      else await next();
    })
    .get('/api/allCommunity', controller.admin.getAllCommunity)
    .post('/api/allCommunity/pass', controller.admin.passCommunityApplication)
    .post('/api/allCommunity/pass', controller.admin.rejectCommunityApplication)
    .get('/api/allCommunity/mod', controller.admin.getAllCommunityModifyInfoApplication)
    .post('/api/allCommunity/mod/pass', controller.admin.passCommunityModifyInfoApplication)
    .post('/api/allCommunity/mod/reject', controller.admin.rejectCommunityModifyInfoApplication)
    .post('/api/freezeCommunity', controller.admin.freezeCommunity)
    .post('/api/thawCommunity', controller.admin.thawCommunity)
    .post('/api/rankCommunity', controller.admin.rankCommunity)
    .get('/api/allActivity', controller.admin.getAllActivityField)
    .post('/api/allActivity', controller.admin.createActivityField)
    .post('/api/allActivity/pass', controller.admin.passActivityFieldApplication)
    .post('/api/allActivity/reject', controller.admin.rejectActivityFieldApplication)
};
