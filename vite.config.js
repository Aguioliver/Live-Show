import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Atualiza o app automaticamente
      workbox: {
        // Define quais arquivos o Service Worker deve gerenciar
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'Live Show Player',
        short_name: 'LiveShow',
        description: 'Um player de música para shows e ensaios.',
        theme_color: '#1f2937', // Cor da barra de título no Android (bg-gray-800)
        background_color: '#111827', // Cor da tela de splash (bg-gray-900)
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
