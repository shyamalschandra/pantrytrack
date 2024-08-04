import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
// ... other imports if needed ...

const projectId = 'pantrytracker-363c3'; // Replace with your actual project ID

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: projectId,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

console.log('Firebase Config:', firebaseConfig);

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization error", error);
  throw error; // Rethrow to prevent further execution
}

export const db = getFirestore(app);
export const storage = getStorage(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support all of the features required to enable persistence');
  }
});

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