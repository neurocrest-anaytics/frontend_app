// vite.config.(js|ts)
import { VitePWA } from 'vite-plugin-pwa';

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: { cleanupOutdatedCaches: true }
    })
  ]
};
