import { defineConfig } from 'vite';

const port = Number(process.env.PORT || 5173);
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base,
  root: '.',
  server: {
    port,
    strictPort: true,
    host: '127.0.0.1',
    proxy: { '/api': `http://127.0.0.1:${process.env.API_PORT || 3001}` },
  },
  preview: {
    port,
    host: '127.0.0.1',
    proxy: { '/api': `http://127.0.0.1:${process.env.API_PORT || 3001}` },
  },

});
