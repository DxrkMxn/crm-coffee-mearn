const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function override(config, env) {
  config.proxy = {
    '/api': {
      target: 'https://crm-backend-atjh.onrender.com',
      changeOrigin: true,
    },
  };

  config.headers = {
    'Access-Control-Allow-Origin': '*',
  };

  return config;
};
