import { auth } from "../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Signup
export const signup = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

// Login
export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Logout
export const logout = () => signOut(auth);