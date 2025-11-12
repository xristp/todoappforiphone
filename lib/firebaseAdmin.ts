import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App | undefined;
let db: Firestore | undefined;

/**
 * Get Firebase Admin instance (lazy initialization)
 */
export function getFirebaseAdmin(): App {
  if (app) return app;

  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing Firebase Admin credentials');
    }

    app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else {
    app = getApps()[0];
  }

  return app;
}

/**
 * Get Firestore instance
 */
export function getFirestoreDb(): Firestore {
  if (db) return db;

  getFirebaseAdmin();
  db = getFirestore();
  
  return db;
}
