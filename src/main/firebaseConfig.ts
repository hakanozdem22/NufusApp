import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'

// Firebase Console -> Project Settings -> General -> Your apps -> SDK setup and configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC5RGDBE5voLGc5tkGJyQc-4xaQaadDK_w',
  authDomain: 'mysuperapp-a4c6d.firebaseapp.com',
  projectId: 'mysuperapp-a4c6d',
  storageBucket: 'mysuperapp-a4c6d.firebasestorage.app',
  messagingSenderId: '147997334576',
  appId: '1:147997334576:web:be4e31fa7a6aabfd25a1f5',
  measurementId: 'G-9SWZ6HZLLW'
}

// Firebase'i başlat
const app = initializeApp(firebaseConfig)

// Firestore veritabanını al
const db = getFirestore(app)

// Firebase Authentication
const auth = getAuth(app)

// Anonim oturum açma fonksiyonu
export async function initFirebaseAuth(): Promise<void> {
  try {
    const credential = await signInAnonymously(auth)
    console.log('Firebase: Anonim oturum açıldı. UID:', credential.user.uid)
  } catch (error) {
    console.error('Firebase: Anonim oturum açma hatası:', error)
    throw error
  }
}

export { db, auth }
