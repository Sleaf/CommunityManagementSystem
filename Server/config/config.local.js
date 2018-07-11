'use strict';
module.exports = appInfo => {
  const config = {};
  config.security = {
    csrf: {
      enable: false,
    },
  };
  return config;
};
