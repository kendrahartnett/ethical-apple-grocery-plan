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
  },
  preview: {
    port,
    host: '127.0.0.1',
  },
});
