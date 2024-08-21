import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getMessaging  } from "firebase/messaging/sw";


const firebaseConfig = {
  apiKey: "AIzaSyC_9DPC2TnSLiX1ofc97xUC-YLfDmPA7xE",
  authDomain: "facebook-fbaa7.firebaseapp.com",
  projectId: "facebook-fbaa7",
  storageBucket: "facebook-fbaa7.appspot.com",
  messagingSenderId: "407905549963",
  appId: "1:407905549963:web:d5739bf651633df3a81e8e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

const messaging = getMessaging(app);






export { app, auth, messaging }
setPersistence(auth, browserLocalPersistence);

