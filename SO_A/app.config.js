// app.config.js - Complete example
export default {
    expo: {
      name: "School Management App",
      slug: "so_a",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "light",
      cli: {
        appVersionSource: "local"
      },
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      assetBundlePatterns: [
        "**/*"
      ],
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.anik8mishra.soa"
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#FFFFFF"
        },
        package: "com.anik8mishra.soa"
      },
      web: {
        favicon: "./assets/favicon.png"
      },
      extra: {
        eas: {
          projectId: "df5777d1-3af7-4c8d-910e-3f2747e71c6a"
        }
      }
    }
  };
  