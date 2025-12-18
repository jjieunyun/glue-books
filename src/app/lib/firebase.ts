import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// 서버 사이드 렌더링 시 중복 초기화 방지
const app = getApps().length === 0 ? (() => {
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'your_api_key_here') {
        console.error("Firebase Configuration Error: API Key is missing or invalid.");
        console.error("Please ensure you have created a .env.local file with your actual Firebase configuration values.");
        console.error("Current apiKey:", firebaseConfig.apiKey);
    }
    return initializeApp(firebaseConfig);
})() : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();