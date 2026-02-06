import { initializeApp, getApps } from "firebase/app";
import {getFirestore, Firestore} from "firebase/firestore";

let db: Firestore;
if(typeof window != "undefined"){
const firebaseConfig = {
  apiKey: "AIzaSyDxMQP8zwD0p1Qr6UwIGddlj-Ifbmqe99o",
  authDomain: "skcreations-54754.firebaseapp.com",
  projectId: "skcreations-54754",
  storageBucket: "skcreations-54754.firebasestorage.app",
  messagingSenderId: "563381156202",
  appId: "1:563381156202:web:cd741b322775c054cb8d13",
  measurementId: "G-GX59BMBCLX"
};
 if (!getApps().length) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    db = getFirestore();
  }
}
 export {db};