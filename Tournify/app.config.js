// import 'dotenv/config';

// export default {
//   expo: {
//     name: "Tourinify",
//     slug: "tournify",
//     version: "1.0.0",
//     orientation: "portrait",
//     icon: "./assets/images/icon.png",
//     scheme: "tournify", // changed from 'myapp' to match slug
//     userInterfaceStyle: "automatic",
//     newArchEnabled: true,
//     sdkVersion: "53.0.0",
//     ios: {
//       supportsTablet: true,
//       bundleIdentifier: "com.anonymous.Tournify"
//     },
//     android: {
//       adaptiveIcon: {
//         foregroundImage: "./assets/images/adaptive-icon.png",
//         backgroundColor: "#ffffff"
//       },
//       package: "com.anonymous.Tournify"
//     },
//     web: {
//       bundler: "metro",
//       output: "static",
//       favicon: "./assets/images/favicon.png"
//     },
//     plugins: [
//       "expo-router",
//       [
//         "expo-splash-screen",
//         {
//           image: "./assets/images/splash-icon.png",
//           imageWidth: 200,
//           resizeMode: "contain",
//           backgroundColor: "#ffffff"
//         }
//       ],
//       [
//         "expo-location",
//         {
//           locationAlwaysAndWhenInUsePermission: "Allow Tourinify to use your location."
//         }
//       ],
//       [
//         "expo-camera",
//         {
//           cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
//           microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
//           recordAudioAndroid: true
//         }
//       ]
//     ],
//     experiments: {
//       typedRoutes: true
//     },
//     extra: {
//       GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
//     }
//   }
// };


import 'dotenv/config';

export default {
  expo: {
    name: "Tournify",
    slug: "tournify",
    icon: "./assets/images/icon.png",
    version: "1.0.0",
    sdkVersion: "53.0.0",
    experiments: {
      typedRoutes: true
    },
    extra: {
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      "eas":{
        "projectId": "54c22d57-3003-47b4-afe0-f75e0e5a4be8"
      }
    },
    "android": {
      "package": "com.humptee25.tournify"
    },
    "ios": {
      "bundleIdentifier": "com.humptee25.tournify"
    }
  },
};
