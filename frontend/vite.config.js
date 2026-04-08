import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@stream-io') || id.includes('stream-chat')) return 'vendor-stream';
            if (id.includes('monaco-editor')) return 'vendor-monaco';
            if (id.includes('three') || id.includes('@react-three')) return 'vendor-3d';
            if (id.includes('@clerk')) return 'vendor-clerk';
            if (id.includes('framer-motion') || id.includes('gsap') || id.includes('lenis')) return 'vendor-motion';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('axios') || id.includes('@tanstack') || id.includes('socket.io')) return 'vendor-core-utils';
            return 'vendor-misc';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
    reportCompressedSize: false,
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug', 'console.warn'],
      },
    },
  },
});
