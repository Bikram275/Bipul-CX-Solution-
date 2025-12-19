import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// =========================================================================
// IMPORTANT: YOU MUST REPLACE THE CONFIG BELOW WITH YOUR OWN FROM FIREBASE
// =========================================================================
// 1. Go to https://console.firebase.google.com/
// 2. Create a project.
// 3. Register a web app.
// 4. Copy the "firebaseConfig" object.
// 5. Go to Firestore Database -> Create Database -> Start in Test Mode.

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };