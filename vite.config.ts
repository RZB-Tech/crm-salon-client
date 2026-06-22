import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_API_PROXY_TARGET || 'http://130.49.170.147:8000';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          ws: true,
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              const setCookie = proxyRes.headers['set-cookie'];
              if (!setCookie) return;

              proxyRes.headers['set-cookie'] = setCookie.map((cookie) =>
                cookie.replace(/;\s*Secure/gi, ''),
              );
            });
          },
        },
      },
    },
  };
});
