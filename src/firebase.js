import firebase from 'firebase';
import 'firebase/firestore';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyA-ebtaiK2s4B3fAOXu0X_3sRmR1Z5kB7k",
  authDomain: "collabrative-music-app.firebaseapp.com",
  databaseURL: "https://collabrative-music-app.firebaseio.com",
  projectId: "collabrative-music-app",
  storageBucket: "collabrative-music-app.appspot.com",
  messagingSenderId: "545974759085"
};
firebase.initializeApp(config);

export default firebase;
