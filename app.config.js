export default {
  expo: {
    name: "CheckMate",
    slug: "checkmate-tasks",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    scheme: "checkmate",
    platforms: ["ios", "android"],
    newArchEnabled: true,
    plugins: [
      "expo-router",
      "expo-font",
      [
        "expo-notifications",
        {
          icon: "./assets/notification-icon.png",
          color: "#1a1a1a",
          sounds: []
        }
      ],
      "expo-dev-client"
    ],
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#f5f5f0"
    },
    ios: {
      bundleIdentifier: "com.yourname.checkmate",
      supportsTablet: true
    },
    android: {
      package: "com.yourname.checkmate",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "./assets/favicon.png"
    }
  }
};