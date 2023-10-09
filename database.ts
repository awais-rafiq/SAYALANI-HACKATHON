
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage} from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyBwj2E23NXXLUGRZ6yKHWV_66ImSXfn0Xg",
  authDomain: "my-hackarthon.firebaseapp.com",
  projectId: "my-hackarthon",
  storageBucket: "my-hackarthon.appspot.com",
  messagingSenderId: "920256348871",
  appId: "1:920256348871:web:3bba57bc0e88e942e3f4e2",
  measurementId: "G-G0XN4K3CPW"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage= getStorage(app);



// Initialize Cloud Firestore and get a reference to the service

export {db,storage}