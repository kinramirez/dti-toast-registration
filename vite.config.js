import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const defaultApiBaseUrl = 'https://api-dti.myiiap.com/api/v1';
  const remoteApiBaseUrl = env.VITE_API_BASE_URL?.trim() || defaultApiBaseUrl;

  let proxyTarget = 'https://api-dti.myiiap.com';

  try {
    proxyTarget = new URL(remoteApiBaseUrl).origin;
  } catch {
    proxyTarget = 'https://api-dti.myiiap.com';
  }

  return {
    appType: 'spa',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api/v1': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },

    plugins: [
      tailwindcss(),
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
    ],
  };
});
