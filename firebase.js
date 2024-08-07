// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAA_aeU6-SmNNwiynIsg_cNptG1awWBwoM",
  authDomain: "pantry-tracker-34c43.firebaseapp.com",
  projectId: "pantry-tracker-34c43",
  storageBucket: "pantry-tracker-34c43.appspot.com",
  messagingSenderId: "533150152882",
  appId: "1:533150152882:web:3961f040c69c34be2df1ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export{firestore}