
export default {
  expo: {
    name: "CheckMate",
    slug: "checkmate-tasks",
    extra: {
      eas: {
        projectId: "b8e37823-81ef-47df-af55-69a2609d4380"
      }
    },
    jsEngine: "hermes",
    version: "1.0.2",
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
      "expo-dev-client",
      "expo-sqlite"
    ],
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#f5f5f0"
    },
    ios: {
      bundleIdentifier: "com.yourname.checkmate",
      supportsTablet: true,
      jsEngine: "jsc"
    },
    android: {
      package: "com.yourname.checkmate",
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    owner: "cjohnd",
    updates: {
      url: "https://u.expo.dev/b8e37823-81ef-47df-af55-69a2609d4380"
    },
    runtimeVersion: "1.0.2"
  }
};
