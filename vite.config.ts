import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      scss: {
        additionalData: (source, filename) => {
          // Don't add imports to _variables.scss and _mixins.scss themselves
          if (filename.includes('_variables.scss') || filename.includes('_mixins.scss')) {
            return source;
          }
          
          return `@use "/src/styles/_variables.scss" as *; @use "/src/styles/_mixins.scss" as *; ${source}`;
        },
      },
    },
    postcss: './postcss.config.js',
  },
}); 