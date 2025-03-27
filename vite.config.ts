import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react-router-dom'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': {},
    'process.env.REACT_ROUTER_FUTURE_FLAGS': JSON.stringify({
      v7_startTransition: true,
      v7_relativeSplatPath: true
    })
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.zoom.us https://*.vercel.app;
        style-src 'self' 'unsafe-inline' https://*.zoom.us https://*.vercel.app;
        img-src 'self' data: https://*.zoom.us https://*.vercel.app;
        connect-src 'self' https://*.zoom.us https://api.zoom.us https://*.vercel.app;
        frame-src 'self' https://*.zoom.us https://*.vercel.app;
      `.replace(/\s+/g, ' ').trim()
    },
    port: 5174,
  },
  build: {
    sourcemap: true,
  }
});
