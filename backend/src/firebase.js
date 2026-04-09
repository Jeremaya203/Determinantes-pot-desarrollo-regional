import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';

let db;

export function initFirebase() {
  if (admin.apps.length > 0) {
    db = admin.firestore();
    return db;
  }

  let serviceAccount;

  // Opción B: JSON en variable de entorno (recomendado para producción)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }
  // Opción A: archivo local
  else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const path = resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    serviceAccount = JSON.parse(readFileSync(path, 'utf8'));
  } else {
    throw new Error('No se encontró configuración de Firebase. Define FIREBASE_SERVICE_ACCOUNT_JSON o FIREBASE_SERVICE_ACCOUNT_PATH en .env');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

  db = admin.firestore();
  console.log('✅ Firebase inicializado correctamente');
  return db;
}

export function getDb() {
  if (!db) throw new Error('Firebase no inicializado. Llama a initFirebase() primero.');
  return db;
}
