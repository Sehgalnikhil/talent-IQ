import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) return 'vendor-3d';
            if (id.includes('monaco-editor')) return 'vendor-monaco';
            if (id.includes('@clerk')) return 'vendor-clerk';
            if (id.includes('framer-motion') || id.includes('gsap')) return 'vendor-animation';
            if (id.includes('stream-chat') || id.includes('@stream-io')) return 'vendor-stream';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('axios') || id.includes('@tanstack')) return 'vendor-query';
            return 'vendor-utils';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
    reportCompressedSize: false, // Speed up builds
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});

