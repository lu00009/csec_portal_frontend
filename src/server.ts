// server.ts
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Proxy API requests
  server.use(
    '/api',
    createProxyMiddleware({
      target: 'https://cse-portal-backend-1.onrender.com',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }, // Remove /api prefix before forwarding
    })
  );

  // Handle Next.js pages
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});