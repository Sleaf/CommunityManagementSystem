'use strict';
const path = require('path');
const fs = require('mz/fs');

module.exports = app => {
  const {router, controller} = app;

//   /*默认返回前端静态网页*/
//   router.get(/^(?!\/api)/, async ctx => {
//     ctx.set('Content-Type', 'text/html; charset=utf-8');
//     const tpl = path.join(ctx.app.config.static.dir, 'index.html');
// // 如果没变化的话可以 cache 起来，不用每次 read
//     ctx.body = await fs.readFile(tpl, 'utf-8');
//   });

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
    .get('/api/allActivity', controller.admin.getAllActivityField)
    .all('*', async (ctx, next) => {
      //验证用户组
      if (ctx.session.role !== 'ADMIN') ctx.status = 403;
      else await next();
    })
    .get('/api/allCommunity', controller.admin.getAllCommunity)
    .post('/api/allCommunity/pass', controller.admin.passCommunityApplication)
    .post('/api/allCommunity/reject', controller.admin.rejectCommunityApplication)
    .get('/api/allCommunity/mod', controller.admin.getAllCommunityModifyInfoApplication)
    .post('/api/allCommunity/mod/pass', controller.admin.passCommunityModifyInfoApplication)
    .post('/api/allCommunity/mod/reject', controller.admin.rejectCommunityModifyInfoApplication)
    .post('/api/allCommunity/freeze', controller.admin.freezeCommunity)
    .post('/api/allCommunity/thaw', controller.admin.thawCommunity)
    .post('/api/allCommunity/rank', controller.admin.rankCommunity)
    .post('/api/allActivity', controller.admin.createActivityField)
    .get('/api/allActivityApplication', controller.admin.getAllActivityFieldApplication)
    .post('/api/allActivity/pass', controller.admin.passActivityFieldApplication)
    .post('/api/allActivity/reject', controller.admin.rejectActivityFieldApplication)
};
