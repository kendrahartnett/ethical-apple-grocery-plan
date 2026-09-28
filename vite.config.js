import { defineConfig } from 'vite';

const port = Number(process.env.PORT || 5173);
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base,
  root: '.',
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },

});