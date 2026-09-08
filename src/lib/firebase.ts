import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0644491808",
  appId: "1:958951673378:web:7152b280e088a0059ec47b",
  apiKey: "AIzaSyATJIl9EqfjP27C-SnRNCPnzoKPjeItyEE",
  authDomain: "gen-lang-client-0644491808.firebaseapp.com",
  storageBucket: "gen-lang-client-0644491808.firebasestorage.app",
  messagingSenderId: "958951673378"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-mediaajarinforma-c7e659c6-59f2-405d-8902-f72f8e739cd1");
