'use strict';
const path = require('path');
const fs = require('fs');

/**
 * @param {Egg.Application} app - egg application
 */
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
    .post('/api/register', controller.user.register)
    .post('/api/login', controller.user.login);

  /*需要登录验证*/
  router
    .all('*', async (ctx, next) => {
      //验证session
      if (ctx.session.username == null) ctx.status = 403;
      else await next();
    })

};