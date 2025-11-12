import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate config before initializing
const isConfigValid = Object.values(firebaseConfig).every(value => value && value !== 'undefined');

// Initialize Firebase (only once and only if config is valid)
let app;
let auth;
let googleProvider;

if (typeof window !== 'undefined' && isConfigValid) {
  // Only initialize on client side with valid config
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
}

// Export with fallbacks
export { auth, googleProvider };
