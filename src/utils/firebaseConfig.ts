import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

console.log('Firebase Config:', firebaseConfig); // Add this line for debugging

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  
  // Enable IndexedDB persistence immediately after initializing the app
  const db = getFirestore(app);
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
      console.log("Multiple tabs open, persistence can only be enabled in one tab at a time.");
    } else if (err.code == 'unimplemented') {
      console.log("The current browser does not support all of the features required to enable persistence");
    }
  });
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app); // Added this line to export the firestore instance



export async function testFirebaseStorage() {
  try {
    const testRef = ref(storage, 'test/hello-world.txt');
    await uploadString(testRef, 'Hello, World!');
    const downloadURL = await getDownloadURL(testRef);
    console.log('File uploaded successfully. Download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error testing Firebase Storage:', error);
    throw error;
  }
}

// ... export other services if needed ...