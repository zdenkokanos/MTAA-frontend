import 'dotenv/config'; // load .env

export default {
  expo: {
    name: "Tourinify",
    slug: "tournify",
    scheme: "tournify",
    version: "1.0.0",
    sdkVersion: "53.0.0",
    extra: {
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      "eas": {
        "projectId": "54c22d57-3003-47b4-afe0-f75e0e5a4be8"
      },
    },
    "android": {
    "package": "com.humptee25.tournify",
    googleServicesFile: "./google-services.json",
    },
    "ios": {
    "bundleIdentifier": "com.humptee25.tournify"
    },
},
};
