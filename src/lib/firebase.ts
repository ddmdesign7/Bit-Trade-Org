// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError
} from "firebase/auth";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCAIeZ5AGcDVRaTDvZw1upfAsoxXyItV3A",
  authDomain: "workdesk-7a5ed.firebaseapp.com",
  projectId: "workdesk-7a5ed",
  storageBucket: "workdesk-7a5ed.firebasestorage.app",
  messagingSenderId: "726675257274",
  appId: "1:726675257274:web:499a4bf322a010cd8a4f83"
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Friendly error message parser for Firebase Auth errors
export function formatAuthError(error: unknown): string {
  if (!error) return "An unexpected error occurred. Please try again.";
  
  const authErr = error as AuthError;
  const code = authErr?.code || '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return "Invalid email or password. Please check your credentials or create an account.";
    case 'auth/email-already-in-use':
      return "An account with this email address already exists. Please sign in instead.";
    case 'auth/weak-password':
      return "The password is too weak. Please use at least 6 characters.";
    case 'auth/invalid-email':
      return "Please enter a valid email address.";
    case 'auth/popup-closed-by-user':
      return "Google Sign-In popup was closed before completing.";
    case 'auth/popup-blocked':
      return "Sign-in popup was blocked by your browser. Please allow popups for this site.";
    case 'auth/operation-not-allowed':
      return "This sign-in provider is not enabled in the Firebase console. Please enable it under Firebase Authentication > Sign-in method.";
    case 'auth/too-many-requests':
      return "Too many unsuccessful attempts. Access temporarily restricted. Try again later.";
    case 'auth/network-request-failed':
      return "Network connection failed. Please check your internet connection and try again.";
    case 'auth/requires-recent-login':
      return "This operation requires a recent sign-in. Please log out and sign in again.";
    default:
      return authErr?.message || "Authentication error occurred. Please try again.";
  }
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  onAuthStateChanged,
};
export type { FirebaseUser };
