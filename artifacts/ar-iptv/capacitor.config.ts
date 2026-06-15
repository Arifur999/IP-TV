import type { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.ariptv.app',
  appName: 'AR IPTV',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#000000'
  }
};

export default config;

/*
 * APK Build Steps:
 * 1. npm run build          (static export)
 * 2. npx cap add android
 * 3. npx cap sync
 * 4. npx cap open android   (opens Android Studio)
 * 5. Build → Generate Signed Bundle/APK
 */
