import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cholaconnect',
  appName: 'Chola Connect',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0, // Hide splash immediately after the app starts
      launchAutoHide: true, // Automatically hides after the app is ready
      backgroundColor: '#ffffff', // Set splash screen background color
      // launchShowDuration: 3000, // Show splash for 3 seconds
      // launchAutoHide: false, // Don't auto hide - we'll control it manually
      // backgroundColor: '#ffffff',
      // androidSplashResourceName: 'splash',
      // androidScaleType: 'CENTER_CROP',
      // showSpinner: true,
      // spinnerColor: '#999999',
    },
  },
};

export default config;
