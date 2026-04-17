import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 NEW

  useEffect(() => {
   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  if (!firebaseUser) {
    setUser(null);
    setRole(null);
    setLoading(false);
    return;
  }

  // 🔥 ADD THIS
  console.log("🔥 UID:", firebaseUser.uid);

  setUser(firebaseUser);

  try {
    const docRef = doc(db, "users", firebaseUser.uid);
    const docSnap = await getDoc(docRef);

    // 🔥 ADD THIS
    console.log("🔥 FIRESTORE DATA:", docSnap.data());

    if (docSnap.exists()) {
      setRole(docSnap.data().role);
    } else {
      console.warn("❌ User doc not found in Firestore");
      setRole("user");
    }
  } catch (err) {
    console.error("Role fetch error:", err);
    setRole("user");
  }

  setLoading(false);
});
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);