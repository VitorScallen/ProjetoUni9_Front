const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https');

// Agente HTTPS que aceita certificados auto-assinados
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://localhost:7181',
      changeOrigin: true,
      secure: false, // Aceita certificados SSL auto-assinados
      agent: httpsAgent, // Usa o agente HTTPS customizado
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log('✅ [Proxy] Requisição:', req.method, req.url, '-> https://localhost:7181' + req.url);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('✅ [Proxy] Resposta:', proxyRes.statusCode, req.url);
      },
      onError: (err, req, res) => {
        console.error('❌ [Proxy] Erro:', err.message);
        console.error('❌ [Proxy] Detalhes:', err.code);
        res.status(500).json({ 
          error: 'Erro no proxy',
          message: err.message,
          code: err.code,
          hint: 'Verifique se a API está rodando em https://localhost:7181'
        });
      }
    })
  );
};
