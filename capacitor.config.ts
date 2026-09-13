import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.smarttalky.app',
  appName: 'SmartTalky',
  webDir: 'apps/web/dist',
  bundledWebRuntime: false,
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
  },
}

export default config
