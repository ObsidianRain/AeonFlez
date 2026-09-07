import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const requiredConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

const missingConfig = Object.entries(requiredConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const firebaseConfigError =
  missingConfig.length > 0
    ? `Missing Firebase configuration: ${missingConfig.join(", ")}.`
    : null;

const firebaseApp = firebaseConfigError
  ? null
  : getApps().length > 0
    ? getApp()
    : initializeApp(requiredConfig);

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
