import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-ignore
import { handleApiRequest } from './server/apiRouter.js';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-database-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api')) {
            await handleApiRequest(req, res);
            return;
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api')) {
            await handleApiRequest(req, res);
            return;
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true
  },
  preview: {
    port: 5173,
    host: true,
    allowedHosts: true
  }
});
