const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: "https://crm-backend-atjh.onrender.com",
            changeOrigin: true,
        })
    );
};
