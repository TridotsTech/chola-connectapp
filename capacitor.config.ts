import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cholahr.android',
  appName: 'Chola HR',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0, // Hide splash immediately after the app starts
      launchAutoHide: true, // Automatically hides after the app is ready
      backgroundColor: '#ffffff', // Set splash screen background color
    },
  },
};

export default config;
