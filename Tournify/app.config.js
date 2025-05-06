import 'dotenv/config'; // load .env

export default {
  expo: {
    name: "Tourinify",
    slug: "tournify",
    scheme: "tournify",
    version: "1.0.0",
    sdkVersion: "53.0.0",
    ios: {
      bundleIdentifier: "com.humptee25.tournify", // ✅ must be unique & valid
      buildNumber: "1.0.0",
      // googleServicesFile: "./GoogleService-Info.plist", // optional if using Firebase
    },
    android: {
      package: "com.humptee25.tournify", // recommended for Android too
      // googleServicesFile: "./google-services.json",
    },
    owner: "humptee25",
    extra: {
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      eas: {
        projectId: "54c22d57-3003-47b4-afe0-f75e0e5a4be8"
      }
    },
  },
};
