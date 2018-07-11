'use strict';
const mysql = require('../../accounts').mysql;

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1531286926622_5403';

  // add your config here
  config.middleware = [];

  // add mySQL database config
  config.mysql = {
    client: {
      // host
      host: mysql.host,
      // 端口号
      port: mysql.port,
      // 用户名
      user: mysql.user,
      // 密码
      password: mysql.password,
      // 数据库名
      database: mysql.database,
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };
  return config;
};
