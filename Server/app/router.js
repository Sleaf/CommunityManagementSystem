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
};
