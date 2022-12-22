import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

// Use your own configs!
const app = firebase.initializeApp({
  apiKey: "AIzaSyCtv9ghmJY-cKmbrpTnJ8OKe5Nkuh_-4cw",
  authDomain: "auction-62df8.firebaseapp.com",
  projectId: "auction-62df8",
  storageBucket: "auction-62df8.appspot.com",
  messagingSenderId: "1053617218020",
  appId: "1:1053617218020:web:6796dadc9c2117b7e4e7f1"
});

export const timestamp = firebase.firestore.FieldValue.serverTimestamp;
export const firestoreApp = app.firestore();
export const storageApp = app.storage();
export const authApp = app.auth();
