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
    },
  },
};
