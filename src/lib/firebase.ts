import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

/**
 * Configuration publique du projet Firebase « Microdor ».
 * Ces valeurs identifient le projet ; elles ne donnent aucun accès à elles seules.
 * La sécurité repose sur les règles Firestore (firestore.rules).
 */
const firebaseConfig = {
  apiKey: 'AIzaSyCxAZkjni7Un3zYvQa9-8GYvVCoASeII5Y',
  authDomain: 'microdor-d7851.firebaseapp.com',
  projectId: 'microdor-d7851',
  storageBucket: 'microdor-d7851.firebasestorage.app',
  messagingSenderId: '30513291930',
  appId: '1:30513291930:web:c4a6536376ab4cbf1eb523',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
auth.languageCode = 'fr'
export const db = getFirestore(app)
