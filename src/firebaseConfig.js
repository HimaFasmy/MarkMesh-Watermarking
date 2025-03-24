// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7vyFKnet7rcYVqEckz46BhVELwrdP27w",
  authDomain: "wmark-2ff19.firebaseapp.com",
  projectId: "wmark-2ff19",
  storageBucket: "wmark-2ff19.appspot.com",
  messagingSenderId: "316871967122",
  appId: "1:316871967122:web:16265396719b71adbd414b",
  measurementId: "G-YQ92E11Y4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Export auth so it can be used in other parts of your app
export { auth };