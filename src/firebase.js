import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAfjezOlXIt5eYHl6pLHaFfADWpLM10bNE",
    authDomain: "affy-danny-wedding-app.firebaseapp.com",
    projectId: "affy-danny-wedding-app",
    storageBucket: "affy-danny-wedding-app.firebasestorage.app",
    messagingSenderId: "969953371628",
    appId: "1:969953371628:web:6254b101afa78ab28b8cc9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // We added this!